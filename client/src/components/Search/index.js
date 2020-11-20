import React from 'react';


const Search = () => {
    const handleCreateChat = () => {
        console.log("Llega");
    }
    return (
        <main>
            <div className="pa4-l">
                <input
                    className="f6 f5-l input-reset bn fl black-80 bg-white pa3 lh-solid w-100 w-75-m w-80-l br2-ns br--left-ns" 
                    placeholder="User name" 
                    list="users"/>
                <datalist id="users">
                    <option>User 1</option>
                    <option>User 2</option>
                    <option>User 3</option>
                </datalist>
                <button
                    className="f6 f5-l button-reset fl pv3 tc bn bg-animate bg-black-70 hover-bg-black white pointer w-100 w-25-m w-20-l br2-ns br--right-ns"
                    onClick={handleCreateChat}
                >
                    Crear
                </button>
            </div>
        </main>
    );
}

export default Search;
