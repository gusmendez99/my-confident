import {fork, all} from 'redux-saga/effects';

import { watchFetchStarted } from './chats';
import { watchSignUpStarted, watchSignInStarted } from './auth';

function* rootSaga() {
    yield all([
        fork(watchSignInStarted),
        fork(watchSignUpStarted),
        fork(watchFetchStarted),
    ]);
}

export default rootSaga;
