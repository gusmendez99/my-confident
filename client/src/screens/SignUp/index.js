import React from 'react';
import { connect } from 'react-redux';
import * as actions from '../../actions/auth';

function SignUp({onSignUp, onSelectSignIn}) {
  return (
    <main className="">
      <div className="measure center">
        <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
          <legend className="f4 fw6 ph0 mh0">Sign Up</legend>
          <div className="mt3">
            <label className="db fw6 lh-copy f6" htmlFor="name">Username</label>
            <input className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="name" name="email-address"  id="email-address" />
          </div>
          <div className="mv3">
            <label className="db fw6 lh-copy f6" htmlFor="password">Password</label>
            <input className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="password" name="password"  id="password" />
          </div>
        </fieldset>
        <div className="">
          <button onClick={() => onSignUp('aylmao', '12345678')} className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib">Sign Up </button>
        </div>
        <div className="lh-copy mt3 db">
          <span className="f6 dib">Already have an account? </span>
          <button onClick={() => onSelectSignIn(true)} className="f6 dim outline-0 bn bg-transparent dib pointer">Sign in</button>
        </div>
      </div>
    </main>
  );
}

export default connect(
  undefined,
  (dispatch) => ({
    onSignUp(username, password) {
      dispatch(actions.startSignUp(username, password))
    },
  }),
)(SignUp);