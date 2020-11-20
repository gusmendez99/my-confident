import React, { useState } from 'react';

import axios from 'axios';
import { API_BASE_URL } from '../../configuration';

import Chips, { Chip } from 'react-chips';

const Search = () => {
    
    const [user, changeUser] = useState([]);

    const handleChangeUser = chips => {
        changeUser(chips);
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
                                'Authorization': `Bearer ${"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2MDU4NTQzOTksImV4cCI6MTYwNTg1NDY5OSwianRpIjoiNTY5Mjk3NTEtZTYwNi00NjdhLTg1ZDAtNjNhNGQxMjIzZmRhIiwiaWQiOjEsInJscyI6IiIsInJmX2V4cCI6MTYwNTg1NDY5OX0.8Hh2zVEwl71uqRSjSLs8gOeUCc600tCVziopQM2LgHs"}`
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

export default Search;
