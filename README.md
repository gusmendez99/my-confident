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
  * Sign Up(POST)
    * http://127.0.0.1:5000/api/v1/sign-up
  * Login (POST)
    * http://127.0.0.1:5000/api/v1/login
  * Public key of a receiver (GET) 
    * http://127.0.0.1:5000/api/v1/public-key?receiver-username=rob
  * All users that match with term parameter (GET)
    * http://127.0.0.1:5000/api/v1/user/find-all?term=rob
  * Log out (GET)
    * http://127.0.0.1:5000/api/v1/logout
* Chat
  * Create a new chat (POST)
    * http://127.0.0.1:5000/api/v1/chat/create
  * Delete chat (POST)
    * http://127.0.0.1:5000/api/v1/chat/delete/1
  * Chat (GET)
    * http://127.0.0.1:5000/api/v1/chat/1
* Update pairs
  * http://127.0.0.1:5000/api/v1/chat/1/update-pairs
* Search
  * Not implemented

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
