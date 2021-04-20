import MarkdownIt from 'markdown-it'
// @ts-ignore
import proseContainer from '@baleada/markdown-it-prose-container'
// @ts-ignore
import spaLinks from '@baleada/markdown-it-spa-links'
// @ts-ignore
import textContent from '@baleada/markdown-it-text-content'
import linkAttributes from 'markdown-it-link-attributes'
import refractor from 'refractor'
import rehype from 'rehype'

export class Markdownit {
  constructor (private config: MarkdownIt.Options & { plugins?: ([MarkdownIt.PluginWithOptions, any])[] } = { plugins: [] }) {}

  toConfig () { // pretty much used for testing only
    return this.config
  }

  configure = () => {
    const { plugins = [], ...options } = this.config,
          md = new MarkdownIt(options) 

    plugins.forEach(([plugin, options]) => {
      md.use(plugin, options)
    })

    return md
  }

  html () {
    this.config.html = true
    return this
  }

  linkify () {
    this.config.linkify = true
    return this
  }

  highlight (name: 'refractorRehype' | 'refractorRehypeWithEscapedVueMustache') {
    this.config.highlight = highlightsByName[name]
    return this
  }

  plugin (plugin: MarkdownIt.PluginWithOptions, options?: any) {
    this.config.plugins.push([plugin, options])
    return this
  }

  proseContainer (options?: any) {
    return this.plugin(proseContainer, options)
  }

  spaLinks (options?: any) {
    return this.plugin(spaLinks, options)
  }

  textContent (options?: any) {
    return this.plugin(textContent, options)
  }

  linkAttributes (options?: linkAttributes.Config) {
    return this.plugin(linkAttributes, options)
  }
}

const highlightsByName: Record<'refractorRehype' | 'refractorRehypeWithEscapedVueMustache', (str: string, lang: string, attrs: string) => string> = {
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
        .replace(/({{)/g, '<span>{</span><span>{</span>')
        .replace(/(}})/g, '<span>}</span><span>}</span>')
    } catch (error) {
      return ''
    }
  }
}
