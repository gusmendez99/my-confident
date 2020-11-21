import React, { useState } from 'react';

import axios from 'axios';
import { connect } from 'react-redux';
import { v4 as uuidv4 } from 'uuid';

import { API_BASE_URL } from '../../configuration';
import * as selectors from '../../reducers';
import * as actions from '../../actions/chats';

import Chips, { Chip } from 'react-chips';

const tk = "Bearer eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2MDU5MzAxMjMsImV4cCI6MTYwNTkzMDQyMywianRpIjoiNDZlYmM4ZTctMTE2Yy00MWQ2LThkMTgtMjdkMGQxODIwNTdlIiwiaWQiOjEsInJscyI6IiIsInJmX2V4cCI6MTYwNTkzMDQyM30.xoBYsY-L56BiuVhAiTMdxHEY63ycG4kMEOQ-4J9QT7c"

const Search = ({ onCreate, token }) => {
    
    const [user, changeUser] = useState([]);
    const [chatData, changeChatData] = useState({});

    const handleChangeUser = async chips => {
        changeUser(chips);
        axios.get(`${API_BASE_URL}public-key?receiver-username=${chips[0]}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
                }
        })
            .then(response => changeChatData({...response.data, username: chips[0]}))
            .catch(error => console.log(error))
    }

    const handleCreateChat = () => {
        if(user[0]){
            onCreate(chatData);
        }
        changeUser([]);
    }

    return (
            <div className="flex justify-end pa4-l">
                <Chips 
                    value={user}
                    onChange={handleChangeUser}
                    placeholder="Search user"
                    fromSuggestionsOnly={true}
                    fetchSuggestions={value => 
                        axios.get(`${API_BASE_URL}user/find-all?term=${value}`, 
                            {
                                headers: {
                                    'Authorization': `Bearer ${token}`,
                                }
                            })
                            .then(function (response) {
                                return response.data.map(user => user.value)
                            })
                            .catch(error => console.log(error))
                    }
                />
                
                    <button
                        disabled={user.length <= 0 || user.length >= 2}
                        onClick={handleCreateChat}
                    >
                        Create
                    </button>
                
                {
                    user.length >= 2 && (
                        <p>Choose just one user</p>
                    )
                }
            </div>
    );
}

export default connect(
    state => ({
        token: selectors.getAuthToken(state),
    }),
    dispatch => ({
        onCreate (chat) {
            dispatch(actions.startAddingChat(uuidv4(),chat))
        }
    }),
)(Search);
