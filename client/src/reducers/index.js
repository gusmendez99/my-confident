import { combineReducers } from "redux";

import auth, * as authSelectors from "./auth";

const reducer = combineReducers({
	auth,
});

export default reducer;

export const getAuthUser = (state) => authSelectors.getAuthUser(state.auth);
export const getIsAuthenticating = (state) =>
	authSelectors.getIsAuthenticating(state.auth);
export const getAuthError = (state) => authSelectors.getAuthError(state.auth);
export const isAuthenticated = (state) => getAuthUser(state.auth) != null;
