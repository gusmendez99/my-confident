import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../../configuration";
import { connect } from "react-redux";

import socketIOClient from "socket.io-client";
import sjcl from 'sjcl'
import MessageList from "../../components/MessageList";

import * as selectors from "../../reducers";
import {
	startAddingMessage,
	completeAddingMessage,
} from "../../actions/messages";

import "./styles.css";

const Chat = ({ messages, sender, activeChat, isFetchingActiveChat, symmetricKey }) => {

  /*
	useEffect(() => {
    const socket = socketIOClient(`${API_BASE_URL}/chat`);
		socket.on("connect", () => {
			socket.emit("joined", {});
		});

		socket.on("message", (data) => {
      const currentSender = activeChat.sender;

			const idMessage = data["id"];
			const message = data["msg"];
			const sender = data["sender"];
			const receiver = data["receiver"];
			const datetime = data["dt"];

      // TODO: make symmetric key part of our Redux State
      if (!symmetric_key) {
				computeSymmetricKey();
			}
			decryptedMessage = sjcl.decrypt(symmetricKey, message);

			if (currentSender == sender) {
				// Do update pairs
				processReceivedMessage(idMessage, message, isSender);
			} else if (currentSender == receiver) {
				// Message processing for search protocol
				processReceivedMessage(idMessage, message, isSender);
			}
    });
    
    // CLEAN UP THE EFFECT
    return () => socket.disconnect();
  }, []);
  */

	const sendMessage = () => {
    // TODO: send message
  };

	const processReceivedMessage = (id, message, isSender) => {
    // TODO: process message
  };

	return (
		<div className="center">
			{!isFetchingActiveChat && activeChat != null ? (
				<div>
					<div className="chat-container">
						<MessageList messages={messages} sender={sender} />
					</div>
					<div className="mb4 mb0-ns fl w-100">
						<form className="pa4 black-80">
							<div>
								<label
									htmlFor="comment"
									className="f6 b db mb2"
								>
									Send a new message
								</label>
								<textarea
									id="comment"
									name="comment"
									className="db border-box hover-black w-100 measure ba b--black-20 pa2 br2 mb2"
									aria-describedby="comment-desc"
								></textarea>
								<small
									id="comment-desc"
									className="f6 black-60"
								>
									Remember: this is a{" "}
									<span className="b">secure</span> chat.
								</small>
							</div>
							<div className="mt3">
								<input
									className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6"
									type="submit"
									value="Send"
								/>
							</div>
						</form>
					</div>
				</div>
			) : (
				<div>
					<h2>You have not selected a chat yet...</h2>
				</div>
			)}
		</div>
	);
};

export default connect(
	(state) => ({
		messages: selectors.getActiveChatMessages(state),
		sender: selectors.getAuthUser(state),
		isFetchingActiveChat: selectors.isFetchingActiveChat(state),
		activeChat: selectors.getActiveChat(state),
	}),
	(dispatch) => ({
		// message sagas ommited, all message logic will work with websockets
	})
)(Chat);

/*
  MESSAGE STRUCTURE

  messages: [
      {
        id: 1,
        author: "John",
        content: "Hey bro!",
        timestamp: new Date().toLocaleTimeString(),
      },
      {
        id: 2,
        author: "Peter",
        content: "Sup bro, how are you?",
        timestamp: new Date().toLocaleTimeString(),
      },
     ...

    ]

*/
