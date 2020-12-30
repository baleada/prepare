export default function toIconComponentIndex ({ icons }) {
  const imports = icons.reduce((imports, { componentName }) => `${imports}import ${componentName} from './components/${componentName}.vue'\n`, ''),
        exports = `export { ${icons.map(({ componentName }) => componentName).join(', ')} }`

  return `\
${imports}\n\
\n\
${exports}\n\
`
}
