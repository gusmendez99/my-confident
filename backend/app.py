import os
from string import ascii_lowercase
import functools
import json

import config
from flask import (
    Flask,
    jsonify,
    make_response,
    redirect,
    render_template,
    request,
    url_for,
)
from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO, join_room, leave_room, send, emit, disconnect
from flask_sslify import SSLify
from flask_cors import CORS
from flask_praetorian import Praetorian, current_user
from flask_praetorian.decorators import auth_required

app = Flask(__name__)
app.config.from_object(os.environ["APP_SETTINGS"])
# Cors, Guardian and other config
cors = CORS(app)
guard = Praetorian(app)
socketio = SocketIO(app)
db = SQLAlchemy(app)
sslify = SSLify(app)


# Import models
import models

# Invalidate tokens purpose
blacklist = set()
# a token is unique by its jti
def is_blacklisted(jti):
    return jti in blacklist


# For active chats purpose
active_chats = dict()


# Initializing config data
# Run app
cors.init_app(app)
db.init_app(app)
guard.init_app(app, models.User, is_blacklisted=is_blacklisted)
sslify.init_app(app)
socketio.run(app)


# Usernames must contain only letters (a-z), numbers (0-9), dashes (-), underscores (_)
VALID_USERNAME_CHARS = set(
    ["-", "_"] + [str(i) for i in range(0, 10)] + list(ascii_lowercase)
)
API_BASE_URL = "/api/v1"


@app.route(API_BASE_URL)
def home():
    return {"Hello": "World"}, 200


#########################################
#               Auth Routes             #
#########################################

@app.route(f"{API_BASE_URL}/login", methods=["POST"])
def login():
    """
    Logs a user in by parsing a POST request containing user credentials and
    issuing a JWT token.
    """
    req = request.get_json(force=True)
    username = req.get("username", None)
    password = req.get("password", None)

    user = guard.authenticate(username, password)
    user_saved = models.find_user_by_name(username).to_dict()
    return jsonify(token=guard.encode_jwt_token(user), user_data=user_saved["user_data"])


@app.route(f"{API_BASE_URL}/refresh-token", methods=["POST"])
def refresh():
    """
    Refreshes an existing JWT by creating a new one that is a copy of the old
    except that it has a refrehsed access expiration.
    """
    print("refresh token request...")
    old_token = guard.read_token_from_header()
    new_token = guard.refresh_jwt_token(old_token)
    return jsonify(token=new_token)


@app.route(f"{API_BASE_URL}/sign-up", methods=["POST"])
def create_user():
    req = request.get_json(force=True)
    username = req.get("username", None)
    password = req.get("password", None)
    public_key = req.get("public_key", None)
    user_data = req.get("user_data", None)

    # Validate entered username and password
    error = None
    if None in [username, password, public_key, user_data]:
        error = "Request missing a field!"
    if len(username) == 0 or len(username) > 32:
        error = "Invalid username. Must be nonempty and contain at most 32 characters."
    if len([c for c in username if c.lower() not in VALID_USERNAME_CHARS]) > 0:
        error = "Invalid username. Must contain only letters (a-z), numbers (0-9), dashes (-), underscores (_)."
    if len(password) < 8 or len(password) > 128:
        error = "Invalid password. Must be at least 8 characters and at most 128 characters."
    if models.check_if_user_exists(username):
        error = "Username already taken."

    # Invalid username or password
    if error is not None:
        return jsonify(error=error)
    # Add new user to database
    id = models.add_user_to_db(username, password, public_key, user_data)
    if id is None:
        # Database error
        return jsonify(error="Unexpected error.")

    # Return new user data
    user_saved = models.find_user_by_name(username).to_dict()
    user = guard.authenticate(username, password)
    return jsonify(
        token=guard.encode_jwt_token(user),
        id=id,
        username=username,
        public_key=public_key,
        user_data=user_data,
    )


@app.route(f"{API_BASE_URL}/logout", methods=["POST"])
@auth_required
def logout():
    # Clear stored session variables
    token = guard.read_token_from_header()
    data = guard.extract_jwt_token(token)
    blacklist.add(data["jti"])
    return jsonify(message="token was blacklisted ({})".format(token))


