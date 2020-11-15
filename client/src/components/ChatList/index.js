import React, { useEffect } from 'react';

import Chat from '../Chat';


//DUMMY DATA
const chats = [
    {
        "dt": "2020-11-09T06:06:56.449162",
        "id": 2,
        "last_message_dt": "2020-11-09T06:06:56.449182",
        "user1_id": 1,
        "user1_name": "rob",
        "user1_sk_sym": "estadebesergenerada123456",
        "user2_id": 6,
        "user2_name": "mick",
        "user2_sk_sym": "generadaconestafunciona345"
    },
    {
        "dt": "2020-11-09T06:05:53.067251",
        "id": 1,
        "last_message_dt": "2020-11-09T06:05:53.067276",
        "user1_id": 1,
        "user1_name": "rob",
        "user1_sk_sym": "estadebesergenerada123456",
        "user2_id": 5,
        "user2_name": "rands",
        "user2_sk_sym": "generadaconestafunciona345"
    }
]



const ChatList = () => {

    // useEffect(() => {
    //     onLoad();
    // }, [])

    return (
        <main className="mw6 left">
            {chats.map(chat => (
                <Chat key={chat.id} chat={chat} />
            ))}        
        </main>
    )
}

export default ChatList;

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
// )(ChatList);