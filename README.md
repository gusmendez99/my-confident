# My Confident

End-to-end crypto chat, made with Flask and React

## Backend

### Installation

Create a new virtualenv in this folder:
```
python3 -m venv venv
source venv/bin/activate
```

Then, install Flask dependencies
```
cd backend
pip3 install -r requirements.txt
```

### Run API

First, set environment variables (`DATABASE_URL` must be replaced with your own database url)
```
export FLASK_APP=app
export FLASK_ENV=development
export DATABASE_URL=/tmp/test.db
export APP_SETTINGS=config.DevelopmentConfig
```

Then, run the following command
```
flask run
```

Finally, API will run on port `5000`

### API Endpoints
Endpoints list pending
* User
  * Create new user (POST)
    * http://127.0.0.1:5000/user/create
  * Login (POST)
    * http://127.0.0.1:5000/login
  * Public key of a receiver (GET) 
    * http://127.0.0.1:5000/public_key?receiver_username=rob
  * All users that match with term parameter (GET)
    * http://127.0.0.1:5000/user/find_all?term=rob
  * Log out (GET)
    * http://127.0.0.1:5000/logout
* Chat
  * Create a new chat (POST)
    * http://127.0.0.1:5000/chat/create
  * Delete chat (POST)
    * http://127.0.0.1:5000/chat/delete/1
  * Chat (GET)
    * http://127.0.0.1:5000/chat/1
* Pending
    * Search chat
      * http://127.0.0.1:5000/chat/1/search
    * Update pairs
      * http://127.0.0.1:5000/chat/1/update/pairs

## Frontend

### Installation
Install React dependencies
```
cd client
yarn install
```

### Run
Run the following command
```
yarn start
```

Finally, React app will run on port `3000`