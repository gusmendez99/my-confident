import * as types from '../types/chats';

export const startFetchChats = () =>({
    type: types.FETCH_CHATS_STARTED,
});

export const completeFetchChats = (entities, order) => ({
    type: types.FETCH_CHATS_COMPLETED,
    payload: {
        entities,
        order
    }
});

export const faileFetchChats = (error) => ({
    type: types.FETCH_CHATS_FAILED,
    payload: {
        error,
    }
});