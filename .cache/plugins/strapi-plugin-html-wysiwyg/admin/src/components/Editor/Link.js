import React from 'react'
import PropTypes from 'prop-types'

const Link = ({ attributes, children, element }) => (
  <a {...attributes} href={element.url}>
    {children}
  </a>
)

Link.propTypes = {
  attributes: PropTypes.object.isRequired,
  children: PropTypes.object.isRequired,
  element: PropTypes.object.isRequired
}

export default Link
