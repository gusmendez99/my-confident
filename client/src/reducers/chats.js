import { bindActionCreators, combineReducers } from 'redux';

import * as types from '../types/chats';


const byId = (state = {}, action) => {
    switch (action.type) {
        case types.FETCH_CHATS_COMPLETED: {
            const newState = { ...state, ...action.payload.entities };
            return newState;
        }

        default: {
            return state;
        }
    }
}

const order = (state = [], action) => {
    switch (action.type) {
        case types.FETCH_CHATS_COMPLETED: {
            const newState = action.payload.order;
            return newState;
        }

        default: {
            return state;
        }
    }
}

const isFetching = (state = false, action) => {
    switch (action.type) {
        case types.FETCH_CHATS_STARTED: {
            return true;
        }

        case types.FETCH_CHATS_COMPLETED: {
            return false;
        }

        case types.FETCH_CHATS_FAILED: {
            return false;
        }

        default: {
            return state;
        }
    }
}

const error = (state = null, action) => {
    switch (action.type) {
        case types.FETCH_CHATS_FAILED: {
            const newState = action.payload.error;
            return newState;
        }

        default: {
            return state;
        }
    }
}

const chats = combineReducers({
    byId,
    order,
    isFetching,
    error
})

export default chats;

export const getChat = (state, id) => state.byId[id];
export const getChats = state => state.order.map(id => getChat(state, id));
export const getIsFetching = state => state.isFetching;
export const getError = state => state.error;