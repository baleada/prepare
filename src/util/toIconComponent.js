export default function toComponent ({ componentName, contents, viewBox }) {
  return `\
<template>\n\
  <svg\n\
    role="img"\n\
    viewBox="${viewBox}"\n\
    xmlns="http://www.w3.org/2000/svg"\n\
    preserveAspectRatio="xMidYMid meet"\n\
  >\n\
    ${contents}\n\
  </svg>\n\
</template>\n\
\n\
<script>\n\
export default {\n\
  name: '${componentName}',\n\
}\n\
</script>\n\
`
}
