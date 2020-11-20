import {
    call,
    takeEvery,
    put,
    select,
} from 'redux-saga/effects';

import * as selectors from '../reducers';
import axios from 'axios';
import * as actions from '../actions/chats';
import * as types from '../types/chats';
import { normalize, schema } from 'normalizr';
import * as schemas from '../schemas/chats';

const API_BASE_URL = 'http://localhost:5000/api/v1';

function* fetchChats(action) {
    const token = "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2MDU4NDczMjgsImV4cCI6MTYwNTg0NzYyOCwianRpIjoiNTU1NWY2NTEtN2YxYi00YzlhLTkwNmItNTg4MjRiNjE4MGE3IiwiaWQiOjEsInJscyI6IiIsInJmX2V4cCI6MTYwNTg0NzYyOH0.few7mxBo1ArPj41oKuLjy4Vv6Tr80UmrpTmboL09p_Y";
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

function* createChat(action) {
    const oldId = action.payload.id;
    try{
        const isAuth = yield select(selectors.isAuthenticated)

        if(isAuth){
            const token = yield select(selectors.getAuthToken)
            const response = yield call(
                fetch,
                `${API_BASE_URL}/chat/create`,
                {
                    method: 'POST',
                    body: JSON.stringify(action.payload),
                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            if(response.status >= 200 && response.status <= 300){
                const jsonResult = yield response.json();
                yield put(
                    actions.completeAddingChat(
                        oldId,
                        jsonResult,
                    ),
                );
            } else{
                console.log('ERROR');
                yield put(actions.failAddingChat(oldId, "ERROR CREATING CHAT"))
            }
        }
    } catch (error){
        console.log("ERROR", error);
        yield put(actions.failAddingChat(oldId, error));
    }
}

export function* watchChatAdded(){
    yield takeEvery(
        types.CHAT_ADD_STARTED,
        createChat,
    )
}

function* deleteChat(action){
    try{
        const isAuth = yield select(selectors.isAuthenticated);
        if(isAuth){
            const token = yield select(selectors.getAuthToken);
            const response = yield call(
                fetch,
                `${API_BASE_URL}/chat/delete/${action.payload.chatId}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );
            if(response.status >= 200 && response.status <= 300){
                yield put(
                    actions.completeDeletingChat(),
                );
            } else{
                yield put(actions.failDeletingChat(action.payload.id, "Error deleting Chat"))
            }
        }
    }catch(error){
        yield put(actions.failDeletingChat(action.payload.id, error));
    }
}

export function* watchChatDeleted(){
    yield takeEvery(
        types.CHAT_DELETE_STARTED,
        deleteChat,
    )
}