import {
    call,
    takeEvery,
    put,
} from 'redux-saga/effects';

import * as actions from '../actions/chats';
import * as types from '../types/chats';
import { normalize, schema } from 'normalizr';
import * as schemas from '../schemas/chats';

const API_BASE_URL = 'http://localhost:5000';

function* fetchChats(action) {
    console.log("si entreo")
    try {
        const response = yield call(fetch, `${API_BASE_URL}/chats`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
        });
        if (response.status === 200) {
            // const {
            //     entities: { chats },
            //     result,
            // } = normalize(response.chats, schemas.chats);
            console.log("Succes retrieving chats", response);
            // yield put(actions.completeFetchChats(chats, result));
        } else {
            const { message } = yield response.json();
            yield put(actions.failFetchingChats(message));
        }
    } catch (error) {
        //yield console.log(message);
        yield put(actions.failFetchingChats('CONNECTION FAILED'));
    }
}

export function* watchFetchStarted() {
    yield takeEvery(types.CHATS_FETCH_STARTED, fetchChats);
}
