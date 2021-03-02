import React from 'react'
import PropTypes from 'prop-types'

const Leaf = ({ attributes, leaf, children }) => {
  const style = {
    fontWeight: leaf.BOLD ? 'bold' : 'normal',
    fontStyle: leaf.ITALIC ? 'italic' : 'normal',
    textDecoration: 'none'
  }
  if (leaf.UNDERLINE) {
    style.textDecoration = 'underline'
  }
  if (leaf.STRIKETHROUGH) {
    style.textDecoration = 'line-through'
  }

  return (
    <span {...attributes} style={style}>
      {children}
    </span>
  )
}

Leaf.propTypes = {
  attributes: PropTypes.object.isRequired,
  children: PropTypes.object.isRequired,
  leaf: PropTypes.object.isRequired
}

export default Leaf
