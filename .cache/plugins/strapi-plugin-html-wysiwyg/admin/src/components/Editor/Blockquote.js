import React from 'react'
import PropTypes from 'prop-types'

const Blockquote = ({ attributes, children }) => (
  <blockquote {...attributes}>{children}</blockquote>
)

Blockquote.propTypes = {
  attributes: PropTypes.object.isRequired,
  children: PropTypes.object.isRequired
}

export default Blockquote
