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

import * as messageActions from '../actions/messages';
import * as chatUtils from '../utils/chat';

const API_BASE_URL = 'http://localhost:5000/api/v1';

function* fetchChats(action) {
    //const token = yield select(selectors.getAuthToken);
    try {
        const isAuth = yield select(selectors.isAuthenticated)
        if(isAuth) {
            const token = yield select(selectors.getAuthToken)
    
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
                console.log("Success retrieving chats", response);
                yield put(actions.completeFetchingChats(chats, result));
            } else {
                const { message } = yield response.json();
                yield put(actions.failFetchingChats(message));
            }
        } else {
            yield put(actions.failFetchingChats("You are not authenticated..."));
        }
    } catch (error) {
        console.log(error);
        yield put(actions.failFetchingChats('CONNECTION FAILED'));
    }
}

export function* watchFetchStarted() {
    yield takeEvery(types.CHATS_FETCH_STARTED, fetchChats);
}

// Active Chat
function* fetchActiveChat(action) {
    try {
        const isAuth = yield select(selectors.isAuthenticated)
        if(isAuth) {
            const token = yield select(selectors.getAuthToken)
            const { id } = action.payload;
    
            const response = yield call(axios.get, `${API_BASE_URL}/chat/${id}`, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            });
            if (response.status === 200) {

                const data = yield response.data;
                const activeChat = {
                    id: data["chat_id"],
                    encryptedSymKey : data["enc_sym_key"],
                    receiver: data["other_user"],
                    sender: data["username"],
                    idSender: data["user_id"]
                }

                const historicalMessages = data["messages"] 
                //console.log("Result active chat messages: ", historicalMessages)

                const {
                    entities: { messages },
                    result,
                } = normalize(historicalMessages, schemas.chats);
                //console.log("Success retrieving chats", chats, result);
                yield put(actions.completeFetchingActiveChat(activeChat));
                yield put(messageActions.completeFetchingMessages(messages, result))
            } else {
                const { message } = yield response.json();
                yield put(actions.failFetchingChats(message));
            }
        } else {
            yield put(actions.failFetchingChats("You are not authenticated..."));
        }
    } catch (error) {
        console.log(error);
        yield put(actions.failFetchingChats('CONNECTION FAILED'));
    }
}

export function* watchFetchActiveChatStarted() {
    yield takeEvery(types.ACTIVE_CHAT_FETCH_STARTED, fetchActiveChat);
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
                yield put(actions.failDeletingChat(action.payload.chatId, "Error deleting Chat"))
            }
        }
    }catch(error){
        yield put(actions.failDeletingChat(action.payload.chatId, error));
    }
}

export function* watchChatDeleted(){
    yield takeEvery(
        types.CHAT_DELETE_STARTED,
        deleteChat,
    )
}


function* createChat(action) {
    const oldId = action.payload.id;
    const { username,
            sender_public_key, 
            receiver_public_key } = action.payload.chat;
    const data = yield chatUtils.getDataToCreateChat(username, sender_public_key, receiver_public_key);
    try{
        const isAuth = yield select(selectors.isAuthenticated);
        if(isAuth){
            const token = yield select(selectors.getAuthToken)
            const response = yield call(
                axios.post,
                `${API_BASE_URL}/chat/create`,
                JSON.stringify(data),
                {
                    headers:{
                        'Content-Type': 'application/json',
                        'Authorization': `Bearer ${token}`,
                    },
                }
            );

            if(response.status >= 200 && response.status <= 300){
                console.log("Este es el chat", response.data.chat_id);
                const chat = {
                    id: response.data.chat_id,
                    user1_sk_sym: data.sk_sym_1,
                    user2_sk_sym: data.sk_sym_2,
                    dt:'few moments',
                    last_message_dt: "",
                    user1_name: data.receiver_username,
                    user2_name: data.receiver_username,
                }
                yield put(actions.completeAddingChat(oldId, chat));

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