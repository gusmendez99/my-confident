import React from 'react';

const Navbar = ({ isAuthenticated }) => {
    return (
        <nav className="flex justify-between bb b--white-10 bg-dark-blue ">
            <a className="link white-70 hover-white no-underline flex items-center pa3" href="">
                <h1>My Confident - Secure Chat</h1>
            </a>
            <div className="flex-grow pa3 flex items-center">
                {
                    isAuthenticated && (
                        <a className="f6 dib white bg-animate hover-bg-white hover-black no-underline pv2 ph4 br-pill ba b--white-20" href="#0">Log Out</a>
                    )
                }
            </div>
        </nav>

    )
}

export default Navbar;