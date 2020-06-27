import React from 'react'
import { RouteComponentProps } from '@reach/router'

interface BlogProps extends RouteComponentProps {
  children: React.ReactChild
}

export default function Blog(props: BlogProps) {
  return <>
    {
      props.children
    }</>
}
