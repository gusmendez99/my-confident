import React, {useState} from 'react';
import './App.css';
import SignIn from './screens/SignIn';
import SignUp from './screens/SignUp';
import StartChat from './screens/StartChat';
import tachyons from 'tachyons';

function App() {
  return (
    <div className="vh-100 flex flex-column justify-center">
      <SignUp />
      <SignIn></SignIn>
    </div>
  );
}

export default App;
