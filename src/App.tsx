import React from 'react';
import { HashRouter, Switch, Route, Link } from 'react-router-dom'
import Blog from './views/myBlog'
import './App.css';

const generateNav = function (arr: any, result = []) {
  return arr.reduce((prev: React.ReactElement[], blogSet: any) => {
    if (('name' in blogSet) && ('path' in blogSet)) {
      const { name, path } = blogSet
      prev.push(<li key={path}>
        <Link to={`/myblog${path}`}>{name}</Link>
      </li>)
    } else {
      generateNav(Object.values(blogSet)[0], result)
    }
    return prev
  }, result)
}


function AppTEST() {
  return (
    <ul className="App">
      {
        generateNav(BLOG_SET)
      }
    </ul>
  );
}

function App() {
  return <HashRouter>
    <Switch>
      <Route exact path='/' component={AppTEST} />
      <Route path='/myblog'>
        <Blog />
      </Route>
    </Switch>
  </HashRouter >
}

export default App;
