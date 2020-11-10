import React, {useState} from 'react';
import './App.css';
import SignIn from './screens/SignIn';
import SignUp from './screens/SignUp';
import StartChat from './screens/StartChat';
import Chats from './screens/Chats';
import Chat from './screens/Chat'
import tachyons from 'tachyons';

function App() {
  return (
    <div className="vh-100 flex flex-column justify-center">
      {/* { isAuth ? (
        <StartChat />
        ) : hasAccount ? (
          <SignIn onAuthCompleted={changeIsAuth} onSelectSignUp={changeHasAccount}/>
        ) : (
          <SignUp onAuthCompleted={changeIsAuth} onSelectSignIn={changeHasAccount}/>
        )
      } */}
      <Chats />
    </div>
  );
}

export default App;
