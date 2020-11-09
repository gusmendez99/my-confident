import React, { useState } from 'react';
import MessageItem from '../MessageItem'

import { uuidv4 as v4} from 'uuid';

const MessageList = ({ messages, sender }) => {
  return (
    <ul class="list pl0 mt0 measure center">
      {
        messages.map((message, idx) => {
          <MessageItem
            key={v4()}
            id={idx}
            isSender={message.author === sender}
            message={message.content}
            timestamp={message.timestamp}
            author={message.author}
          />
        })
      }
    </ul>
  )
}