import { combineReducers } from "redux";

import auth, * as authSelectors from "./auth";
import chats, * as chatsSelectors from "./chats";

const reducer = combineReducers({
	auth,
	chats,
});

export default reducer;

export const getAuthUser = (state) => authSelectors.getAuthUser(state.auth);
export const getIsAuthenticating = (state) =>
	authSelectors.getIsAuthenticating(state.auth);
export const getAuthError = (state) => authSelectors.getAuthError(state.auth);
export const isAuthenticated = (state) => getAuthUser(state.auth) != null;

export const getChat = (state, id) => chatsSelectors.getChat(state.chats, id);
export const getChats = state => chatsSelectors.getChats(state.chats);
export const getIsFetching = state => chatsSelectors.getIsFetching(state.chats);
export const getError = state => chatsSelectors.getError(state.chats);