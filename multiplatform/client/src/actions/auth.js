import * as types from "../types/auth";

export const startSignIn = (username, password) => ({
	type: types.SIGN_IN_STARTED,
	payload: { username, password },
});

export const completeSignIn = (token, data) => ({
	type: types.SIGN_IN_COMPLETED,
	payload: { token, data },
});

export const failSignIn = (error) => ({
	type: types.SIGN_IN_FAILED,
	payload: { error },
});

export const startSignUp = (username, password) => ({
	type: types.SIGN_UP_STARTED,
	payload: { username, password },
});

export const completeSignUp = (token, data) => ({
	type: types.SIGN_UP_COMPLETED,
	payload: { token, data },
});

export const failSignUp = (error) => ({
	type: types.SIGN_UP_FAILED,
	payload: { error },
});

export const signOut = () => ({
	type: types.SIGN_OUT,
});
