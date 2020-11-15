import React, { useEffect } from 'react';

import { connect } from 'react-redux';
import * as selectors from '../../reducers';
import * as actions from '../../actions/chats';
import ChatList from "../../components/ChatList";


const Chats = ({  isFetching, onLoad }) => {

    // useEffect(() => {
    //     onLoad();
    // }, [])

    return (
        <main className="mw7 left">
            <div className="pa4">
                <div className="overflow-auto">
                    <h1>Mis chats</h1>
                    <ChatList /> 
                </div>
            </div>
        </main>
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