import MarkdownIt from 'markdown-it'

const hljs = require("highlight.js/lib/core");
const javascript = require('highlight.js/lib/languages/javascript');
const typescript = require('highlight.js/lib/languages/typescript')
const html = require('highlight.js/lib/languages/xml')
hljs.registerLanguage('javascript', javascript);
hljs.registerLanguage('xml', html);
hljs.registerLanguage('typescript', typescript);

const translateMdToHTML: MarkdownIt = new MarkdownIt({
  html: true,
  highlight: function (str: string, lang: string) {
    if (lang && hljs.getLanguage(lang)) {
      try {
        return `<pre><code class="hljs">${hljs.highlight(lang, str, true).value}</code></pre>`
      } catch (err) {
        return `<pre><code class="hljs">${JSON.stringify(err)}</code></pre>`
      }
    }
    return '<pre ><code class="hljs">' + translateMdToHTML.utils.escapeHtml(str) + '</code></pre>'
  }
})

translateMdToHTML.enable('image')

export default translateMdToHTML