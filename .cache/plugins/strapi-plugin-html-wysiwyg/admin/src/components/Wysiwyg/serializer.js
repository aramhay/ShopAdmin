import escapeHtml from 'escape-html'
import { Text } from 'slate'
import { jsx } from 'slate-hyperscript'
import { TYPES } from './constants'

function serialize(node) {
  if (Text.isText(node)) {
    // Leafs
    const styles = []
    if (node.BOLD) {
      styles.push('fontWeight: bold;')
    }
    if (node.ITALIC) {
      styles.push('fontStyle: italic;')
    }
    if (node.UNDERLINE) {
      styles.push('textDecoration: underline;')
    }
    if (node.STRIKETHROUGH) {
      styles.push('textDecoration: line-through;')
    }
    return styles.length
      ? `<span style="${styles.join(' ')}">${escapeHtml(node.text)}</span>`
      : escapeHtml(node.text)
  }

  const children = (node.children || node).map(n => serialize(n)).join('')

  switch (node.type) {
    case TYPES.PARAGRAPH:
      return `<p>${children}</p>`
    case TYPES.HEADING:
      switch (node.tag) {
        case 'h1':
          return `<h1>${children}</h1>`
        case 'h2':
          return `<h2>${children}</h2>`
        case 'h3':
          return `<h3>${children}</h3>`
        case 'h4':
          return `<h4>${children}</h4>`
        case 'h5':
          return `<h5>${children}</h5>`
        case 'h6':
          return `<h6>${children}</h6>`
        default:
          return `<p>${children}</p>`
      }
    case TYPES.LINK:
      return `<a href="${escapeHtml(node.url)}">${children}</a>`
    case TYPES.IFRAME:
      return `<div class="iframe-container"><iframe src="${escapeHtml(
        node.url
      )}" frameBorder="0"></iframe></div>`
    case TYPES.IMAGE:
      return `<div class="image-container"><img src="${escapeHtml(
        node.url
      )}" alt="${escapeHtml(node.alt)}" /></div>`
    case TYPES.BLOCKQUOTE:
      return `<blockquote>${children}</blockquote>`
    case TYPES.ORDERED_LIST:
      return `<ol>${children}</ol>`
    case TYPES.UNORDERED_LIST:
      return `<ul>${children}</ul>`
    case TYPES.LIST_ITEM:
      return `<li>${children}</li>`
    default:
      return children
  }
}

function deserializeElement(el) {
  if (el.nodeType === 3) {
    return el.textContent
  }
  if (el.nodeType !== 1) {
    return null
  }
  const children = Array.from(el.childNodes).map(deserializeElement)
  if (children.length === 0) {
    children.push({ text: '' })
  }

  switch (el.nodeName) {
    case 'BODY':
      return jsx('fragment', {}, children)
    case 'BR':
      return '\n'
    case 'P':
      return jsx('element', { type: TYPES.PARAGRAPH }, children)
    case 'SPAN': {
      const elStyle = el.getAttribute('style')
      if (!elStyle) {
        return el.textContent
      }
      const leafSettings = {}
      if (elStyle.includes('fontWeight: bold;')) {
        leafSettings.BOLD = true
      }
      if (elStyle.includes('fontStyle: italic;')) {
        leafSettings.ITALIC = true
      }
      if (elStyle.includes('textDecoration: underline;')) {
        leafSettings.UNDERLINE = true
      }
      if (elStyle.includes('textDecoration: line-through;')) {
        leafSettings.STRIKETHROUGH = true
      }
      return jsx('text', leafSettings, children)
    }
    case 'A':
      return jsx(
        'element',
        { type: TYPES.LINK, url: el.getAttribute('href') },
        children
      )
    case 'DIV':
      if (
        el.classList.contains('iframe-container') &&
        el.children &&
        el.children[0].nodeName === 'IFRAME'
      ) {
        const iframeEl = el.children[0]
        return jsx(
          'element',
          {
            type: TYPES.IFRAME,
            url: iframeEl.getAttribute('src')
          },
          children
        )
      }
      if (
        el.classList.contains('image-container') &&
        el.children &&
        el.children[0].nodeName === 'IMG'
      ) {
        const imageEl = el.children[0]
        return jsx(
          'element',
          {
            type: TYPES.IMAGE,
            url: imageEl.getAttribute('src'),
            alt: imageEl.getAttribute('alt')
          },
          children
        )
      }
      return el.textContent
    case 'BLOCKQUOTE':
      return jsx('element', { type: TYPES.BLOCKQUOTE }, children)
    case 'H1':
      return jsx('element', { type: TYPES.HEADING, tag: 'h1' }, children)
    case 'H2':
      return jsx('element', { type: TYPES.HEADING, tag: 'h21' }, children)
    case 'H3':
      return jsx('element', { type: TYPES.HEADING, tag: 'h3' }, children)
    case 'H4':
      return jsx('element', { type: TYPES.HEADING, tag: 'h4' }, children)
    case 'H5':
      return jsx('element', { type: TYPES.HEADING, tag: 'h5' }, children)
    case 'H6':
      return jsx('element', { type: TYPES.HEADING, tag: 'h6' }, children)
    case 'OL':
      return jsx('element', { type: TYPES.ORDERED_LIST }, children)
    case 'UL':
      return jsx('element', { type: TYPES.UNORDERED_LIST }, children)
    case 'LI':
      return jsx('element', { type: TYPES.LIST_ITEM }, children)
    default:
      return el.textContent
  }
}

function deserialize(htmlString) {
  const document = new DOMParser().parseFromString(htmlString, 'text/html')
  return deserializeElement(document.body)
}

export { serialize, deserialize }
