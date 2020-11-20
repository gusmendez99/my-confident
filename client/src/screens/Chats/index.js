import React, { useState } from 'react';

import ChatList from "../../components/ChatList";
import Chat from "../Chat";
import { connect } from 'react-redux';

import * as selectors from '../../reducers'
import { startFetchingActiveChat } from '../../actions/chats'


const Chats = ({ onSelectChat }) => {

const [selectedChat, changeSelectedChat] = useState(null);

const handleSelectChat = (id) => {
    changeSelectedChat(id);
    onSelectChat(id)
}

return (
    <div className="mw9 center ph3-ns">
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

export default connect(
    (state) => ({
        isFetchingActiveChat: selectors.isFetchingActiveChat(state)
    }),
    (dispatch) => ({
        onSelectChat(id) {
            console.log("Retriving chat id...", id)
            dispatch(startFetchingActiveChat(id))
        }
    })
)(Chats);

