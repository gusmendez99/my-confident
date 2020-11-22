import sjcl from "sjcl";

export const getDataToCreateChat = (username, senderPublicKey, receiverPublicKey) => {
	// public key must be valid to create a new chat
	// validate if sender.pk and receiver.pk are not null

	const myPublicKey = new sjcl.ecc.elGamal.publicKey(
		sjcl.ecc.curves.c256,
		sjcl.codec.base64.toBits(senderPublicKey)
	);

	const newReceiverPublicKey = new sjcl.ecc.elGamal.publicKey(
		sjcl.ecc.curves.c256,
		sjcl.codec.base64.toBits(receiverPublicKey)
	);

	const secretSymmetricalKey = sjcl.codec.base64.fromBits(
		sjcl.random.randomWords(8, 10)
	);
	const secretSymmetrical1 = sjcl.encrypt(myPublicKey, secretSymmetricalKey);
	const secretSymmetrical2 = sjcl.encrypt(
		newReceiverPublicKey,
		secretSymmetricalKey
	);

	const data = {
		sk_sym_1: secretSymmetrical1,
		sk_sym_2: secretSymmetrical2,
		receiver_username: username,
		receiver_public_key: receiverPublicKey,
	};

	return data;
};

export const computeSymmetrycalKey = (userSecretKey, encryptedSymmetricalKey) => {
	// Unserialize private key
	//const serializedKey = JSON.parse(userSecretKey)
	console.log("Computing...", userSecretKey, encryptedSymmetricalKey)
	//const encSymParsed = JSON.stringify(JSON.parse(encryptedSymmetricalKey)) 
	const bitSecret = sjcl.codec.base64.toBits(userSecretKey)
	// console.log("PASS 2")
	// console.log("C521: ", sjcl.ecc.curves.c256)
	// console.log("C521: ", sjcl.ecc.curves.c256.field.fromBits(bitSecret))
	const secretUnserialized = new sjcl.ecc.elGamal.secretKey(
		sjcl.ecc.curves.c256,
		sjcl.ecc.curves.c256.field.fromBits(bitSecret)
	);
	const symmetricalKey = sjcl.decrypt(secretUnserialized, encryptedSymmetricalKey)
	console.log("PASS 3")
	return symmetricalKey
}