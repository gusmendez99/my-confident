import React from 'react';

function StartChat() {
  return (
    <main className="">
      <form className="measure center flex flex-column items-center justify-center mw6-l">
        <fieldset id="sign_up" className="ba b--transparent ph0 mh0 w-100">
          <legend className="f4 fw6 ph0 mh0 center">Start Chat</legend>
          <div className="mt3">
            <label className="db fw6 lh-copy f6" for="name">Reciever username</label>
            <input className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="password" name="password"  id="username" />
          </div>
          <div className="mv3">
            <label className="db fw6 lh-copy f6" for="password">My Public Key</label>
            <input className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="password" name="password"  id="pk1" />
          </div>
          <div className="mv3">
            <label className="db fw6 lh-copy f6" for="password">Reciever Public Key</label>
            <input className="b pa2 input-reset ba bg-transparent hover-bg-black hover-white w-100" type="password" name="password"  id="pk2" />
          </div>

        </fieldset>
        <button className="b ph3 pv2 input-reset ba b--black bg-transparent grow pointer f6">Start Chat</button>
      </form>
    </main>
  );
}

export default StartChat;
