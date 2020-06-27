import React from 'react'
import { RouteComponentProps } from '@reach/router'

interface fileMap {
  [propName: string]: string[]
}

export const fileMap: fileMap = {}
const context = require.context('./md', true, /\.md$/, 'lazy')
context.keys().forEach(key => {
  const [category, fileName] = key.split('/').slice(1)
  const name = fileName.replace('.md', '')
  if (fileMap[category]) {
    fileMap[category].push(name)
  } else {
    fileMap[category] = [name]
  }
})

interface BlogProps extends RouteComponentProps {
  children: React.ReactChild
}

export default function Blog(props: BlogProps) {
  return <>
    {
      props.children
    }</>
}
