import sjcl from "sjcl";

import { sha256 } from './crypto'

const getSignInCryptoCredencials = (username, password) => {
	const hashPassword = sha256(password);
	const credentials = { username, password: hashPassword };
	return credentials;
};

const saveUserData = (username, password, data, isNewUser = false) => {
	if (isNewUser && data) {
		sessionStorage.setItem(username, data);
	} else {
		// This comes from Django user data
		const encryptedUserData = data.user_data;
		const userData = sjcl.decrypt(password, encryptedUserData);
		// TODO: evaluate if it is a good idea to save this on session
		sessionStorage.setItem(username, userData);
	}
};

const getSignUpCryptoCredentials = (username, password) => {
	// Username and password must be valid, so we need to add regex to forms
	const pair = sjcl.ecc.elGamal.generateKeys(256);
	const publicKey = pair.pub.get();
	const secretKey = pair.sec.get();

	const publicSerialized = sjcl.codec.base64.fromBits(
		publicKey.x.concat(publicKey.y)
	);
	const secretSerialized = sjcl.codec.base64.fromBits(secretKey);

	const userData = {
		username,
		public_key: publicSerialized,
		secret_key: secretSerialized,
	};
	const encryptedUserData = sjcl.encrypt(password, JSON.stringify(userData));

	const credentials = {
		username,
		password,
		public_key: publicSerialized,
		user_data: encryptedUserData,
	};
	return credentials;
};
