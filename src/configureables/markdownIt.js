import MarkdownIt from 'markdown-it'
import proseContainer from '@baleada/markdown-it-prose-container'
import spaLinks from '@baleada/markdown-it-spa-links'
import textContent from '@baleada/markdown-it-text-content'
import linkAttributes from 'markdown-it-link-attributes'
import refractor from 'refractor'
import rehype from 'rehype'

export default function configureable (config = {}) {
  const object = {}  
  
  object.configure = () => {
    const { plugins = [], ...options } = config,
          md = new MarkdownIt(options) 

    plugins.forEach(rawPlugin => {
      const [fn, ...params] = ensurePlugin(rawPlugin)
      md.use(fn, ...params)
    })

    return md
  }

  object.html = () => configureable({
    ...config,
    html: true,
  })

  object.linkify = () => configureable({
    ...config,
    linkify: true,
  })

  object.highlight = name => configureable({
    ...config,
    highlight: highlightsByName[name]
  })

  object.plugin = rawPlugin => configureable({
    ...config,
    plugins: [
      ...(config.plugins || []),
      rawPlugin,
    ]
  })

  object.proseContainer = (...args) => object.plugin([proseContainer, ...args])
  object.spaLinks = (...args) => object.plugin([spaLinks, ...args])
  object.textContent = (...args) => object.plugin([textContent, ...args])
  object.linkAttributes = (...args) => object.plugin([linkAttributes, ...args])

  return object
}

function ensurePlugin (rawPlugin) {
  return typeof rawPlugin === 'function'
    ? [rawPlugin]
    : rawPlugin
}

const highlightsByName = {
  refractorRehype (code, lang) {
    try {
      const children = refractor.highlight(code, lang)
      
      return rehype()
        .stringify({ type: 'root', children })
        .toString()
    } catch (error) {
      return ''
    }
  },
  refractorRehypeWithEscapedVueMustache (code, lang) {
    try {
      const children = refractor.highlight(code, lang)
      
      return rehype()
        .stringify({ type: 'root', children })
        .toString()
        .replace(/({{|}})/g, '<span>$1</span>')
    } catch (error) {
      return ''
    }
  }
}
