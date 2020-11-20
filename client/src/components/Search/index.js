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
        <main>
            <div className="pa4-l">
                <Chips 
                    value={user}
                    onChange={handleChangeUser}
                    placeholder="Search user"
                    fromSuggestionsOnly={true}
                    fetchSuggestions={value => 
                        axios.get(`${API_BASE_URL}user/find-all?term=${value}`, 
                            {
                                headers: {
                                'Authorization': `Bearer ${"eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJpYXQiOjE2MDU4NTEyODMsImV4cCI6MTYwNTg1MTU4MywianRpIjoiYTk5MDg5ZjMtN2UwYy00NjQ2LWJlOTQtZDNjZTg3N2UzN2M3IiwiaWQiOjEsInJscyI6IiIsInJmX2V4cCI6MTYwNTg1MTU4M30.UKcYRNd-W5KW1aUqiurtg1JiSar74CUMSRn8In88Mfw"}`
                                }
                            })
                            .then(function (response) {
                                return response.data.map(user => user.value)
                            })
                            .catch(error => console.log(error))
                    }
                />
                {
                    user.length > 0 && user.length < 2 && (
                            <button
                                className="f6 f5-l button-reset fl pv3 tc bn bg-animate bg-black-70 hover-bg-black white pointer w-100 w-25-m w-20-l br2-ns br--right-ns"
                            >
                                Create
                            </button>
                    )
                }
                {
                    user.length >= 2 && (
                        <p>Choose just one user</p>
                    )
                }
            </div>
        </main>
    );
}

export default Search;
