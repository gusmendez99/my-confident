import React, { useState } from "react";

const MessageItem = ({ id, author, message, timestamp, isSender }) => {
	const renderUserImage = () => (
		<img
			class="w2 h2 w3-ns h3-ns br-100"
			src="http://tachyons.io/img/avatar-yavor.jpg"
		/>
	);

	return (
		<li class="flex items-center lh-copy pa3 ph0-l bb b--black-10">
			{isSender && renderUserImage()}
			<div class="pl3 flex-auto">
				<span class="f6 db black-70">{author}</span>
				<span class="f6 db black-70">{timestamp}</span>
				<span class="f6 db black-70">{message}</span>
			</div>
			{!isSender && renderUserImage()}
		</li>
	);
};

export default MessageItem;
