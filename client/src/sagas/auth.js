import {
  call,
  takeEvery,
  put,
  select,
} from 'redux-saga/effects';

import * as actions from '../actions/auth';
import * as types from '../types/auth';
import * as authUtils from '../utils/auth'

const API_BASE_URL = 'http://localhost:5000/api/v1';

function* signIn(action) {
  try {
    const { username, password } = action.payload;
    const credentials = yield authUtils.getSignInCryptoCredencials(username, password);
    const response = yield call(fetch, `${API_BASE_URL}/login`, {
      method: 'POST',
      body: JSON.stringify(credentials),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.status === 200) {
      const result = yield response.json();
      console.log("Result is: ", result)
      const userData = authUtils.saveUserData(username, password, result, false)
      console.log("User data is: ", userData)
      yield put(actions.completeSignIn(result.token, userData));
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

function* signUp(action) {
  try {
    const { username, password } = action.payload;
    const credentials = yield authUtils.getSignUpCryptoCredentials(username, password)
    const response = yield call(fetch, `${API_BASE_URL}/sign-up`, {
      method: 'POST', 
      body: JSON.stringify(credentials),
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.status === 200) {
      const result = yield response.json();
      console.log("Result is: ", result)
      const userData = authUtils.saveUserData(username, password, result, true)
      console.log("User data is: ", userData)
      yield put(actions.completeSignUp(result.token, userData));
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
  yield takeEvery(types.SIGN_UP_STARTED, signUp);
}