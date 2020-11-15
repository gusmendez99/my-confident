import React, { useState } from "react";

const MessageItem = ({ id, author, message, timestamp, isSender }) => {
	const renderUserImage = () => (
		<img
			className="w2 h2 w3-ns h3-ns br-100 ma2"
			src={ isSender ? require('../../images/sender.png') : require('../../images/receiver.png') }
		/>
	);

	return (
		<li className="flex items-center lh-copy pa3 ph0-l bb b--black-10">
			{!isSender && renderUserImage()}
			<div className={`flex-auto ${isSender ? 'tr pr3' : 'tl pl3'}`}>
				<span className="f6 db black-70">
					<strong>{author}</strong> ({timestamp})</span>
				<p className="f6 db black-70">{message}</p>
			</div>
			{isSender && renderUserImage()}
		</li>
	);
};

export default MessageItem;
