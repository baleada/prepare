import type { Icon } from './getIcons'

/**
 * Given an array of icon metadata, creates an index file, exporting virtual icon components.
 */
export function toIconComponentIndex ({ icons }: { icons: Icon[] }): string {
  const imports = icons.reduce((imports, { componentName }) => `${imports}import ${componentName} from './components/${componentName}.vue'\n`, ''),
        exports = `export { ${icons.map(({ componentName }) => componentName).join(', ')} }`

  return `\
${imports}

${exports}
`
}


/**
 * Given icon metadata, generates the code for a virtual file exporting an icon component.
 */
export function toIconComponent ({ componentName, contents, viewBox }: Icon): string {
  return `\
<template>
  <svg
    role="img"
    viewBox="${viewBox}"
    xmlns="http://www.w3.org/2000/svg"
    preserveAspectRatio="xMidYMid meet"
  >
    ${contents}
  </svg>
</template>

<script>
export default {
  name: '${componentName}',
}
</script>
`
}


