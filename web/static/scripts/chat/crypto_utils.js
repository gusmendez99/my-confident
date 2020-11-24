function sha256(message) {
	var bitArray = sjcl.hash.sha256.hash(message);
	var digest_sha256 = sjcl.codec.hex.fromBits(bitArray);
	return digest_sha256;
}

function hmac256(key, message) {
	var secret = sjcl.codec.utf8String.toBits(key);
	var hmac = new sjcl.misc.hmac(secret, sjcl.hash.sha256);
	hmac.update(sjcl.codec.utf8String.toBits(message));
	return sjcl.codec.hex.fromBits(hmac.digest());
}

function tokenize(key, w) {
	return hmac256(key, sha256(w));
}

function xorHex(left, right) {
	if (left.length != right.length) {
		throw new Error(
			"Invalid arguments for xorHex function. Received arguments of length " +
				left.length +
				" and " +
				right.length +
				". Expected equal length inputs."
		);
	}
	var result = "",
		temp;
	for (i = 0; i < left.length; i++) {
		temp = parseInt(left.charAt(i), 16) ^ parseInt(right.charAt(i), 16);
		result += temp.toString(16);
	}
	return result;
}

function xorWithId(id, hmacResult) {
	var id_length = id.length;
	// id is always 16 characters long, the head never changes
	var head = hmacResult.substring(0, 64 - id_length);
	var tail = hmacResult.substring(64 - id_length, 64);
	var newTail = xorHex(id, tail);
	return head + newTail;
}

function encodeEntry(key, w, id, cnt) {
	var token = tokenize(key, w);
	var hkey = hmac256(token, cnt + "0"); //Hash Key = HMAC(k, cnt || "0")
	id = id.toString(16); // rewrite in hex format
	var c1 = xorWithId(id, hmac256(token, cnt + "1")); // Hash Value = id ^ HMAC(k, cnt || "1")
	return {
		hash_key: hkey,
		hash_value: c1,
	};
}

function produceEncodedPairList(key, id, message, chat_id) {
	var keywordList = getKeywords(message);
	var encodedPairList = [];
	var user_data = JSON.parse(sessionStorage.getItem(CURRENT_USERNAME));

	keywordList.forEach(function (keyword, index, array) {
		var safeKeyword = "keyword-" + chat_id + "-" + keyword;
		var keyword_count = user_data[safeKeyword];

		if (keyword_count == null) {
			keyword_count = 1;
		} else {
			keyword_count = parseInt(keyword_count) + 1;
		}
		user_data[safeKeyword] = keyword_count;

		var encodedPair = encodeEntry(key, keyword, id, keyword_count);
		encodedPairList.push(encodedPair);
	});

	sessionStorage.setItem(CURRENT_USERNAME, JSON.stringify(user_data));

	return encodedPairList;
}

function processMessage(key, id, message, chat_id, update_pairs) {
	encodedPairList = produceEncodedPairList(key, id, message, chat_id);

	if (update_pairs) {
		var req_data = {
			pairs: JSON.stringify(encodedPairList),
		};
		var path = window.location.pathname;
		$.post($SCRIPT_ROOT + path + "/update-pairs", req_data, function (
			data
		) {
			if (data.error) {
				alert(data.error);
			}
			return;
		});
	}
	return true;
}
