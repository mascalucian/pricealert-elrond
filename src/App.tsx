import { useState } from 'react';
import { ElvenInit } from './elven-init';
import reactLogo from './assets/react.svg';
import './App.css';
import './assets/scss/style.scss';

function App() {
  return (
    <div className="App">
      <div className="logos">
        <a href="https://vitejs.dev" target="_blank">
          <img src="/vite.svg" className="logo" alt="Vite logo" />
        </a>
        <a href="https://reactjs.org" target="_blank">
          <img src={reactLogo} className="logo react" alt="React logo" />
        </a>
      </div>
      <h1 className="header header-nav-right">Elven.js + Vite + React</h1>
      <ElvenInit />
    </div>
  );
}

export default App;
