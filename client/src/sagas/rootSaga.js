import {fork, all} from 'redux-saga/effects';

//import { watchSignUpStarted } from './auth';
import { watchFetchStarted } from './chats';

function* rootSaga() {
    yield all([
        //fork(watchSignUpStarted),
        fork(watchFetchStarted),
    ]);
}

export default rootSaga;
