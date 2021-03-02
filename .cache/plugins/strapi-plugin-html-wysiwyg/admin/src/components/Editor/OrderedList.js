import React from 'react'
import PropTypes from 'prop-types'

const OrderedList = ({ attributes, children }) => (
  <ol {...attributes}>{children}</ol>
)

OrderedList.propTypes = {
  attributes: PropTypes.object.isRequired,
  children: PropTypes.object.isRequired
}

export default OrderedList
