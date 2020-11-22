// Message Utils - Message keyword extraction

export const eliminateDuplicates = (array) => {
	const out = [];
	const obj = {};

	for (let i = 0; i < array.length; i++) {
		obj["keyword-" + array[i]] = 0;
	}
	for (let key in obj) {
		const originalKeyword = key.substring(8); // trim off first 8 chars "keyword-"
		out.push(originalKeyword);
	}
	return out;
};

export const getKeywords = (message) => {
	let text = message.match(/(w+)/g);
	const allowedChars = /[^a-zA-Z']+/g;
	// Remove all irrelevant characters
	text = message
		.replace(allowedChars, " ")
		.replace(/^\s+/, "")
		.replace(/\s+$/, "");
	text = text.toLowerCase();
	const wordList = eliminateDuplicates(text.split(/\s+/));
	return wordList;
};
