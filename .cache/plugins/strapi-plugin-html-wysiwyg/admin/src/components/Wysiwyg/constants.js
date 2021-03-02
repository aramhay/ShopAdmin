export const HEADER_OPTIONS = [
  { id: 'components.Wysiwyg.selectOptions.title', value: '' },
  { id: 'components.Wysiwyg.selectOptions.H1', value: 'h1' },
  { id: 'components.Wysiwyg.selectOptions.H2', value: 'h2' },
  { id: 'components.Wysiwyg.selectOptions.H3', value: 'h3' },
  { id: 'components.Wysiwyg.selectOptions.H4', value: 'h4' },
  { id: 'components.Wysiwyg.selectOptions.H5', value: 'h5' },
  { id: 'components.Wysiwyg.selectOptions.H6', value: 'h6' }
]

export const TYPES = {
  PARAGRAPH: 'PARAGRAPH',
  HEADING: 'HEADING',
  BOLD: 'BOLD',
  ITALIC: 'ITALIC',
  UNDERLINE: 'UNDERLINE',
  STRIKETHROUGH: 'STRIKETHROUGH',
  IMAGE: 'IMAGE',
  LINK: 'LINK',
  IFRAME: 'IFRAME',
  BLOCKQUOTE: 'BLOCKQUOTE',
  ORDERED_LIST: 'ORDERED_LIST',
  UNORDERED_LIST: 'UNORDERED_LIST',
  LIST_ITEM: 'LIST_ITEM'
}

export const CONTROLS = [
  [
    {
      label: 'B',
      style: TYPES.BOLD,
      className: 'bold',
      hideLabel: true,
      handler: 'toggleLeafType',
      checker: 'isLeafType'
    },
    {
      label: 'I',
      style: TYPES.ITALIC,
      className: 'italic',
      hideLabel: true,
      handler: 'toggleLeafType',
      checker: 'isLeafType'
    },
    {
      label: 'U',
      style: TYPES.UNDERLINE,
      className: 'underline',
      hideLabel: true,
      handler: 'toggleLeafType',
      checker: 'isLeafType'
    },
    {
      label: 'S',
      style: TYPES.STRIKETHROUGH,
      className: 'striked',
      hideLabel: true,
      handler: 'toggleLeafType',
      checker: 'isLeafType'
    }
  ],
  [
    {
      label: 'Img',
      style: TYPES.IMAGE,
      className: 'img',
      hideLabel: true,
      handler: 'toggleMediaLibrary'
    },
    {
      label: 'Link',
      style: TYPES.LINK,
      className: 'link',
      hideLabel: true,
      handler: 'toggleLinkInput',
      checker: 'isElementType'
    },
    {
      label: 'Iframe',
      style: TYPES.IFRAME,
      className: 'iframe',
      hideLabel: true,
      handler: 'toggleIframeInput'
    },
    {
      label: 'Quote',
      style: TYPES.BLOCKQUOTE,
      className: 'quote',
      hideLabel: true,
      handler: 'toggleElementType',
      checker: 'isElementType'
    }
  ],
  [
    {
      label: 'UL',
      style: TYPES.UNORDERED_LIST,
      className: 'ul',
      hideLabel: true,
      handler: 'toggleList',
      checker: 'isElementType'
    },
    {
      label: 'OL',
      style: TYPES.ORDERED_LIST,
      className: 'ol',
      hideLabel: true,
      handler: 'toggleList',
      checker: 'isElementType'
    }
  ]
]
