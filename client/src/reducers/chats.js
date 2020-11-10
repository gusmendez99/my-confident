import omit from 'lodash/omit';
import unionWith from 'lodash/unionWith';
import union from 'lodash/union';
import isEqual from 'lodash/isEqual';
import filter from 'lodash/filter';

import { combineReducers } from 'redux';

import * as types from '../types/chats'


const byId =(state = {}, action) =>{
    switch(action.type){
        case types.CHATS_FETCH_COMPLETED:{
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
        case types.CHAT_ADD_STARTED: {
            const newState = {...state};
            newState[action.payload.id] = {
                ...action.payload,
                isConfirmed: false,
            };
            return newState
        }
        case types.CHAT_ADD_COMPLETED:{
            const{oldId,chat} = action.payload;
            const newState = omit(state,oldId);
            newState[chat.id] = {
                ...chat,
                isConfirmed: true
            }
        }
        case types.CHAT_DELETE_STARTED:{
            return omit(state, action.payload.chatId)
        }
        default:{
            return state
        }
    }
};

const order = (state = [], action) => {
    switch(action.type){
        case types.CHATS_FETCH_COMPLETED:{
            return union(state, action.payload.order);
        }
        case types.CHAT_ADD_STARTED:{
            return[...state, action.payload.id];
        }
        case types.CHAT_ADD_COMPLETED:{
            const{oldId, chat} = action.payload;
            return state.map(id => id === oldId? chat.id : id);
        }
        case types.CHAT_DELETE_STARTED:{
            return state.filter(id => id !== action.payload.id);
        }
        default:{
            return state
        }
    }
};

const isFetching = (state = false, action) =>{
    switch(action.type) {
        case types.CHATS_FETCH_COMPLETED:
        case types.CHATS_FETCH_FAILED: {
            return false;
        }
        case types.CHATS_FETCH_STARTED:{
            return true;
        }
        default:
            return state;
    }
};

const error = (state = null, action) => {
    switch(action.type) {
        case types.CHATS_FETCH_COMPLETED:
        case types.CHATS_FETCH_STARTED:
        case types.CHAT_ADD_STARTED:
        case types.CHAT_ADD_COMPLETED:
        case types.CHAT_DELETE_STARTED:
        case types.CHAT_DELETE_COMPLETED: {
            return null;
        }
        case types.CHATS_FETCH_FAILED:
        case types.CHAT_ADD_FAILED:
        case types.CHAT_DELETE_FAILED:{
            return action.payload.error;
        }
        default:
            return state;       
    }
}

const chats = combineReducers ({

    byId,
    order,
    isFetching,
    error
});

export default chats

export const getChat = (state, id) => state.byId[id];
export const getAllChats = state => state.order.map(id => getChat(state,id));
export const isFetchingChats = state => state.isFetching;
export const getError = state => state.error;
