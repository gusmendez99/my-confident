import * as types from '../types/messages';

export const startFetchingMessages = () =>({
    type: types.MESSAGES_FETCH_STARTED,
});

export const completeFetchingMessages = (entities, order) =>({
    type: types.MESSAGES_FETCH_COMPLETED,
    payload: {
        entities,
        order
    },
});

export const failFetchingMessages = error => ({
    type: types.MESSAGES_FETCH_FAILED,
    payload: {
        error,
    }
});

export const startAddingMessage = message =>({
    type: types.MESSAGE_ADD_STARTED,
    payload: {message}
});

export const completeAddingMessage = (oldId, message) =>({
    type: types.MESSAGE_ADD_COMPLETED,
    payload: {
        oldId,
        message,
    }
});

export const failAddingMessage = (oldId, error) =>({
    type: types.MESSAGE_ADD_FAILED,
    payload: {
        oldId,
        error,
    }
});