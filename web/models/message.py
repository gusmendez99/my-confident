from app import DB
from datetime import datetime


class Message(DB.Model):
    __tablename__ = "messages"

    id = DB.Column(DB.Integer, primary_key=True)
    dt = DB.Column(DB.DateTime, nullable=False)
    text = DB.Column(DB.String(500), nullable=False)
    sender_id = DB.Column(DB.Integer, DB.ForeignKey("users.id"), nullable=False)
    sender_username = DB.Column(
        DB.String(32), DB.ForeignKey("users.username"), nullable=False
    )
    receiver_id = DB.Column(DB.Integer, DB.ForeignKey("users.id"), nullable=False)
    receiver_username = DB.Column(
        DB.String(32), DB.ForeignKey("users.username"), nullable=False
    )
    chat_id = DB.Column(DB.Integer, DB.ForeignKey("chats.id"), nullable=False)
    chat = DB.relationship(
        "Chat",
        backref=DB.backref("messages", cascade="all, delete-orphan"),
        lazy="joined",
    )

    def __init__(
        self, text, sender_id, sender_username, receiver_id, receiver_username, chat_id
    ):
        self.dt = datetime.utcnow()
        self.text = text
        self.sender_id = sender_id
        self.sender_username = sender_username
        self.receiver_id = receiver_id
        self.receiver_username = receiver_username
        self.chat_id = chat_id

    def __repr__(self):
        return "<Message %r>" % self.message

    def to_dict(self):
        return {
            "id": self.id,
            "dt": self.dt.strftime('%Y-%m-%d %H:%M:%S'),
            "text": self.text,
            "sender_id": self.sender_id,
            "sender_username": self.sender_username,
            "receiver_id": self.receiver_id,
            "receiver_username": self.receiver_username,
            "chat_id": self.chat_id,
        }


def get_message(id):
    return Message.query.get(id)


def get_messages(message_ids):
    messages = (
        Message.query.filter(Message.id.in_(message_ids)).order_by(Message.dt).all()
    )
    return messages


def add_message(
    text, sender_id, sender_username, receiver_id, receiver_username, chat_id
):
    if len(text) > 500 or len(sender_username) > 32 or len(receiver_username) > 32:
        return None
    new_message = Message(
        text, sender_id, sender_username, receiver_id, receiver_username, chat_id
    )
    DB.session.add(new_message)
    DB.session.commit()
    return new_message


def get_chat_messages(chat_id):
    return Message.query.filter_by(chat_id=chat_id).order_by(Message.dt).all()