#########################################
#           Application Routes          #
#########################################


@app.route(f"{API_BASE_URL}/public_key")
@auth_required
def get_public_key():

    sender_public_key = current_user().public_key
    receiver_username = request.args.get('receiver_username', '')
    # Make sure that the receiver exists
    if not models.check_if_user_exists(receiver_username):
        return jsonify(error="This user does not exist.")
    # Find receiver user
    receiver = models.find_user_by_name(receiver_username)
    return jsonify(
        sender_public_key=sender_public_key, receiver_public_key=receiver.public_key
    )


@app.route(f"{API_BASE_URL}/user/find-all")
@auth_required
def find_users():
    username = request.args.get('term', '')
    similar_usernames = models.find_user_by_name_fuzzy(username)
    usernames_found = [
        {"label": user.to_dict()["username"], "value": user.to_dict()["username"]}
        for user in similar_usernames
    ]
    return json.dumps(usernames_found)


@app.route(f"{API_BASE_URL}/chats")
@auth_required
def get_all_chats():
    user_id = current_user().id
    # Deliver chats data
    chats = [chat.to_dict() for chat in models.get_chats_for_user(user_id)]
    return jsonify(chats=chats)


@app.route(f"{API_BASE_URL}/chat/create", methods=["POST"])
@auth_required
def create_chat():
    req = request.get_json(force=True)
    sender_public_key = current_user().public_key
    username = current_user().username
    user_id = current_user().id

    sk_sym_1 = req.get("sk_sym_1", "")
    sk_sym_2 = req.get("sk_sym_2", "")
    receiver_username = req.get("receiver_username", "")
    receiver_public_key = req.get("receiver_public_key", "")

    # Safety check
    if (
        (len(username) > 32)
        or (len(receiver_username) > 32)
        or (len(sk_sym_1) > 500)
        or (len(sk_sym_2) > 500)
    ):
        return jsonify(error="Unable to create chat.")
    if "" in [sk_sym_1, sk_sym_2, receiver_username, receiver_public_key]:
        return jsonify(error="Unable to create chat.")
    if receiver_username == username:
        return jsonify(error="Can not create a chat with yourself.")
    receiver = models.find_user_by_name(receiver_username)
    if (receiver is None) or (receiver.public_key != receiver_public_key):
        return jsonify(error="Unexpected error.")
    # Check if such a chat already exists
    existing_chat_id = models.find_chat_by_users(user_id, receiver.id)
    if existing_chat_id is not None:
        return jsonify(chat_id=existing_chat_id)
    # Chat does not already exist; must create new chat
    chat_id = models.create_chat(
        user_id, username, sk_sym_1, receiver.id, receiver.username, sk_sym_2
    )
    # Safety check
    if chat_id is None:
        return jsonify(error="Unable to create chat.")
    return jsonify(chat_id=chat_id)


@app.route(f"{API_BASE_URL}/chat/delete/<int:id>", methods=["POST"])
@auth_required
def delete_chat(id):
    user_id = current_user().id
    chat = models.get_chat(id)
    if not chat or (user_id != chat.user1_id and user_id != chat.user2_id):
        return make_response(jsonify(error="Chat not found"), 404)
    models.delete_chat(id)
    return jsonify(success=f"Chat {id} deleted successfully")


@app.route(f"{API_BASE_URL}/chat/<int:id>")
@auth_required
def chat(id):
    username = current_user().username
    user_id = current_user().id
    # Check that this chat exists and user is valid participant
    chat = models.get_chat(id)
    if not chat or (user_id != chat.user1_id and user_id != chat.user2_id):
        return make_response(jsonify(error="Chat not found"), 404)
    chat_id = chat.id
    active_chats[user_id] = chat_id

    # Get the 'other' user in the chat
    other_userid = chat.user1_id
    other_username = chat.user1_name
    encrypted_symmetric_key = chat.user2_sk_sym
    if user_id == chat.user1_id:
        other_userid = chat.user2_id
        other_username = chat.user2_name
        encrypted_symmetric_key = chat.user1_sk_sym
    # Get messages for this chat and render the chat view
    messages = [message.to_dict() for message in models.get_chat_messages(id)]
    return jsonify(
        chat_id=chat_id,
        enc_sym_key=encrypted_symmetric_key,
        messages=messages,
        user_id=user_id,
        username=username,
        other_user=other_username,
    )


