import React, { useEffect, useState } from 'react';

import { connect } from 'react-redux';
import * as selectors from '../../reducers';
import * as actions from '../../actions/chats';
import ChatList from "../../components/ChatList";
import Chat from "../Chat";


const Chats = ({  isFetching, onLoad }) => {

    // useEffect(() => {
    //     onLoad();
    // }, [])

    const [selectedChat, changeSelectedChat] = useState(null);

    const handleSelectChat = (id) => {
        changeSelectedChat(id);
    }

    return (
        <div className="mw9 center ph3-ns">
                <div className="fl w-50 pa2">
                    <h1>Mis chats</h1>
                    <ChatList handleSelectChat={handleSelectChat} /> 
                </div>
                <div className="fl w-50 pa2">
                    <h1>Chat</h1>
                    <Chat selectedChat={selectedChat}/>
            </div>
        </div>
    );
}

export default Chats;

// export default connect(
//     state => ({
//         chats: selectors.getAllChats(state),
//         isFetching: selectors.isFetchingChats(state),
//     }),
//     dispatch => ({
//         onLoad() {
//             dispatch(actions.startFetchingChats());
//         }
//     })
// )(Chats);