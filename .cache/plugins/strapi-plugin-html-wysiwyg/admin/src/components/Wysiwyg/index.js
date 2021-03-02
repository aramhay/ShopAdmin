import React, { useState, useEffect, useMemo } from 'react'
import PropTypes from 'prop-types'
import { createEditor, Editor, Transforms, Text, Range } from 'slate'
import { Slate, Editable, withReact, ReactEditor } from 'slate-react'
import { withHistory } from 'slate-history'
import { isEmpty, isEqual } from 'lodash'
import cn from 'classnames'
import Leaf from '../Editor/Leaf'
import Paragraph from '../Editor/Paragraph'
import Heading from '../Editor/Heading'
import Link from '../Editor/Link'
import Iframe from '../Editor/Iframe'
import Image from '../Editor/Image'
import Blockquote from '../Editor/Blockquote'
import OrderedList from '../Editor/OrderedList'
import UnorderedList from '../Editor/UnorderedList'
import ListItem from '../Editor/ListItem'
import { serialize, deserialize } from './serializer'
import EditorWrapper from './EditorWrapper'
import HeadingSelect from './HeadingSelect'
import MediaLib from './MediaLib'
import LinkInput from '../WysiwygControls/LinkInput'
import IframeInput from '../WysiwygControls/IframeInput'
import Controls from '../WysiwygControls'
import { CONTROLS, TYPES } from './constants'

