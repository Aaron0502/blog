import React from 'react';
import { Link, Router, RouteComponentProps } from '@reach/router'
import Blog from './myBlog'
import RenderMd from './myBlog/RenderMd/index'
import './App.css';

const PREFIX = process.env.PUBLIC_URL

const generateNav = function (arr: any, result = []) {
  return arr.reduce((prev: React.ReactElement[], blogSet: any) => {
    if (('name' in blogSet) && ('path' in blogSet)) {
      const { name, path } = blogSet
      prev.push(<li key={path}>
        <Link to={`${PREFIX}/myblog${path}`}>{name}</Link>
      </li>)
    } else {
      generateNav(Object.values(blogSet)[0], result)
    }
    return prev
  }, result)
}


function AppTEST(props: RouteComponentProps) {
  return (
    <ul className="App">
      {
        generateNav(BLOG_SET)
      }
    </ul>
  );
}

function App() {
  return <Router>
    <AppTEST path={`${PREFIX}/`} />
    <Blog path={`${PREFIX}/myblog`}>
      <RenderMd path=":first/:second" />
      <RenderMd path=":first/:second/:third" />
    </Blog>
  </Router >
}

export default App;
