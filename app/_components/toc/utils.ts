import { Node } from 'basehub/react-rich-text'

export const flattenRichTextNodes = (nodes: Node[]) => {
  const flattened: Node[] = []

  nodes.forEach((node: Node) => {
    if (node.content) {
      const { content, ...rest } = node
      flattened.push(rest as Node)
      flattened.push(...flattenRichTextNodes(content as Node[]))
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
