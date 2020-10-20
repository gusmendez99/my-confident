import React from 'react';

function SignIn({onAuthCompleted, onSelectSignUp}) {
  return (
    <main className="">
      <form className="measure center">
        <fieldset id="sign_up" className="ba b--transparent ph0 mh0">
          <legend className="f4 fw6 ph0 mh0">Sign In</legend>
          <div className="mt3">
            <label className="db fw6 lh-copy f6" for="name">Username</label>
            <input className="pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="name" name="email-address"  id="email-address" />
          </div>
          <div className="mv3">
            <label className="db fw6 lh-copy f6" for="password">Password</label>
            <input className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="password" name="password"  id="password" />
          </div>
        </fieldset>
        <div className="">
          <button onClick={() => onAuthCompleted(true)} className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6 dib">Sign In </button>
        </div>
        <div className="lh-copy mt3 db">
          <span className="f6 dib">Don't have an account? </span>
          <button onClick={() => onSelectSignUp(false)} className="f6 dim outline-0 bn bg-transparent dib pointer">Sign up</button>
        </div>
      </form>
    </main>
  );
}

export default SignIn;