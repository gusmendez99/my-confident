import omit from 'lodash/omit';
import unionWith from 'lodash/unionWith';
import union from 'lodash/union';
import isEqual from 'lodash/isEqual';
import filter from 'lodash/filter';

import { combineReducers } from 'redux';

import * as types from '../types/messages'


const byId =(state = {}, action) =>{
    switch(action.type){
        case types.MESSAGES_FETCH_COMPLETED:{
            const{entities, order} = action.payload;
            if(state){
                const newState = {...state};
                order.forEach(id => {
                    newState[id] = {
                        ...entities[id],
                        isConfirmed: true
                    };
                });
                return newState;
            }
            else{
                const newState = unionWith(state, entities, isEqual);
                return newState
            }
        }
        case types.MESSAGE_ADD_STARTED: {
            const newState = {...state};
            newState[action.payload.id] = {
                ...action.payload,
                isConfirmed: false,
            };
            return newState
        }
        case types.MESSAGE_ADD_COMPLETED:{
            const{oldId,chat} = action.payload;
            const newState = omit(state,oldId);
            newState[chat.id] = {
                ...chat,
                isConfirmed: true
            }
        }
        default:{
            return state
        }
    }
};

const order = (state = [], action) => {
    switch(action.type){
        case types.MESSAGE_ADD_COMPLETED:{
            return union(state, action.payload.order);
        }
        case types.MESSAGE_ADD_STARTED:{
            return[...state, action.payload.id];
        }
        case types.MESSAGE_ADD_COMPLETED:{
            const{oldId, chat} = action.payload;
            return state.map(id => id === oldId? chat.id : id);
        }
        default:{
            return state
        }
    }
};

const isFetching = (state = false, action) =>{
    switch(action.type) {
        case types.MESSAGES_FETCH_COMPLETED:
        case types.MESSAGES_FETCH_FAILED: {
            return false;
        }
        case types.MESSAGES_FETCH_STARTED:{
            return true;
        }
        default:
            return state;
    }
};

const error = (state = null, action) => {
    switch(action.type) {
        case types.MESSAGES_FETCH_COMPLETED:
        case types.MESSAGES_FETCH_STARTED:
        case types.MESSAGE_ADD_STARTED:
        case types.MESSAGE_ADD_COMPLETED: {
            return null;
        }
        case types.MESSAGES_FETCH_FAILED:
        case types.MESSAGE_ADD_FAILED: {
            return action.payload.error;
        }
        default:
            return state;       
    }
}

const messages = combineReducers ({
    byId,
    order,
    isFetching,
    error
});

export default messages

export const getMessage = (state, id) => state.byId[id];
export const getChatMessages = (state, chat_id) => filter(state.byId, msg => msg.chat_id === chat_id);
export const getAllMessages = state => state.order.map(id => getChatMessages(state,id));
export const isFetchingMessages = state => state.isFetching;
export const getError = state => state.error;
