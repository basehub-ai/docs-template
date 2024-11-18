import * as cheerio from 'cheerio'
import Turndown from 'turndown'
import { originPlusBasePath } from '../_origin'

export const GET = async () => {
  const res = await fetch(originPlusBasePath + '/llms-full')
  const rawHtml = await res.text()

  const $ = cheerio.load(rawHtml)
  const llmRoot = $('#llms-root')

  /** Explicitly remove all elements with the data-llms-ignore attribute */
  llmRoot.find('[data-llms-ignore="true"]').remove()

  /** Remove all but the first snippet in each group */
  const groups = new Set()
  $('div[data-snippet-group-id]').each((i, el) => {
    groups.add($(el).attr('data-snippet-group-id'))
  })

  // For each group, remove all but the first snippet
  groups.forEach((groupId) => {
    $(`div[data-snippet-group-id="${groupId}"]`).slice(1).remove()
  })

  const html = llmRoot.html()
  if (!html) return new Response('No html found for llms', { status: 404 })

  const turndown = new Turndown({
    headingStyle: 'atx',
    codeBlockStyle: 'fenced',
    preformattedCode: true,
  })

  /** Remove anchor links from headings */
  turndown.addRule('headings', {
    filter: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'],
    replacement: function (content, node) {
      const hLevel = parseInt(node.nodeName.charAt(1))
      // Strip out any anchor links, just get the text content
      const plainText = content.replace(/\[(.*?)\]\(.*?\)/g, '$1')
      return '\n\n' + '#'.repeat(hLevel) + ' ' + plainText + '\n\n'
    },
  })

  /** Transform relative URLs to absolute */
  turndown.addRule('links', {
    filter: 'a',
    replacement: function (content, node) {
      if (!(node instanceof HTMLAnchorElement)) return content

      const href = node.getAttribute('href')
      if (!href) return content

      // Transform relative URLs to absolute
      const absoluteUrl = href.startsWith('/')
        ? `${originPlusBasePath}${href}`
        : href

      return '[' + content + '](' + absoluteUrl + ')'
    },
  })

  const text = turndown.turndown(html)

  return new Response(text, { status: 200 })
}