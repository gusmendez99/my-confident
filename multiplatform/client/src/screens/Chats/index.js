import React, { useState } from 'react';

import ChatList from "../../components/ChatList";
import Search from "../../components/Search";
import Chat from "../Chat";
import { connect } from 'react-redux';

import * as selectors from '../../reducers'
import { startFetchingActiveChat } from '../../actions/chats'
import Navbar from "../../components/Navbar";


const Chats = ({ onSelectChat }) => {

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

