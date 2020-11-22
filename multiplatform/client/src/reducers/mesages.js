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


const messages = combineReducers ({
    byId,
    order,
});

export default messages

export const getMessage = (state, id) => state.byId[id];
export const getActiveChatMessages = (state) =>  state.order.map(id => getMessage(state, id));