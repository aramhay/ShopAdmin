import React from 'react'
import PropTypes from 'prop-types'
import { useSelected, useFocused } from 'slate-react'

const Iframe = ({ attributes, children, element }) => {
  const selected = useSelected()
  const focused = useFocused()
  return (
    <div
      className={`iframe-container ${focused ? 'focused' : ''} ${
        selected ? 'selected' : ''
      }`}
      contentEditable={false}
    >
      <iframe {...attributes} src={element.url} frameBorder="0" />
      {children}
    </div>
  )
}

Iframe.propTypes = {
  attributes: PropTypes.object.isRequired,
  children: PropTypes.object.isRequired,
  element: PropTypes.object.isRequired
}

export default Iframe
