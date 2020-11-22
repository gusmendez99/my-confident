import React, { useState } from 'react';
import MessageItem from '../MessageItem'

import { v4 as uuidv4} from 'uuid';

const MessageList = ({ messages, sender }) => {
  return (
    <ul className="list pl0 mt0 measure center">
      {
        messages.map((message, idx) => (
          <MessageItem
            key={uuidv4()}
            id={message.id}
            isSender={message.author === sender}
            message={message.content}
            timestamp={message.timestamp}
            author={message.author}
          />
        ))
      }
    </ul>
  )
}

export default MessageList