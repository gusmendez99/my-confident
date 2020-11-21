import * as types from '../types/chats';

export const startFetchingChats = () =>({
    type: types.CHATS_FETCH_STARTED,
});

export const completeFetchingChats = (entities, order) =>({
    type: types.CHATS_FETCH_COMPLETED,
    payload: {
        entities,
        order
    },
});

export const failFetchingChats = error => ({
    type: types.CHATS_FETCH_FAILED,
    payload: {
        error,
    }
});

export const startAddingChat = (id,chat) =>({
    type: types.CHAT_ADD_STARTED,
    payload: {
        id, 
        chat
    }
});

export const completeAddingChat = (oldId, chat) =>({
    type: types.CHAT_ADD_COMPLETED,
    payload: {
        oldId,
        chat,
    }
});

export const failAddingChat = (oldId, error) =>({
    type: types.CHAT_ADD_FAILED,
    payload: {
        oldId,
        error,
    }
});

export const startDeletingChat = chatId => ({
    type: types.CHAT_DELETE_STARTED,
    payload: {chatId}
});

export const completeDeletingChat = () =>({
    tpye:types.CHAT_DELETE_COMPLETED,
});

export const failDeletingChat = (chatId, error) => ({
    type:types.CHAT_DELETE_FAILED,
    payload: {
        chatId,
        error
    }
});

// For active chat
export const startFetchingActiveChat = (id) =>({
    type: types.ACTIVE_CHAT_FETCH_STARTED,
    payload: { id }
});

export const completeFetchingActiveChat = chat =>({
    type: types.ACTIVE_CHAT_FETCH_COMPLETED,
    payload: {
        chat
    },
});

export const failFetchingActiveChat = error => ({
    type: types.ACTIVE_CHAT_FETCH_FAILED,
    payload: {
        error
    }
});