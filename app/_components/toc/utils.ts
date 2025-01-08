import type { RichTextNode, RichTextTocNode } from 'basehub/api-transaction'

export const flattenRichTextNodes = (
  nodes: (RichTextNode | RichTextTocNode)[]
) => {
  const flattened: (RichTextNode | RichTextTocNode)[] = []

  nodes.forEach((node) => {
    if ('content' in node) {
      const { content, ...rest } = node
      flattened.push(rest as RichTextNode)
      flattened.push(
        ...flattenRichTextNodes(content as (RichTextNode | RichTextTocNode)[])
      )
    } else {
      flattened.push(node)
    }
  })

  return flattened
}

export const getOffsetTop = (element: HTMLElement | null): number => {
  if (!element) return 0

  return element
    ? element.offsetTop +
        getOffsetTop((element?.offsetParent as HTMLElement) ?? null)
    : 0
}
