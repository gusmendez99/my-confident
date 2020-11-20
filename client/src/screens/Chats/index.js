import React, { useState } from 'react';

import ChatList from "../../components/ChatList";
import Chat from "../Chat";
import Navbar from "../../components/Navbar";

const Chats = () => {

    const [selectedChat, changeSelectedChat] = useState(null);

    const handleSelectChat = (id) => {
        changeSelectedChat(id);
    }

    return (
        <div className="vh-100 flex flex-column" >
            <Navbar isAuthenticated={true} />
            <div>
                <div className="fl w-50 pa3 center">
                    <h1>Mis chats</h1>
                    <ChatList handleSelectChat={handleSelectChat} selectedChat={selectedChat} />
                </div>
                <div className="fl w-50 pa3 center">
                    <h1>Chat</h1>
                    <Chat selectedChat={selectedChat} />
                </div>
            </div>
        </div>
    );
}

export default Chats;

