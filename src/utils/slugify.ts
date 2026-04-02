import slugify from 'slugify'

export { slugify }

/**
 * Recursively extract plain text from an MDC/hast AST node.
 * Skips component nodes (e.g. :i{}) that carry no readable text.
 */
export function getTextContent(node: any): string {
  if (!node)
    return ''
  if (node.type === 'text')
    return node.value || ''
  if (node.children)
    return (node.children as any[]).map(getTextContent).join('')
  return ''
}
