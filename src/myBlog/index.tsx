import React from 'react'
import { RouteComponentProps } from '@reach/router'

// export interface File {
//   name: string,
//   description: string
// }
// interface FileMap {
//   [propName: string]: File[]
// }

// interface Module {
//   default: string
// }
// export const fileMap: FileMap = {}
// const context = require.context('./md', true, /\.md$/, 'lazy')
// context.keys().forEach(key => {
//   const [category, fileName] = key.split('/').slice(1)
//   const name = fileName.replace('.md', '')
//   // if (fileMap[category]) {
//   //   fileMap[category].push(name)
//   // } else {
//   //   fileMap[category] = [name]
//   // }
//   context(key).then((module: Module) => {
//     if (fileMap[category]) {
//       fileMap[category].push({ name, description: module.default })
//     } else {
//       fileMap[category] = [{ name, description: module.default }]
//     }
//   })
// })

interface BlogProps extends RouteComponentProps {
  children: React.ReactChild[]
}

export default function Blog(props: BlogProps) {
  return <>
    {
      props.children
    }</>
}
