import { combineReducers } from "redux";

import auth, * as authSelectors from "./auth";
import chats, * as chatSelectors from "./chats";
import messages, * as messageSelectors from "./mesages";

const reducer = combineReducers({
	auth,
	chats,
	messages,
});

export default reducer;

export const getAuthUser = (state) => authSelectors.getAuthUser(state.auth);
export const getIsAuthenticating = (state) =>
	authSelectors.getIsAuthenticating(state.auth);
export const getAuthError = (state) => authSelectors.getAuthError(state.auth);
export const isAuthenticated = (state) => getAuthUser(state.auth) != null;

export const getChat = (state, id) => chatSelectors.getChat(state.chats,id);
export const getAllChats = state => chatSelectors.getAllChats(state.chats);
export const isFetchingChats = state => chatSelectors.isFetchingChats(state.chats);
export const getChatError = state => chatSelectors.getError(state.chats);

export const getMessage = (state, id) => messageSelectors.getMessage(state.messages, id);
export const getChatMessages = (state, chat_id) => messageSelectors.getChatMessages(state.messages, chat_id);
export const getAllMessages = state => messageSelectors.getAllMessages(state.messages);
export const isFetchingMessages = state => messageSelectors.isFetchingMessages(state.messages);
export const getMessagesError = state => messageSelectors.getError(state.messages);
