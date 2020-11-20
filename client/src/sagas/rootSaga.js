import {fork, all} from 'redux-saga/effects';

import { watchFetchStarted, watchChatAdded, watchChatDeleted } from './chats';
import { watchSignUpStarted, watchSignInStarted } from './auth';

function* rootSaga() {
    yield all([
        fork(watchSignInStarted),
        fork(watchSignUpStarted),
        fork(watchFetchStarted),
        fork(watchChatAdded),
        fork(watchChatDeleted),
    ]);
}

export default rootSaga;
