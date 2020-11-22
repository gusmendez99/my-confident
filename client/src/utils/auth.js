import sjcl, { hash } from "sjcl";

import { sha256 } from './crypto'

export const getSignInCryptoCredencials = (username, password) => {
	const hashPassword = sha256(password);
	const credentials = { username, password: hashPassword };
	return credentials;
};

export const saveUserData = (username, password, data, isNewUser = false) => {
	//if (isNewUser && data) {
	//	return data
	//} else {
	if(data){	
	// This comes from Django user data
		const encryptedUserData = data.user_data;
		const userData = sjcl.decrypt(password, encryptedUserData);
		// TODO: evaluate if it is a good idea to save this on session
		return JSON.parse(userData)
	}
	return null
};

export const getSignUpCryptoCredentials = (username, password) => {
	// Username and password must be valid, so we need to add regex to forms
	const pair = sjcl.ecc.elGamal.generateKeys(256);
	const publicKey = pair.pub.get();
	const secretKey = pair.sec.get();
	const hashPassword = sha256(password);

	const publicSerialized = sjcl.codec.base64.fromBits(
		publicKey.x.concat(publicKey.y)
	);
	const secretSerialized = sjcl.codec.base64.fromBits(secretKey);

	console.log("Secret serialized is: ", secretSerialized)

	const userData = {
		username,
		public_key: publicSerialized,
		secret_key: secretSerialized,
	};
	const encryptedUserData = sjcl.encrypt(password, JSON.stringify(userData));

	const credentials = {
		username,
		password: hashPassword,
		public_key: publicSerialized,
		user_data: encryptedUserData,
	};
	return credentials;
};
