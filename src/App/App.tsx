import React, { useEffect } from 'react';
import logo from '../logo.svg';
import './App.scss';
const { ipcRenderer } = window.require('electron');

function App() {
  useEffect(() => {
    ipcRenderer.send('search', { directories: null, searchParam: '', options: { hiddenFiles: false } })

    ipcRenderer.on('found', (event: any, arg: any) => {
      console.log("🚀 ~ file: App.tsx ~ line 11 ~ ipcRenderer.on ~ data", arg)
    })

  }, [])


  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit !!!! <code>src/App.tsx</code> and save to reload.
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

export default App;
