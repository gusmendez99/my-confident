import React, { useState } from 'react';

import ChatList from "../../components/ChatList";
import Search from "../../components/Search";
import Chat from "../Chat";


const Chats = () => {

const [selectedChat, changeSelectedChat] = useState(null);

const handleSelectChat = (id) => {
    changeSelectedChat(id);
}

return (
    <div className="mw9 center ph3-ns">
            <Search />  
            <div className="fl w-50 pa2">
                <h1>Mis chats</h1>
                <ChatList handleSelectChat={handleSelectChat} selectedChat={selectedChat}/> 
            </div>
            <div className="fl w-50 pa2">
                <h1>Chat</h1>
                <Chat selectedChat={selectedChat}/>
        </div>
    </div>
    );
}

export default Chats;

