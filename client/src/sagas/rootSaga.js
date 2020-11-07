import {fork, all} from 'redux-saga/effects';

import { watchSignUpStarted, watchSignInStarted } from './auth';

function* rootSaga() {
    yield all([
        fork(watchSignInStarted),
        fork(watchSignUpStarted)
    ]);
}

export default rootSaga;
