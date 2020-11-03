import {
  call,
  takeEvery,
  put,
  // race,
  // all,
  select,
} from 'redux-saga/effects';

import * as actions from '../actions/auth';
import auth from '../reducers/auth';
import * as selectors from '../reducers/index';
import * as types from '../types/auth';
import * as authUtils from '../utils/auth'

const API_BASE_URL = 'http://localhost:5000/';

function* signIn(action) {
  try {
      const response = yield call(fetch, `${API_BASE_URL}/signin`, {
          method: 'POST',
          body: bodyParser(action.payload),
          headers: {
              'Content-Type': 'application/x-www-form-urlencoded',
          },
      });
      if (response.status === 200) {
          const {data} = yield response.json();
          yield put(actions.completeSignIn(data));
      } else {
          const {message} = yield response.json();
          yield put(actions.failSignIn(message));
      }
  } catch (error) {
      //yield console.log(message);
      yield put(actions.failSignIn('CONNECTION FAILED'));
  }
}

export function* watchSignInStarted() {
  yield takeEvery(types.SIGN_IN_STARTED, signIn);
}

function* signup(action) {
  try {
    const 
    const credentials = 
      authUtils.getSignUpCryptoCredentials(action.payload.username, action.payload.password)
    const response = yield call(fetch, `${API_BASE_URL}/user/create`, {
      method: 'POST',
      body: JSON.stringify(credentials),
      headers: {
          'Content-Type': 'application/json',
      },
    });
    if (response.status >= 200 && response.status <= 300) {
      yield put(actions.completeSignUp(credentials));
    } else if (response.status >= 300 && response.status <= 600) {
        yield put(actions.failSignUp('User is already logged in'));
    } else {
        yield put(actions.failRegistration("Couldn't reach server"));
    }
  } catch (error) {
      yield put(actions.failRegistration('CONNECTION FAILED'));
  }
}

export function* watchSignUpStarted() {
  yield takeEvery(types.REGISTRATION_STARTED, signup);
}