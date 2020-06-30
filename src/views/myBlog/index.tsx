import React from 'react'
import { Switch, Route } from 'react-router-dom'
import RenderMd from './RenderMd'

export default function Blog() {
  return <Switch>
    <Route exact path={"/myblog/:first/:second"} component={RenderMd}></Route>
    <Route path={"/myblog/:first/:second/:third"} component={RenderMd}></Route>
  </Switch>
}
