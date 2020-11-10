import React from 'react';

const Chat = ({ chat, onDelete }) => {
    const create_date = new Date(chat.dt).toLocaleDateString();
    const last_msg_date = new Date(chat.last_message_dt).toLocaleTimeString();
    return(
        <tr>
            <td className="pv3 pr3 bb b--black-20">{chat.user2_name}</td>
            <td className="pv3 pr3 bb b--black-20">{create_date}</td>
            <td className="pv3 pr3 bb b--black-20">{last_msg_date}</td>
            <td className="pv3 pr3 bb b--black-20"><button  class="f6 grow no-underline br-pill ph3 pv2 mb2 dib white bg-dark-blue" onClick={() => onDelete(chat.id)}>Delete</button></td>
        </tr>
    );
}

export default Chat;

