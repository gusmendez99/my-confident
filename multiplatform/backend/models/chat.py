from app import db
from datetime import datetime


class Chat(db.Model):
    __tablename__ = 'chats'

    id = db.Column(db.Integer, primary_key=True)
    dt = db.Column(db.DateTime, nullable=False)
    user1_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    user1_name = db.Column(db.String(32), db.ForeignKey('users.username'), nullable=False)
    user1_sk_sym = db.Column(db.String(500), nullable=False)
    user2_id = db.Column(db.Integer, db.ForeignKey('users.id'), nullable=False)
    user2_name = db.Column(db.String(32), db.ForeignKey('users.username'), nullable=False)
    user2_sk_sym = db.Column(db.String(500), nullable=False)
    last_message_dt = db.Column(db.DateTime, nullable=False)

    def __init__(self, user1_id, user1_name, user1_sk_sym, user2_id, user2_name, user2_sk_sym):
        self.dt = datetime.utcnow()
        self.user1_id = user1_id
        self.user1_name = user1_name
        self.user1_sk_sym = user1_sk_sym
        self.user2_id = user2_id
        self.user2_name = user2_name
        self.user2_sk_sym = user2_sk_sym
        self.last_message_dt = datetime.utcnow()


    def __repr__(self):
        return '<Chat %r>' % self.id

    def to_dict(self):
        return {
            'id': self.id,
            'dt': self.dt.isoformat(),
            'user1_id': self.user1_id,
            'user1_name': self.user1_name,
            'user1_sk_sym': self.user1_sk_sym,
            'user2_id': self.user2_id,
            'user2_name': self.user2_name,
            'user2_sk_sym': self.user2_sk_sym,
            'last_message_dt': self.last_message_dt.isoformat()
        }

def get_chat(id):
    # Search by primary key
    return Chat.query.get(id)

def check_if_chat_exists(id):
    return (get_chat(id) is not None)

def create_chat(user1_id, user1_name, user1_sk_sym, user2_id, user2_name, user2_sk_sym):
    # Safety check
    if len(user1_name) > 32 or len(user2_name) > 32 or len(user1_sk_sym) > 500 or len(user2_sk_sym) > 500:
        return None
    if user1_id == user2_id or user1_name == user2_name:
        return None
    # Create Chat instance
    new_chat = Chat(user1_id, user1_name, user1_sk_sym, user2_id, user2_name, user2_sk_sym)
    # Insert into table
    db.session.add(new_chat)
    # Commit
    db.session.commit()
    return new_chat.id

def get_chats_for_user(user_id):
    # Get all chats where given user is a participant
    return Chat.query.filter((Chat.user1_id == user_id) | (Chat.user2_id == user_id)).order_by(Chat.last_message_dt.desc()).all()

def update_chat_last_message_time(chat_id, last_message_dt):
    # Find chat with given id
    chat = get_chat(chat_id)
    # Update last message time
    chat.last_message_dt = last_message_dt
    # Commit
    db.session.commit()

def find_chat_by_users(userA_id, userB_id):
    # Check for both possible orders for userA and userB in chat
    chat = Chat.query.filter(Chat.user1_id == userA_id).filter(Chat.user2_id == userB_id).first()
    if chat is not None:
        return chat.id
    chat = Chat.query.filter(Chat.user1_id == userB_id).filter(Chat.user2_id == userA_id).first()
    if chat is not None:
        return chat.id
    # No such chat exists
    return None

def delete_chat(chat_id):
    chat = get_chat(chat_id)
    if chat is None:
        return None
    # Delete from table
    db.session.delete(chat)
    # Commit
    db.session.commit()
