import os
from string import ascii_lowercase
import functools
import json
import dateutil

import config
from flask import (
    Flask,
    jsonify,
    make_response,
    redirect,
    render_template,
    request,
    session,
    url_for,
)
from flask_sqlalchemy import SQLAlchemy
from flask_socketio import SocketIO, join_room, leave_room, send, emit, disconnect
from flask_sslify import SSLify


app = Flask(__name__)
app.config.from_object(os.environ["APP_SETTINGS"])
socketio = SocketIO(app)
sslify = SSLify(app)

DB = SQLAlchemy(app)
import models

VALID_USERNAME_CHARS = set(
    ["-", "_"] + [str(i) for i in range(0, 10)] + list(ascii_lowercase)
)

@app.route("/")
def home():
    # Check if user is logged in
    if "logged_in" in session and "user" in session:
        user_id = session["user"]["id"]
        username = session["user"]["username"]
    else:
        return redirect(url_for("login"))

    chats = [chat.to_dict() for chat in models.get_chats_for_user(user_id)]
    return render_template("index.html", chats=chats, username=username)


@app.route("/public-key")
def get_public_key():
    # Check if user is logged in
    if "logged_in" in session and "user" in session:
        sender_public_key = session["user"]["public_key"]
    else:
        return jsonify(error="Unauthorized request.")

    receiver_username = request.args.get("receiver_username", "")
    if not models.check_if_user_exists(receiver_username):
        return jsonify(error="This user does not exist.")
    receiver = models.find_user_by_name(receiver_username)
    return jsonify(
        sender_public_key=sender_public_key, receiver_public_key=receiver.public_key
    )


@app.route("/about")
def about():
    return render_template("about.html")


@app.route("/login", methods=["GET", "POST"])
def login():
    # Check if user is already logged in
    if "logged_in" in session and "user" in session:
        return redirect(url_for("home"))
    error = None

    if request.method == "POST":
        if (
            request.form["username"]
            and request.form["password"]
            and models.user_authenticated(
                request.form["username"], request.form["password"]
            )
        ):
            session["logged_in"] = True
            session["user"] = models.find_user_by_name(
                request.form["username"]
            ).to_dict()
            encrypted_user_data = session["user"]["user_data"]
            return jsonify(user_data=encrypted_user_data)
        else:
            return jsonify(error="Invalid username and/or password")
    return render_template("login.html", error=error)


@app.route("/user/find-all")
def find_users():
    if "logged_in" not in session or "user" not in session:
        return redirect(url_for("login"))
    username = request.args.get("term")
    similar_usernames = models.find_user_by_name_fuzzy(username)
    usernames_found = [
        {"label": user.to_dict()["username"], "value": user.to_dict()["username"]}
        for user in similar_usernames
    ]
    return json.dumps(usernames_found)


@app.route("/sign-up", methods=["POST"])
def create_user():
    # Check if user is already logged in
    if "logged_in" in session and "user" in session:
        return redirect(url_for("home"))
    username = request.form.get("username")
    password = request.form.get("password")
    public_key = request.form.get("public_key")
    user_data = request.form.get("user_data")

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

    if error is not None:
        return jsonify(error=error)

    id = models.add_user_to_db(username, password, public_key, user_data)
    if id is None:
        return jsonify(error="Unexpected error.")

    session["logged_in"] = True
    session["user"] = models.find_user_by_name(username).to_dict()
    return jsonify(error=None)


@app.route("/logout")
def logout():
    session.pop("logged_in", None)
    session.pop("user", None)
    session.pop("chat_id", None)
    session.pop("search_ids", None)
    return redirect(url_for("login"))


@app.route("/chat/create", methods=["POST"])
def create_chat():
    if "logged_in" in session and "user" in session:
        user_id = session["user"]["id"]
        username = session["user"]["username"]
        sender_public_key = session["user"]["public_key"]
    else:
        return jsonify(error="Unauthorized request.")
    sk_sym_1 = request.form.get("sk_sym_1", "")
    sk_sym_2 = request.form.get("sk_sym_2", "")
    receiver_username = request.form.get("receiver_username", "")
    receiver_public_key = request.form.get("receiver_public_key", "")

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

    existing_chat_id = models.find_chat_by_users(user_id, receiver.id)
    if existing_chat_id is not None:
        return jsonify(chat_id=existing_chat_id)

    chat_id = models.create_chat(
        user_id, username, sk_sym_1, receiver.id, receiver.username, sk_sym_2
    )

    if chat_id is None:
        return jsonify(error="Unable to create chat.")
    return jsonify(chat_id=chat_id)


@app.route("/chat/delete/<int:id>", methods=["POST"])
def delete_chat(id):
    # Check that user is logged in
    if "logged_in" not in session or "user" not in session:
        return redirect(url_for("login"))
    user_id = session["user"]["id"]

    chat = models.get_chat(id)
    if not chat or (user_id != chat.user1_id and user_id != chat.user2_id):
        return make_response(jsonify(error="Not found"), 404)
    models.delete_chat(id)
    return redirect(url_for("home"))


