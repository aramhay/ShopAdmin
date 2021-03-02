import React from 'react'
import PropTypes from 'prop-types'

const ListItem = ({ attributes, children }) => (
  <li {...attributes}>{children}</li>
)

ListItem.propTypes = {
  attributes: PropTypes.object.isRequired,
  children: PropTypes.object.isRequired
}

export default ListItem
