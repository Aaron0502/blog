import React from 'react';
import logo from './logo.svg';
import { Router, RouteComponentProps } from '@reach/router'
import Blog from './myBlog'
import MdRender from './myBlog/MdRender'
import './App.css';

function AppTEST(props: RouteComponentProps) {
  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          Edit <code>src/App.tsx</code> and save to reload.
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

function App() {
  return <Router>
    <AppTEST path="/" />
    <Blog path="/blog" >
      <MdRender path=":category/:name" />
    </Blog>
  </Router >
}

export default App;
