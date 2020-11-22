import { useEffect, useRef, useState } from "react";
import socketIOClient from "socket.io-client";
import { API_BASE_URL } from './configuration'

const NEW_CHAT_MESSAGE_EVENT = "new_message"; // Name of the event
const INCOMING_CHAT_MESSAGE_EVENT = "new_message";
const LEAVE_CHAT_EVENT = "left";
const SOCKET_SERVER_URL = `${API_BASE_URL}/chat`;

const useChat = (idChat) => {
  const [messages, setMessages] = useState([]); // Sent and received messages
  const socketRef = useRef();

  useEffect(() => {
    
    // Creates a WebSocket connection
    socketRef.current = socketIOClient(SOCKET_SERVER_URL, {
      query: { idChat },
    });
    
    // Listens for incoming messages
    socketRef.current.on(INCOMING_CHAT_MESSAGE_EVENT, (message) => {
      const incomingMessage = {
        ...message,
        //ownedByCurrentUser: message.senderId === socketRef.current.id,
      };
      setMessages((messages) => [...messages, incomingMessage]);
    });
    
    // Destroys the socket reference
    // when the connection is closed
    return () => {
      socketRef.current.disconnect();
    };
  }, [idChat]);

  // Sends a message to the server that
  // forwards it to all users in the same room
  const sendMessage = (messageBody) => {
    socketRef.current.emit(NEW_CHAT_MESSAGE_EVENT, messageBody);
  };

  const leaveChat = () => {
		socketRef.current.emit(LEAVE_CHAT_EVENT, {}, () => {
			socketRef.current.disconnect();
			// Go back to the login page
			// TODO: set activeChat as null
		});
	}

  return { messages, sendMessage };
};

export default useChat;