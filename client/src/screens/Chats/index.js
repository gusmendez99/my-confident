import React, { useEffect } from 'react';

import { connect } from 'react-redux';
import * as selectors from '../../reducers';
import * as actions from '../../actions/chats';
import Chat from '../../components/Chat';

//DUMMY DATA
// const chats = [
//     {
//         "dt": "2020-11-09T06:06:56.449162",
//         "id": 2,
//         "last_message_dt": "2020-11-09T06:06:56.449182",
//         "user1_id": 1,
//         "user1_name": "rob",
//         "user1_sk_sym": "estadebesergenerada123456",
//         "user2_id": 6,
//         "user2_name": "mick",
//         "user2_sk_sym": "generadaconestafunciona345"
//     },
//     {
//         "dt": "2020-11-09T06:05:53.067251",
//         "id": 1,
//         "last_message_dt": "2020-11-09T06:05:53.067276",
//         "user1_id": 1,
//         "user1_name": "rob",
//         "user1_sk_sym": "estadebesergenerada123456",
//         "user2_id": 5,
//         "user2_name": "rands",
//         "user2_sk_sym": "generadaconestafunciona345"
//     }
// ]

const Chats = ({ chats, isFetching, onLoad }) => {
    useEffect(() => {
        onLoad();
    }, [])

    return (
        <main className="">
            <div className="pa4">
                <div className="overflow-auto">
                    <h1>Mis chats</h1>
                    {isFetching ? (
                        <h1>Loading ... </h1>
                    ) : (
                            <table className="f6 w-100 mw8" cellSpacing='0'>
                                <thead>
                                    <tr>
                                        <th className="fw6 bb b--black-20 tl pb3 pr3 bg-white f3 lh-title">Username</th>
                                        <th className="fw6 bb b--black-20 tl pb3 pr3 bg-white f3 lh-title">Chat created</th>
                                        <th className="fw6 bb b--black-20 tl pb3 pr3 bg-white f3 lh-title">Last message time</th>
                                        <th className="fw6 bb b--black-20 tl pb3 pr3 bg-white f3 lh-title">Delete</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {chats.map(chat => (
                                        <Chat key={chat.id} chat={chat} />
                                    ))}
                                </tbody>
                            </table>
                        )}
                </div>
            </div>
        </main>
    );
}
  
  export default connect(
      state => ({
          chats: selectors.getChats(state),
          isFetching: selectors.getIsFetching(state),
      }),
      dispatch => ({
          onLoad() {
              dispatch(actions.startFetchChats());
          }
      })
  )(Chats);