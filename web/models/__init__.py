from models.user import *
from models.chat import *
from models.message import *
from models.encoded_pairs import *

# Create database and tables
DB.create_all()
DB.session.commit()