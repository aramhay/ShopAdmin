import React from 'react'
import PropTypes from 'prop-types'
import Paragraph from './Paragraph'

function Heading({ attributes, children, element }) {
  switch (element.tag) {
    case 'h1':
      return <h1 {...attributes}>{children}</h1>
    case 'h2':
      return <h2 {...attributes}>{children}</h2>
    case 'h3':
      return <h3 {...attributes}>{children}</h3>
    case 'h4':
      return <h4 {...attributes}>{children}</h4>
    case 'h5':
      return <h5 {...attributes}>{children}</h5>
    case 'h6':
      return <h6 {...attributes}>{children}</h6>
    default:
      return <Paragraph attributes={attributes}>{children}</Paragraph>
  }
}

Heading.propTypes = {
  attributes: PropTypes.object.isRequired,
  children: PropTypes.object.isRequired,
  element: PropTypes.object.isRequired
}

export default Heading
