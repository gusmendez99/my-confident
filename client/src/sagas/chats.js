import {
    call,
    takeEvery,
    put,
} from 'redux-saga/effects';

import axios from 'axios';
import * as actions from '../actions/chats';
import * as types from '../types/chats';
import { normalize, schema } from 'normalizr';
import * as schemas from '../schemas/chats';

const API_BASE_URL = 'http://localhost:5000/api/v1';

function* fetchChats(action) {
    console.log("si entreo")
    const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2MDU0NjI2NTMsImV4cCI6MTYwNTQ2MjcxMywianRpIjoiZjM5OWI5MDAtNjIyYy00OTE5LWIxMjEtMTM2MTljNTNmYzlkIiwiaWQiOjIsInJscyI6IiIsInJmX2V4cCI6MTYwNTQ2Mjk1M30.4ziufY5unUTL_UZcFekgGVc4H5ZAYsR8hYgphjIoWZ0";
    try {
        const response = yield call(axios.get, `${API_BASE_URL}/chats`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
        });
        if (response.status === 200) {
            const {
                entities: { chats },
                result,
            } = normalize(response.data.chats, schemas.chats);
            console.log("Succes retrieving chats", response);
            yield put(actions.completeFetchingChats(chats, result));
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
