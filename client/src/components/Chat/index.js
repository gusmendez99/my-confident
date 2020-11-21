import React from 'react';
import { connect } from 'react-redux'

import * as selectors from '../../reducers'

const Chat = ({ chat, onDelete, onView, isSelected, isFetchingActiveChat }) => {
    //const create_date = new Date(chat.dt).toLocaleDateString();
    const last_msg_date = new Date(chat.last_message_dt).toLocaleTimeString();
    return (
        <article className="dt w-100 bb b--black-05 pb2 mt2" href="#0">
            <div className="dtc w2 w3-ns v-mid">
                <img src="http://tachyons.io/img/avatar-yavor.jpg" className="ba b--black-10 db br2 w2 w3-ns h2 h3-ns" />
            </div>
            <div className="dtc v-mid pl3">
                <h1 className="f6 f5-ns fw6 lh-title black mv0">{chat.user2_name}</h1>
                <h2 className="f6 fw4 mt0 mb0 black-60">{chat.last_message_dt === "" ? "few moments" : last_msg_date}</h2>
            </div>
            <div className="dtc v-mid">
                <div className="w-100 tr">
                    <button 
                        className="f6 button-reset bg-white ba b--black-10 dim pointer pv1 black-60" 
                        onClick={onDelete}
                        disabled={!chat.isConfirmed}
                    >
                        Delete
                    </button>
                    <button 
                        className={`f6 button-reset bg-${isSelected ? "green" : "white"} ba b--black-10 dim pointer pv1 black-60`} 
                        onClick={() => onView(chat.id)}
                        disabled={!chat.isConfirmed}
                    >
                        View
                    </button>
                </div>
            </div>
        </article>
    );
}

export default connect(
    (state) => ({
        isFetchingActiveChat: selectors.isFetchingActiveChat(state),
        activeChat: selectors.getActiveChat(state)
    }), 
    (dispatch) => ({
        
    })

)(Chat);

