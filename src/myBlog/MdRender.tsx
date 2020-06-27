import React, { useState } from 'react'
import MarkdownIt from 'markdown-it'
import { RouteComponentProps, useParams } from '@reach/router'
import 'highlight.js/styles/github.css';

const hljs = require("highlight.js/lib/core");
const javascript = require('highlight.js/lib/languages/javascript');
hljs.registerLanguage('javascript', javascript);

const md: MarkdownIt = new MarkdownIt({
  highlight: function (str: string, lang: string) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre><code class="hljs">${hljs.highlight(lang, str, true).value}</code></pre>`
      } catch (err) {
        return `<pre><code class="hljs">${JSON.stringify(err)}</code></pre>`
      }
    }
    return '<pre ><code class="hljs">' + md.utils.escapeHtml(str) + '</code></pre>'
  }
})

interface Params {
  category: string,
  name: string
}

function MdRender(props: RouteComponentProps) {
  const [blog, changeBlog] = useState('')
  const params: Params = useParams()

  import(`./md/${params.category}/${params.name}.md`).then(file => {
    changeBlog(file.default)
  })
  
  return <div dangerouslySetInnerHTML={{ __html: md.render(blog) }}>
  </div>
}

export default MdRender