@app.route(f"{API_BASE_URL}/chat/<int:id>/update-pairs", methods=["POST"])
@auth_required
def chat_encoded_pairs(id):
    req = request.get_json(force=True)
    encoded_pairs = req.get("pairs", [])

    if encoded_pairs is None:
        return jsonify(error="Bad request. No encoded pairs found.")

    added_pair_count = models.insert_pairs(encoded_pairs)
    if added_pair_count is None:
        return jsonify(
            error="Error adding encoded pairs to db. Did not pass safety check."
        )

    return jsonify(success=f"Added {added_pair_count} encoded pairs to the db!")


# Simulate guardian in websocket connection
def authenticated_only(f):
    @functools.wraps(f)
    def wrapped(*args, **kwargs):
        if (
            not current_user()
            or current_user() is None
        ):
            disconnect()
            print("User is not authenticated, disconnecting socket...")
        else:
            return f(*args, **kwargs)

    return wrapped


@socketio.on("joined", namespace="/chat")
@authenticated_only
def joined(data):
    """
    Sent by clients when they enter a chat.
    A status message is broadcast to all people in the chat.
    """
    # we hope that preview token auth is still saved in flask_pretorian
    # without passing an preatorian auth decorator here
    username = current_user().username
    user_id = current_user().id
    chat_id = active_chats[user_id]
    # Safety check
    if username is None or user_id is None or chat_id is None:
        return False

    chat = models.get_chat(chat_id)
    # Check that user is valid participant in chat
    if username != chat.user1_name and username != chat.user2_name:
        return False
    # Join chat room
    join_room(chat_id)


@socketio.on("new_message", namespace="/chat")
@authenticated_only
def new_message(data):
    """Sent by a client when the user entered a new message.
    The message is sent to both people in the chat."""
    message = data["msg"]
    username = current_user().username
    user_id = current_user().id
    chat_id = active_chats[user_id]
    # Safety check
    if None in [message, user_id, chat_id] or len(message) == 0 or len(message) > 500:
        return False
    chat = models.get_chat(chat_id)
    # Check that user is valid participant in chat
    if username != chat.user1_name and username != chat.user2_name:
        return False
    # Get the 'other' user in the chat
    other_userid = chat.user1_id
    other_username = chat.user1_name
    if user_id == chat.user1_id:
        other_userid = chat.user2_id
        other_username = chat.user2_name
    # Insert message into db
    msg = models.add_message(
        message, user_id, username, other_userid, other_username, chat_id
    )
    # Safety check
    if msg is None:
        return False
    # Update the chat's last message time
    models.update_chat_last_message_time(chat_id, msg.dt)
    # Send message back to client
    emit(
        "message",
        {
            "sender": msg.sender_username,
            "receiver": msg.receiver_username,
            "msg": msg.text,
            "id": msg.id,
            "dt": msg.dt.isoformat(),
        },
        room=chat_id,
    )


@socketio.on("left", namespace="/chat")
@authenticated_only
def left(data):
    """Sent by clients when they leave a chat.
    A status message is broadcast to both people in the chat."""
    username = current_user().username
    user_id = current_user().id
    chat_id = active_chats[user_id]
    # Safety check
    if chat_id is None:
        return False
    # Fetch chat from database
    chat = models.get_chat(chat_id)
    # Safety check
    if chat is None or username is None:
        return False
    # Check that user is valid participant in chat
    if username != chat.user1_name and username != chat.user2_name:
        return False
    # Leave room and reset session variable for chat id
    leave_room(chat_id)
    active_chats[user_id] = None
