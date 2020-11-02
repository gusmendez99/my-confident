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