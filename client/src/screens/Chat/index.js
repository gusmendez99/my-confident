import React, { useState } from 'react';
import { connect } from 'react-redux'
import MessageList from '../../components/MessageList'

import './styles.css'

const Chat = ({ messages, sender, selectedChat }) => {
  return (
    <div className="center">
      {selectedChat ? 
      <div>
      <div className="chat-container">
        <MessageList
          messages={messages}
          sender={sender}
        />
      </div>
      <div class="mb4 mb0-ns fl w-100">
          <form class="pa4 black-80">
            <div>
              <label for="comment" class="f6 b db mb2">Send a new message</label>
              <textarea id="comment" name="comment" class="db border-box hover-black w-100 measure ba b--black-20 pa2 br2 mb2" aria-describedby="comment-desc"></textarea>
              <small id="comment-desc" class="f6 black-60">Remember: this is a <span class="b">secure</span> chat.</small>
            </div>
            <div class="mt3"><input class="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6" type="submit" value="Send"/></div>
          </form>
        </div>
      </div>
      :
      <div>
        <h2>Selecciona un chat</h2>
      </div>
      } 
    </div>
  )
}

export default connect(
  (state) => ({
    messages: [
      {
        id: 1,
        author: "John",
        content: "Hey bro!",
        timestamp: new Date().toLocaleTimeString(),
      },
      {
        id: 2,
        author: "Peter",
        content: "Sup bro, how are you?",
        timestamp: new Date().toLocaleTimeString(),
      },
      {
        id: 3,
        author: "Juan",
        content: "I'm fine, trying to do some stuff here",
        timestamp: new Date().toLocaleTimeString(),
      },
      {
        id: 4,
        author: "Peter",
        content: "Nice",
        timestamp: new Date().toLocaleTimeString(),
      },
      {
        id: 5,
        author: "Juan",
        content: "Ok",
        timestamp: new Date().toLocaleTimeString(),
      },
      {
        id: 6,
        author: "Peter",
        content: "Bye",
        timestamp: new Date().toLocaleTimeString(),
      },

    ],
    sender: "Peter",
  }),
  (dispatch) => ({

  })
)(Chat)