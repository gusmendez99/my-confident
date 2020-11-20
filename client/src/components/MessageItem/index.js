import React, { useState } from "react";

const MessageItem = ({ id, author, message, timestamp, isSender }) => {
	const renderUserImage = () => (
		<img
			class="w2 h2 w3-ns h3-ns br-100 ma2"
			src={ isSender ? require('../../images/sender.png') : require('../../images/receiver.png') }
		/>
	);

	return (
		<li class="flex items-center lh-copy pa3 ph0-l bb b--black-10">
			{!isSender && renderUserImage()}
			<div class={`flex-auto ${isSender ? 'tr pr3' : 'tl pl3'}`}>
				<span class="f6 db black-70">
					<strong>{author}</strong> ({timestamp})</span>
				<p class="f6 db black-70">{message}</p>
			</div>
			{isSender && renderUserImage()}
		</li>
	);
};

export default MessageItem;
