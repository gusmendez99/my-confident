from app import db
from datetime import datetime
import bcrypt

class User(db.Model):
    __tablename__ = 'users'

    id = db.Column(db.Integer, primary_key=True)
    dt = db.Column(db.DateTime, nullable=False)
    username = db.Column(db.String(32), unique=True, nullable=False)
    password = db.Column(db.String(60), nullable=False)
    public_key = db.Column(db.String(256), nullable=False)
    user_data = db.Column(db.Text, nullable=False)
    roles = db.Column(db.Text)
    is_active = db.Column(db.Boolean, default=True, server_default='true')

    def __init__(self, username, password, public_key, user_data):
        self.dt = datetime.utcnow()
        self.username = username
        self.password = password
        self.public_key = public_key
        self.user_data = user_data

    def __repr__(self):
        return '<User %r>' % self.username

    def to_dict(self):
        return {
            'id': self.id,
            'dt': self.dt.isoformat(),
            'username': self.username,
            'password': self.password,
            'public_key': self.public_key,
            'user_data': self.user_data,
            'is_active': self.is_active
        }
    
    @property
    def rolenames(self):
        try:
            return self.roles.split(',')
        except Exception:
            return []

    @classmethod
    def lookup(cls, username):
        return cls.query.filter_by(username=username).one_or_none()

    @classmethod
    def identify(cls, id):
        return cls.query.get(id)

    @property
    def identity(self):
        return self.id

    def is_valid(self):
        return self.is_active

def find_user_by_name_fuzzy(username):
    #Queries using part of a username. Does a fuzzy search through database.
    fuzzy_string = '%' + username + '%'
    return User.query.filter(User.username.like(fuzzy_string)).order_by(User.username.asc()).all()

def find_user_by_name(username):
    # Query using username and return first
    # If user not found, None is returned
    return User.query.filter_by(username=username).first()

def check_if_user_exists(username):
    user_exists = (find_user_by_name(username) is not None)
    return user_exists

def add_user_to_db(username, password, public_key, user_data):
    # Generate salt
    salt = bcrypt.gensalt()
    # Hash given password using salt
    password = bcrypt.hashpw(password.encode('utf-8'), salt)
    # Safety check
    if len(username) > 32 or len(password) > 60 or len(public_key) > 256:
        return None
    # Create User instance
    new_user = User(username, password, public_key, user_data)
    # Insert to table
    db.session.add(new_user)
    # Commit
    db.session.commit()
    # Return the new user's id
    return new_user.id

def user_authenticated(username, password):
    # Query for this username
    user = find_user_by_name(username)
    if user is None:
        # User not found
        return False
    # Get user hashed password
    # hashed = user.password.encode('utf-8')
    hashed = user.password
    # Hash given password using salt and compare to stored hash
    return (bcrypt.hashpw(password.encode('utf-8'), hashed) == hashed)
