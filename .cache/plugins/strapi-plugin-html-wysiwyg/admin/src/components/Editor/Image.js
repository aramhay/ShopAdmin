import React from 'react'
import PropTypes from 'prop-types'
import { useSelected, useFocused } from 'slate-react'

const Image = ({ attributes, children, element }) => {
  const selected = useSelected()
  const focused = useFocused()
  return (
    <div
      className={`image-container ${focused ? 'focused' : ''} ${
        selected ? 'selected' : ''
      }`}
      contentEditable={false}
      {...attributes}
    >
      <img src={element.url} alt={element.alt} />
      {children}
    </div>
  )
}

Image.propTypes = {
  attributes: PropTypes.object.isRequired,
  children: PropTypes.object.isRequired,
  element: PropTypes.object.isRequired
}

export default Image
