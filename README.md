# My Confident

End-to-end crypto chat, made with Flask and React

![login](https://github.com/gusmendez99/Cipher_MyConfident/raw/master/images/login.jpeg?raw=true)

![dashboard](https://github.com/gusmendez99/Cipher_MyConfident/raw/master/images/dashboard.jpeg?raw=true)

![chat](https://github.com/gusmendez99/Cipher_MyConfident/raw/master/images/chat.jpeg?raw=true)

## Web

### Installation

Create a new virtualenv in this folder:
```
python3 -m venv venv
source venv/bin/activate
```

Then, install Flask dependencies
```
cd web
pip3 install -r requirements.txt
```

### Run API/Flask app

First, set environment variables (`DATABASE_URL` must be replaced with your own PostgreSQL database url).
```
export FLASK_APP=app
export FLASK_ENV=development
DATABASE_URL='postgresql://YOUR_USER:YOUR_PASSWORD@HOST:PORT/DATABASE'
export APP_SETTINGS=config.DevelopmentConfig
```

Then, run the following command
```
flask run
```

Finally, API & App will run on port `5000`

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