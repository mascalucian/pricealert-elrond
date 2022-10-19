import { useState } from 'react';
import { ElvenInit } from './elven-init';
import reactLogo from './assets/react.svg';
import './App.css';
import './assets/scss/style.scss';

function App() {
  return (
    <div className="App">
      <div className="logos">
        <a href="https://quadrant.software" target="_blank">
          <img src="/white-logo-text.png" className="logo" alt="Quadrant logo" />
        </a>
      </div>
      <h1 className="header header-nav-right">Elrond Price Alerting</h1>
      <ElvenInit />
    </div>
  );
}

export default App;
