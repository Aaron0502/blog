import React, { useState } from 'react'
import { RouteComponentProps, useParams } from '@reach/router'
import translateMdToHTML from './util'
import 'highlight.js/styles/github.css';
import './index.scss'

interface Params {
  first: string,
  second: string,
  third?: string
}

function RenderMd(props: RouteComponentProps) {
  const [blog, changeBlog] = useState('')
  const { first, second, third }: Params = useParams()

  const path = third ? `${first}/${second}/${third}` : `${first}/${second}`

  import(`../md/${path}.md`).then(file => {
    changeBlog(file.default)
  })

  return <div className="myblog-mdrender" dangerouslySetInnerHTML={{ __html: translateMdToHTML.render(blog) }}>
  </div>
}

export default RenderMd