@app.route("/chat/<int:id>")
def chat(id):
    # Check that user is logged in
    if "logged_in" not in session or "user" not in session:
        return redirect(url_for("login"))
    user_id = session["user"]["id"]
    username = session["user"]["username"]

    chat = models.get_chat(id)
    if not chat or (user_id != chat.user1_id and user_id != chat.user2_id):
        return make_response(jsonify(error="Not found"), 404)
    chat_id = chat.id
    session["chat_id"] = chat_id

    other_userid = chat.user1_id
    other_username = chat.user1_name
    encrypted_symmetric_key = chat.user2_sk_sym
    if user_id == chat.user1_id:
        other_userid = chat.user2_id
        other_username = chat.user2_name
        encrypted_symmetric_key = chat.user1_sk_sym

    messages = [message.to_dict() for message in models.get_chat_messages(id)]
    return render_template(
        "chat.html",
        chat_id=chat_id,
        enc_sym_key=encrypted_symmetric_key,
        messages=messages,
        user_id=user_id,
        username=username,
        other_user=other_username,
    )


@app.route("/chat/<int:id>/search", methods=["GET", "POST"])
def search_results(id):

    if request.method == "POST":
        if "logged_in" not in session or "user" not in session:
            return jsonify(error="Unauthorized request.")

        search_token = request.form.get("token", "")
        result_count = request.form.get("count", "")

        if "" in [search_token, result_count]:
            return jsonify(error="Bad request. No search token or result count found.")
        else:
            search_token = unicode(search_token).encode("utf8")
            if result_count == "":
                result_count = 0
            result_count = int(result_count)

        message_ids = models.get_message_ids(search_token, result_count)

        session["search_ids"] = message_ids
        return jsonify(success="DB search successful.")
    elif request.method == "GET":
        # Check that user is logged in
        if "logged_in" not in session or "user" not in session:
            return redirect(url_for("login"))
        if "search_ids" not in session:
            return redirect(url_for("chat", id=id))
        else:
            message_ids = session["search_ids"]
            messages = models.get_messages(message_ids)

            chat = models.get_chat(id)
            chat_id = chat.id
            user_id = session["user"]["id"]
            username = session["user"]["username"]
            # Get the 'other' user in the chat
            other_userid = chat.user1_id
            other_username = chat.user1_name
            encrypted_symmetric_key = chat.user2_sk_sym
            if user_id == chat.user1_id:
                other_userid = chat.user2_id
                other_username = chat.user2_name
                encrypted_symmetric_key = chat.user1_sk_sym

            return render_template(
                "chat_search.html",
                chat_id=chat_id,
                enc_sym_key=encrypted_symmetric_key,
                messages=messages,
                user_id=user_id,
                username=username,
                other_user=other_username,
            )


@app.route("/chat/<int:id>/update-pairs", methods=["POST"])
def chat_encoded_pairs(id):
    # Check that user is logged in
    if "logged_in" not in session or "user" not in session:
        return jsonify(error="Unauthorized request.")

    encoded_pairs = request.form.get("pairs")

    if encoded_pairs is None:
        return jsonify(error="Bad request. No encoded pairs found.")
    else:
        encoded_pairs = json.loads(encoded_pairs)

    added_pair_count = models.insert_pairs(encoded_pairs)
    if added_pair_count is None:
        return jsonify(
            error="Error adding encoded pairs to db. Did not pass safety check."
        )

    return jsonify(
        success="Added " + str(added_pair_count) + " encoded pairs to the db!"
    )


def authenticated_only(f):
    @functools.wraps(f)
    def wrapped(*args, **kwargs):
        if "logged_in" not in session or "user" not in session:
            disconnect()
        else:
            return f(*args, **kwargs)

    return wrapped


@socketio.on("joined", namespace="/chat")
@authenticated_only
def joined(data):
    username = session["user"]["username"]
    chat_id = session["chat_id"]
    if username is None or chat_id is None:
        return False
    chat = models.get_chat(chat_id)
    if username != chat.user1_name and username != chat.user2_name:
        return False
    join_room(chat_id)


@socketio.on("new_message", namespace="/chat")
@authenticated_only
def new_message(data):
    message = data["msg"]
    user_id = session["user"]["id"]
    username = session["user"]["username"]
    chat_id = session["chat_id"]
    # Safety check
    if None in [message, user_id, chat_id] or len(message) == 0 or len(message) > 500:
        return False
    chat = models.get_chat(chat_id)

    if username != chat.user1_name and username != chat.user2_name:
        return False

    other_userid = chat.user1_id
    other_username = chat.user1_name
    if user_id == chat.user1_id:
        other_userid = chat.user2_id
        other_username = chat.user2_name

    msg = models.add_message(
        message, user_id, username, other_userid, other_username, chat_id
    )

    if msg is None:
        return False

    models.update_chat_last_message_time(chat_id, msg.dt)

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
    chat_id = session["chat_id"]
    # Safety check
    if chat_id is None:
        return False

    chat = models.get_chat(chat_id)
    username = session["user"]["username"]
    # Safety check
    if chat is None or username is None:
        return False

    if username != chat.user1_name and username != chat.user2_name:
        return False

    leave_room(session["chat_id"])
    session["chat_id"] = None


if __name__ == "__main__":
    # Run app
    socketio.run(app)
