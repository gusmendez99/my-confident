import { combineReducers } from "redux";

import * as types from "../types/auth";

const currentUser = (state = null, action) => {
	switch (action.type) {
		case types.SIGN_IN_STARTED:
		case types.SIGN_UP_STARTED:
		case types.SIGN_IN_FAILED:
		case types.SIGN_UP_FAILED:
		case types.SIGN_OUT: {
			return null;
		}
		case types.SIGN_IN_COMPLETED:
		case types.SIGN_UP_COMPLETED: {
			return action.payload.data;
		}
		default:
			return state;
	}
};

const token = (state = null, action) => {
	switch (action.type) {
		case types.SIGN_IN_STARTED:
		case types.SIGN_UP_STARTED:
		case types.SIGN_IN_FAILED:
		case types.SIGN_UP_FAILED:
		case types.SIGN_OUT: {
			return null;
		}
		case types.SIGN_IN_COMPLETED:
		case types.SIGN_UP_COMPLETED: {
			return action.payload.token;
		}
		default:
			return state;
	}
};

const error = (state = null, action) => {
	switch (action.type) {
		case types.SIGN_IN_STARTED:
		case types.SIGN_UP_STARTED:
		case types.SIGN_IN_COMPLETED:
		case types.SIGN_UP_COMPLETED:
		case types.SIGN_OUT: {
			return null;
		}
		case types.SIGN_IN_FAILED:
		case types.SIGN_UP_FAILED: {
			return action.payload.error;
		}
		default:
			return state;
	}
};

const isAuthenticating = (state = false, action) => {
	switch (action.type) {
		case types.SIGN_IN_FAILED:
		case types.SIGN_UP_FAILED:
		case types.SIGN_IN_COMPLETED:
		case types.SIGN_UP_COMPLETED:
		case types.SIGN_OUT: {
			return false;
		}
		case types.SIGN_IN_STARTED:
		case types.SIGN_UP_STARTED: {
			return true;
		}
		default:
			return state;
	}
};

const auth = combineReducers({
	currentUser,
	isAuthenticating,
	error,
	token,
});

export default auth;

export const getAuthUser = (state) => state.currentUser;
export const getAuthUsername = (state) => getAuthUser(state) !== null ? getAuthUser(state)["username"] : null 
export const getAuthUserPublicKey = (state) => getAuthUser(state) !== null ? getAuthUser(state)["public_key"] : null 
export const getAuthUserSecretKey = (state) => getAuthUser(state) !== null ? getAuthUser(state)["secret_key"] : null 

export const getIsAuthenticating = (state) => state.isAuthenticating;
export const getAuthError = (state) => state.error;
export const getAuthToken = (state) => state.token;
