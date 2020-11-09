import {
  call,
  takeEvery,
  put,
  select,
} from 'redux-saga/effects';

import * as actions from '../actions/auth';
import * as types from '../types/auth';
import * as authUtils from '../utils/auth'

const API_BASE_URL = 'http://localhost:5000';

function* signIn(action) {
  try {
    const credentials = yield authUtils.getSignInCryptoCredencials(action.payload.username, action.payload.password);
    const formData = new FormData();
    yield formData.append('username', credentials.username)
    yield formData.append('password', credentials.password)

    const response = yield call(fetch, `${API_BASE_URL}/login`, {
      method: 'POST',
      body: formData,
    });
    if (response.status === 200) {
      let userData = '';
      yield response.json().then((data) => {
        userData = data
      })
      yield put(actions.completeSignIn(userData));
    } else {
      const {message} = yield response.json();
      yield put(actions.failSignIn(message));
    }
  } catch (error) {
    yield put(actions.failSignIn('CONNECTION FAILED'));
  }
}

export function* watchSignInStarted() {
  yield takeEvery(types.SIGN_IN_STARTED, signIn);
}

function* signup(action) {
  try {
    const credentials = yield authUtils.getSignUpCryptoCredentials(action.payload.username, action.payload.password)
    
    const formData = new FormData();
    yield formData.append('username', credentials.username)
    yield formData.append('password', credentials.password)
    yield formData.append('public_key', credentials.public_key)
    yield formData.append('user_data', credentials.user_data)

    const response = yield call(fetch, `${API_BASE_URL}/user/create`, {
      method: 'POST', 
      body: formData,
    });
    if (response.status >= 200 && response.status <= 300) {
      let userData = '';
      yield response.json().then((data) => {
        userData = data
      })
      yield put(actions.completeSignUp(credentials.user_data));
    } else if (response.status >= 300 && response.status <= 600) {
        yield put(actions.failSignUp('User is already logged in'));
    } else {
        yield put(actions.failSignUp("Couldn't reach server"));
    }
  } catch (error) {
    yield put(actions.failSignUp('CONNECTION FAILED'));
  }
}

export function* watchSignUpStarted() {
  yield takeEvery(types.SIGN_UP_STARTED, signup);
}