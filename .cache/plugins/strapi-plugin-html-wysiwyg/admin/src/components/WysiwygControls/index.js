/**
 *
 * WysiwygInlineControls
 *
 */

import React from 'react'
import PropTypes from 'prop-types'
import Button from './Button'
import Wrapper from './Wrapper'

const WysiwygInlineControls = ({ buttons, disabled, handlers, checkers }) => {
  const defaultChecker = () => false

  return (
    <Wrapper>
      {buttons.map(type => (
        <Button
          key={type.label}
          active={(checkers[type.checker] || defaultChecker)(type.style)}
          className={type.className}
          disabled={disabled}
          handler={type.handler}
          handlers={handlers}
          hideLabel={type.hideLabel || false}
          label={type.label}
          style={type.style}
        />
      ))}
    </Wrapper>
  )
}

WysiwygInlineControls.defaultProps = {
  buttons: [],
  disabled: false
}

WysiwygInlineControls.propTypes = {
  buttons: PropTypes.array,
  disabled: PropTypes.bool,
  handlers: PropTypes.object.isRequired,
  checkers: PropTypes.object.isRequired
}

export default WysiwygInlineControls
