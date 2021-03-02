import React from 'react'
import PropTypes from 'prop-types'

const UnorderedList = ({ attributes, children }) => (
  <ul {...attributes}>{children}</ul>
)

UnorderedList.propTypes = {
  attributes: PropTypes.object.isRequired,
  children: PropTypes.object.isRequired
}

export default UnorderedList
