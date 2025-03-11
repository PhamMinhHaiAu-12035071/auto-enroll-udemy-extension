import React from 'react';
import logo from '../../assets/img/logo.svg';
import Greetings from '../../containers/Greetings/Greetings';
import './Popup.css';

const Popup = () => {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/pages/Popup/Popup.jsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React!
        </a>
        <button
          onClick={() => {
            chrome.runtime.sendMessage({
              action: 'OPEN_SITE_UDEMY',
              url: 'https://www.udemy.com',
            });
          }}
        >
          Open New Tab
        </button>
      </header>
    </div>
  );
};

export default Popup;
