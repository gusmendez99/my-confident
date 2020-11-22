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
export const getAuthUsername = (state) => authSelectors.getAuthUsername(state.auth);
export const getAuthUserPublicKey = (state) => authSelectors.getAuthUserPublicKey(state.auth);
export const getAuthUserSecretKey = (state) => authSelectors.getAuthUserSecretKey(state.auth);
export const getIsAuthenticating = (state) =>
	authSelectors.getIsAuthenticating(state.auth);
export const getAuthError = (state) => authSelectors.getAuthError(state.auth);
export const isAuthenticated = (state) => authSelectors.getAuthUser(state.auth) != null;
export const getAuthToken = (state) => authSelectors.getAuthToken(state.auth);

export const getChat = (state, id) => chatSelectors.getChat(state.chats,id);
export const getAllChats = state => chatSelectors.getAllChats(state.chats);
export const isFetchingChats = state => chatSelectors.isFetchingChats(state.chats);
export const isFetchingActiveChat = state => chatSelectors.isFetchingActiveChat(state.chats);
export const getActiveChat = state => chatSelectors.getActiveChat(state.chats);
export const getChatError = state => chatSelectors.getError(state.chats);
export const getSymmetricKey = state => chatSelectors.getSymmetricKey(state.chats);

export const getMessage = (state, id) => messageSelectors.getMessage(state.messages, id);
export const getActiveChatMessages = (state) => messageSelectors.getActiveChatMessages(state.messages);