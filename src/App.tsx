import React from 'react';
import { Link, Router, RouteComponentProps } from '@reach/router'
import Blog, { fileMap } from './myBlog'
import MdRender from './myBlog/MdRender'
import './App.css';

function AppTEST(props: RouteComponentProps) {
  return (
    <ul className="App">
      {
        Object.keys(fileMap).reduce((prev: React.ReactElement[], category: string) => {
          const fileArr: string[] = fileMap[category]

          return prev.concat(fileArr.map(fileName => {
            return <li key={fileName}>
              <Link to={`/blog/${category}/${fileName}`}>{fileName}</Link>
            </li>
          }
          ))
        }, [])
      }
    </ul>
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
