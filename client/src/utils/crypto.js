import sjcl from "sjcl";
import { getKeywords, eliminateDuplicates } from "./message";

export const sha256 = (message) => {
	const bitArray = sjcl.hash.sha256.hash(message);
	const digestSHA256 = sjcl.codec.hex.fromBits(bitArray);
	return digestSHA256;
};

export const hmac256 = (key, message) => {
	const secret = sjcl.codec.utf8String.toBits(key);
	const hmac = new sjcl.misc.hmac(secret, sjcl.hash.sha256);
	hmac.update(sjcl.codec.utf8String.toBits(message));
	return sjcl.codec.hex.fromBits(hmac.digest());
};

export const tokenize = (key, w) => {
	return hmac256(key, sha256(w));
};

export const xorHex = (left, right) => {
	if (left.length != right.length) {
		throw new Error(
			"Invalid arguments for xorHex function. Received arguments of length " +
				left.length +
				" and " +
				right.length +
				". Expected equal length inputs."
		);
	}
	let result = "";

	for (i = 0; i < left.length; i++) {
		let temp = parseInt(left.charAt(i), 16) ^ parseInt(right.charAt(i), 16);
		result += temp.toString(16);
	}
	return result;
};

export const xorWithId = (id, hmacResult) => {
	// id is always 16 characters long, the head never changes
	const head = hmacResult.substring(0, 64 - id.length);
	const tail = hmacResult.substring(64 - id.length, 64);
	const newTail = xorHex(id, tail);
	return head + newTail;
};

export const encodeEntry = (key, w, id, cnt) => {
	const token = tokenize(key, w);
	const hkey = hmac256(token, cnt + "0"); // Hash Key = HMAC(k, cnt || "0")
	let idPad = id.toString(16); // rewrite in hex format
	const c1 = xorWithId(idPad, hmac256(token, cnt + "1")); // Hash Value = id ^ HMAC(k, cnt || "1")
	return {
		hash_key: hkey,
		hash_value: c1,
	};
};

export const produceEncodedPairList = (key, id, message, chatId, username) => {
	const keywordList = getKeywords(message);
	const encodedPairList = [];
	let userData = JSON.parse(sessionStorage.getItem(username));

	keywordList.forEach((keyword, index, array) => {
		const safeKeyword = "keyword-" + chatId + "-" + keyword;
		let keywordCount = userData[safeKeyword];

		if (keywordCount == null) {
			keywordCount = 1;
		} else {
			keywordCount = parseInt(keywordCount) + 1;
		}
		userData[safeKeyword] = keywordCount;

		// Update document count for keyword.
		const encodedPair = encodeEntry(key, keyword, id, keywordCount);
		encodedPairList.push(encodedPair);
	});

	sessionStorage.setItem(username, JSON.stringify(userData));
	return encodedPairList;
};

export const processMessage = (key, id, message, chatId, updatePairs) => {
	// Extracts encoded pair list from message
	const encodedPairList = produceEncodedPairList(key, id, message, chatId);

	if (updatePairs) {
		// Request data to use in API call with uri: '/update/pairs'
		const requestData = {
			pairs: JSON.stringify(encodedPairList),
		};

		return requestData;
	}
	return null;
};
