import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import { useHistory } from "react-router-dom";


import * as actions from '../../actions/auth';
import * as selectors from '../../reducers/index';

const SignIn = ({onSignIn, isAuthenticated, authError, isAuthenticating}) => {
  const history = useHistory();

  const updateHistory = (route) => {
    history.push(`/${route}`);
  }

  useEffect(() => {
    if (isAuthenticated){
      updateHistory("my-chats");
    }
  }, [isAuthenticated]); 

  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  return (
    <main className="">
      <div className="measure center">
        <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
          <legend className="f4 fw6 ph0 mh0">Sign In</legend>
          <div className="mt3">
            <label className="db fw6 lh-copy f6" htmlFor="name">Username</label>
            <input onChange={(event) => setUsername(event.target.value)} className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="name" name="username"  id="username" />
          </div>
          <div className="mv3">
            <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
            <input onChange={(event) => setPassword(event.target.value)} className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="password" name="password"  id="password" />
          </div>
        </fieldset>
        <div className="">
          <button onClick={() => {onSignIn(username, password)}} className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib">Sign In </button>
          { authError && !isAuthenticating &&(
            <div className="b ml2 red f6 dib">There has been an error, please try again</div>
            )
          }
          {isAuthenticating &&(
            <div className="b ml2 green f6 dib">Loading...</div>
            )
          }
        </div>
        <div className="lh-copy mt3 db">
          <span className="f6 dib">Don't have an account? </span>
          <button onClick={() => updateHistory("signup")} className="f6 dim outline-0 bn bg-transparent dib pointer">Sign up</button>
        </div>
      </div>
    </main>
  );
}

export default connect(
  (state) => ({
    isAuthenticated: selectors.isAuthenticated(state),
    authError: selectors.getAuthError(state),
    isAuthenticating: selectors.getIsAuthenticating(state)
  }),
  (dispatch) => ({
    onSignIn(username, password) {
      dispatch(actions.startSignIn(username, password))
    },
  }),
)(SignIn);