function Wysiwyg({
  autoFocus,
  disabled,
  deactivateErrorHighlight,
  error,
  className,
  value,
  name,
  placeholder,
  onChange,
  onBlur,
  resetProps,
  tabIndex
}) {
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])
  const [currentValue, setCurrentValue] = useState(deserialize(value || '<p/>'))
  const [isMediaLibraryOpened, setIsMediaLibraryOpened] = useState(false)
  const [isIframeInputOpen, setIsIframeInputOpen] = useState(false)
  const [isLinkInputOpen, setIsLinkInputOpen] = useState(false)
  const [controlData, setControlData] = useState({})
  const [currentSelection, setCurrentSelection] = useState(null)

  // If `value` changing
  useEffect(() => setCurrentValue(deserialize(value || '<p/>')), [
    value,
    setCurrentValue
  ])

  // Rewrite editor methods
  const { isInline: isInlineDefault } = editor
  editor.isInline = element => {
    return element.type === TYPES.LINK ? true : isInlineDefault(element)
  }

  const { isVoid: isVoidDefault } = editor
  editor.isVoid = element => {
    if ([TYPES.IFRAME, TYPES.IMAGE].includes(element.type)) {
      return true
    }
    return isVoidDefault(element)
  }

  const restoreSelection = () => {
    if (currentSelection) {
      Transforms.select(editor, currentSelection)
      setCurrentSelection(null)
    }
  }

  /**
   * Set focus to editor
   */
  const focusEditor = () => {
    ReactEditor.focus(editor)
  }

  /**
   * Editor's `renderElement` callback
   * @param {Object} obj
   */
  const renderElement = obj => {
    switch (obj.element.type) {
      case TYPES.HEADING:
        return <Heading {...obj} />
      case TYPES.LINK:
        return <Link {...obj} />
      case TYPES.IFRAME:
        return <Iframe {...obj} />
      case TYPES.IMAGE:
        return <Image {...obj} />
      case TYPES.BLOCKQUOTE:
        return <Blockquote {...obj} />
      case TYPES.ORDERED_LIST:
        return <OrderedList {...obj} />
      case TYPES.UNORDERED_LIST:
        return <UnorderedList {...obj} />
      case TYPES.LIST_ITEM:
        return <ListItem {...obj} />
      default:
        return <Paragraph {...obj} />
    }
  }

  /**
   * Editor's `renderLeaf` callback
   * @param {Object} obj
   */
  const renderLeaf = obj => <Leaf {...obj} />

  /**
   * Update the parent reducer
   * @param  {Array} val
   */
  const sendData = val => {
    onChange({
      target: {
        value: serialize(val),
        name,
        type: 'textarea'
      }
    })
  }

  /**
   * Editor `onChange` callback
   * @param {Array} e
   */
  const onEditorChange = val => {
    if (!disabled && !isEqual(val, currentValue)) {
      sendData(val)
      setCurrentValue(val)
    }
  }

  /**
   * Editor `onBlur` callback
   * @param {Event} e
   */
  const onEditorBlur = e => onBlur(e)

  /**
   * Check if current leaf element is of given type
   * @param {String} type
   */
  const isLeafType = type => {
    const [match] = Editor.nodes(editor, {
      match: n => !!n[type],
      universal: true
    })
    return !!match
  }

  /**
   * Toggle given leaf type
   * @param {String} type
   */
  const toggleLeafType = type => {
    const isActive = isLeafType(type)

    // Trying to make editor insert new inline leafs if no selection instead of formatting the whole element.
    // But Slate doesn't allow empty text inline nodes.
    // if (Range.isCollapsed(editor.selection)) {
    //   Transforms.insertNodes(editor, {
    //     text: '',
    //     [type]: !isActive
    //   })
    // } else {
    //   Transforms.setNodes(
    //     editor,
    //     { [type]: !isActive },
    //     { match: n => Text.isText(n), split: true }
    //   )
    // }

    Transforms.setNodes(
      editor,
      { [type]: !isActive },
      { match: n => Text.isText(n), split: true }
    )
  }

  /**
   * Check if current block element is of given type
   * @param {String} type
   */
  const isElementType = type => {
    const [match] = Editor.nodes(editor, {
      match: n => n.type === type
    })
    return !!match
  }

  /**
   * Toggle given block element type
   * @param {String} type
   */
  const toggleElementType = (type, params = {}) => {
    const isActive = isElementType(type)
    Transforms.select(editor, currentSelection)
    Transforms.setNodes(
      editor,
      isActive ? { type: null } : { type, ...params },
      { match: n => Editor.isBlock(editor, n) }
    )
  }

  /**
   * Changes given element as heading
   * @param {String} tag
   */
  const setHeading = tag => {
    Transforms.setNodes(
      editor,
      tag ? { type: TYPES.HEADING, tag } : { type: null },
      { match: n => Editor.isBlock(editor, n) }
    )
  }

  /**
   * Returns tag of given heading element e.g. `h1`
   */
  const getHeadingTag = () => {
    const [node] = Editor.nodes(editor, {
      match: n => n.type === TYPES.HEADING
    })
    return node ? node[0].tag : ''
  }

  /**
   * Toggle link input
   */
  const toggleLinkInput = () => {
    if (isLinkInputOpen) {
      setIsLinkInputOpen(false)
    } else {
      setCurrentSelection(editor.selection)
      const [node] = Editor.nodes(editor, {
        match: n => n.type === TYPES.LINK
      })
      const url = node ? node[0].url : ''
      setControlData({ url })
      setIsLinkInputOpen(true)
    }
  }

  /**
   * Toggle toggles given element as link
   * @param {{url: String}} url
   */
  const toggleLink = ({ url }) => {
    restoreSelection()
    if (isElementType(TYPES.LINK)) {
      Transforms.unwrapNodes(editor, { match: n => n.type === TYPES.LINK })
    }
    if (url) {
      const { selection } = editor
      const isCollapsed = selection && Range.isCollapsed(selection)
      const link = {
        type: TYPES.LINK,
        url,
        children: isCollapsed ? [{ text: url }] : []
      }
      if (isCollapsed) {
        Transforms.insertNodes(editor, link)
      } else {
        Transforms.wrapNodes(editor, link, { split: true })
        Transforms.collapse(editor, { edge: 'end' })
      }
    }
    focusEditor()
  }

  /**
   * Toggle iframe input
   */
  const toggleIframeInput = () => {
    if (isIframeInputOpen) {
      setIsIframeInputOpen(false)
    } else {
      setCurrentSelection(editor.selection)
      const [node] = Editor.nodes(editor, {
        match: n => n.type === TYPES.HEADING
      })
      const url = node ? node[0].url : ''
      setControlData({ url })
      setIsIframeInputOpen(true)
    }
  }

  /**
   * Toggle toggles given element as iframe
   * @param {{url: String}} url
   */
  const addIframe = ({ url }) => {
    restoreSelection()
    if (!url) {
      return
    }
    Transforms.insertNodes(editor, [
      {
        type: TYPES.IFRAME,
        url,
        children: [{ text: '' }]
      }
    ])
    Transforms.insertNodes(editor, [
      {
        type: TYPES.PARAGRAPH,
        children: [{ text: '' }]
      }
    ])
    focusEditor()
  }

  /**
   * Toggle media library
   */
  const toggleMediaLibrary = () => {
    if (isMediaLibraryOpened) {
      setCurrentSelection(null)
      setIsMediaLibraryOpened(false)
    } else {
      setCurrentSelection(editor.selection)
      setIsMediaLibraryOpened(true)
    }
    // setIsMediaLibraryOpened(() => !isMediaLibraryOpened)
  }

  /**
   * Insert image
   * @param {{url: String, alt: String}} url
   */
  const addImage = ({ url, alt }) => {
    restoreSelection()
    if (!url) {
      return
    }
    Transforms.insertNodes(editor, [
      {
        type: TYPES.IMAGE,
        url,
        alt,
        children: [{ text: '' }]
      }
    ])
    Transforms.insertNodes(editor, [
      {
        type: TYPES.PARAGRAPH,
        children: [{ text: '' }]
      }
    ])
    focusEditor()
  }

  /**
   * Toggle element as list of given type
   * @param {String} type
   */
  const toggleList = type => {
    const isActive = isElementType(type)
    if (isActive) {
      Transforms.unwrapNodes(editor, {
        match: n => n.type === type,
        split: true
      })

      Transforms.setNodes(editor, {
        type: TYPES.PARAGRAPH
      })
    } else {
      Transforms.setNodes(editor, {
        type: TYPES.LIST_ITEM
      })
      Transforms.wrapNodes(editor, { type, children: [] })
    }
  }

  useEffect(() => {
    if (autoFocus) {
      focusEditor()
    }
  }, [])

  useEffect(() => {
    if (resetProps) {
      setCurrentValue(value)
    }
  }, [resetProps, value, setCurrentValue])

  return (
    <EditorWrapper disabled={disabled}>
      <div
        className={cn(
          'editorWrapper',
          !deactivateErrorHighlight && error && 'editorError',
          !isEmpty(className) && className
        )}
      >
        <div className="controlsContainer">
          <HeadingSelect
            disabled={disabled}
            value={getHeadingTag()}
            onChange={setHeading}
          />
          {CONTROLS.map((val, key) => (
            <Controls
              key={key} // eslint-disable-line react/no-array-index-key
              buttons={val}
              disabled={disabled}
              handlers={{
                toggleLeafType,
                toggleLinkInput,
                toggleIframeInput,
                toggleMediaLibrary,
                toggleElementType,
                toggleList
              }}
              checkers={{
                isLeafType,
                isElementType
              }}
            />
          ))}
          <LinkInput
            isOpen={isLinkInputOpen}
            onChange={params => {
              toggleLink(params)
              toggleLinkInput()
            }}
            model={controlData}
          />
          <IframeInput
            isOpen={isIframeInputOpen}
            onChange={params => {
              addIframe(params)
              toggleIframeInput()
            }}
            model={controlData}
          />
        </div>

        <div className="editor">
          <Slate editor={editor} value={currentValue} onChange={onEditorChange}>
            <Editable
              renderElement={renderElement}
              renderLeaf={renderLeaf}
              placeholder={placeholder}
              readOnly={disabled}
              onBlur={onEditorBlur}
              tabIndex={tabIndex}
            />
          </Slate>
        </div>
      </div>

      <MediaLib
        onToggle={toggleMediaLibrary}
        isOpen={isMediaLibraryOpened}
        onChange={addImage}
      />
    </EditorWrapper>
  )
}

Wysiwyg.defaultProps = {
  autoFocus: false,
  className: '',
  deactivateErrorHighlight: false,
  disabled: false,
  error: false,
  onBlur: () => {},
  onChange: () => {},
  placeholder: '',
  resetProps: false,
  tabIndex: '0',
  value: ''
}

Wysiwyg.propTypes = {
  autoFocus: PropTypes.bool,
  className: PropTypes.string,
  deactivateErrorHighlight: PropTypes.bool,
  disabled: PropTypes.bool,
  error: PropTypes.bool,
  name: PropTypes.string.isRequired,
  onBlur: PropTypes.func,
  onChange: PropTypes.func,
  placeholder: PropTypes.string,
  resetProps: PropTypes.bool,
  tabIndex: PropTypes.string,
  value: PropTypes.string
}

export default Wysiwyg
