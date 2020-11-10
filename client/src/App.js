import React, {useState} from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link
} from "react-router-dom";


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
      <Router>
      <div>
        <Switch>
          <Route path="/signin">
            <SignIn />
          </Route>
          <Route path="/signup">
            <SignUp />
          </Route>
          <Route path="/chat">
            <Chat />
          </Route>
          <Route path="/start-chat">
            <StartChat />
          </Route>
          <Route path="/my-chats">
            <Chats />
          </Route>
        </Switch>
      </div>
    </Router>
    </div>
  );
}

export default App;
