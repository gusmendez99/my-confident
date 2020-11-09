import React, { useEffect } from 'react';

import { connect } from 'react-redux';
import * as selectors from '../../reducers';
import * as actions from '../../actions/chats';

const Chats = ({ chats, isFetching, onLoad }) => {
    useEffect(() => {
        onLoad();
    }, [])

    return (
      <main className="">
          { !isFetching && (<h1>Loading ... </h1>)}
          <h1>Hola aqui irian los chats XD</h1>
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