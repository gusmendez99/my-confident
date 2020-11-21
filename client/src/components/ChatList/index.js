import React, { useEffect } from 'react';
import { connect } from 'react-redux';

import * as selectors  from '../../reducers';
import { startFetchingChats } from '../../actions/chats';

import Chat from '../Chat';


const ChatList = ({ handleSelectChat, isFetching, chats, onLoad, selectedChat}) => {

    useEffect(() => {
        onLoad();
    }, [])

    return (
        <main className="mw6 left">
            {
            isFetching ? <h1>Loading ...</h1> : chats.map((chat, index) => (
                <Chat key={index} chat={chat} onView={handleSelectChat} isSelected={selectedChat === chat.id}/>
            ))}        
        </main>
    )
}

// export default ChatList;

export default connect(
    state => ({
        chats: selectors.getAllChats(state),
        isFetching: selectors.isFetchingChats(state),
    }),
    dispatch => ({
        onLoad() {
            dispatch(startFetchingChats());
        }
    })
)(ChatList);