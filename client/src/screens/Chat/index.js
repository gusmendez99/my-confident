import React, { useState, useEffect } from "react";
import { API_BASE_URL } from "../../configuration";
import { connect } from "react-redux";

import io from "socket.io-client";
import sjcl from "sjcl";
import MessageList from "../../components/MessageList";

import * as selectors from "../../reducers";
import * as chatUtils from "../../utils/chat";
import * as cryptoUtils from '../../utils/crypto'

import { startAddingMessage } from "../../actions/messages";

import { setSymmetricKey } from "../../actions/chats";
import useChat from "../../useChat";

import "./styles.css";



const Chat = ({
	authUsername,
	//messages,
	sender,
	activeChat,
	isFetchingActiveChat,
	symmetricKey,
	authUserSecretKey,
	onChangeSymmetricKey,
	onUpdatePairs
}) => {

	console.log("Testing AuthData: ", authUsername, authUserSecretKey)

	const [message, setMessage] = useState('')
	const { messages, sendMessage } = useChat( activeChat ? activeChat.id : null);

	/*useEffect(() => {
		socket.on("message", (data) => {
			const idMessage = data["id"];
			const message = data["msg"];
			const sender = data["sender"];
			const receiver = data["receiver"];
			const datetime = data["dt"];

			// TODO: make symmetric key part of our Redux State
			if (!symmetricKey && activeChat) {
				const newSymmetricKey = chatUtils.computeSymmetrycalKey(authUserSecretKey, activeChat.encryptedSymKey);
				onChangeSymmetricKey(newSymmetricKey);
			}

			const decryptedMessage = sjcl.decrypt(symmetricKey, message);

			if (authUsername == sender) {
				// Do update pairs
				processReceivedMessage(idMessage, decryptedMessage, true);
			} else if (authUsername == receiver) {
				// Message processing for search protocol
				processReceivedMessage(idMessage, decryptedMessage, false);
			}
			console.log("This is new message: ", idMessage, decryptedMessage, sender, datetime)
		});

		// CLEAN UP THE EFFECT
		return () => socket.disconnect();
	}, []);*/

	const sendCurrentMessage = (myMessage) => {
		// TODO: send message via sockets, update redux message list
		if (myMessage === '' || myMessage.length > 250) {
			// Empty message, do not send
			return;
		}
		if (!symmetricKey && activeChat) {
			const newSymmetricKey = chatUtils.computeSymmetrycalKey(authUserSecretKey, activeChat.encryptedSymKey);
			onChangeSymmetricKey(newSymmetricKey);
			return; // TODO: set empty messages or something else...
		}

		if(symmetricKey && activeChat.encryptedSymKey && authUserSecretKey) {
			console.log("Plain Text Message: ", myMessage, symmetricKey)
			const cryptedMessage = sjcl.encrypt(symmetricKey, myMessage);
			console.log("Crypted Message: ", cryptedMessage)
	
			// Send message to server
			sendMessage({ 'msg': cryptedMessage })
			setMessage('')
		} else {
			// TODO: put error message here
			console.log("Error sending message...")
		}
	};

	const processReceivedMessage = (idMessage, message, hasToUpdatePairs) => {
		// TODO: process message
		const keyMessage = "message-" + idMessage.toString();
		const idProcessed = null;
		// TODO: get user keywords from redux
		//const idProcessed = getUserKeywords()[messageKey];
    if (idProcessed != null) {
      return;
    } else {
			const data = cryptoUtils.processMessage(
				symmetricKey,
				idMessage,
				message,
				activeChat.id,
				hasToUpdatePairs
			);
			if (data) {
				const { pairs, userKeywords } = data;
				const keywordsToUpdate = userKeywords[keyMessage]
				onUpdatePairs(pairs)
			}
		}
	};



	return (
		<div className="center">
			{!isFetchingActiveChat && activeChat != null ? (
				<div>
					<div className="chat-container">
						<MessageList messages={messages} sender={sender} />
					</div>
					<div className="mb4 mb0-ns fl w-100">
						<div className="pa4 black-80">
							<div>
								<label
									htmlFor="comment"
									className="f6 b db mb2"
								>
									Send a new message
								</label>
								<textarea
									id="message"
									name="message"
									value={message}
									onChange={e => setMessage(e.target.value)}
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
								<button
									className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6"
									onClick={() => sendCurrentMessage(message)}
								>Send</button>
							</div>
						</div>
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
		//messages: selectors.getActiveChatMessages(state),
		sender: selectors.getAuthUser(state),
		isFetchingActiveChat: selectors.isFetchingActiveChat(state),
		activeChat: selectors.getActiveChat(state),
		authUsername: selectors.getAuthUsername(state),
		authUserSecretKey: selectors.getAuthUserSecretKey(state),
		symmetricKey: selectors.getSymmetricKey(state),
	}),
	(dispatch) => ({
		// message sagas ommited, all message logic will work with websockets
		onChangeSymmetricKey: (key) => dispatch(setSymmetricKey(key)),
		onUpdatePairs: pairs => {
			//dispatch(startUpdatingPairs(pairs))
			console.log("Updating pairs...")
		}
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
