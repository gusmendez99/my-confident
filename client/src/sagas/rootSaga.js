import {fork, all} from 'redux-saga/effects';

import { watchSignUpStarted } from './auth';

function* rootSaga() {
    yield all([
        fork(watchSignUpStarted),
    ]);
}

export default rootSaga;
