import React from 'react'
import PropTypes from 'prop-types'

const Paragraph = ({ attributes, children }) => (
  <p {...attributes}>{children}</p>
)

Paragraph.propTypes = {
  attributes: PropTypes.object.isRequired,
  children: PropTypes.object.isRequired
}

export default Paragraph
