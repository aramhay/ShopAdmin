import React from 'react'
import PropTypes from 'prop-types'
import Bold from '../../icons/Bold'
import Code from '../../icons/Code'
import Media from '../../icons/Media'
import Italic from '../../icons/Italic'
import Link from '../../icons/Link'
import Ol from '../../icons/Ol'
import Quote from '../../icons/Quote'
import Striked from '../../icons/Striked'
import Ul from '../../icons/Ul'
import Underline from '../../icons/Underline'
import Iframe from '../../icons/Iframe'
import StyledButton from './StyledButton'

const icons = {
  bold: Bold,
  italic: Italic,
  underline: Underline,
  ul: Ul,
  ol: Ol,
  link: Link,
  quote: Quote,
  code: Code,
  striked: Striked,
  img: Media,
  iframe: Iframe
}

const Button = ({
  active,
  disabled,
  className: type,
  handler,
  handlers,
  hideLabel,
  label,
  style
}) => {
  const handleClick = e => {
    e.preventDefault()

    handlers[handler](style)
  }

  const Icon = icons[type]

  return (
    <StyledButton
      active={active}
      disabled={disabled}
      onClick={handleClick}
      onMouseDown={e => e.preventDefault()}
      type={type}
    >
      {icons[type] && <Icon />}
      {!hideLabel && label}
    </StyledButton>
  )
}

Button.defaultProps = {
  active: false,
  className: '',
  disabled: false,
  hideLabel: false,
  label: '',
  style: ''
}

Button.propTypes = {
  active: PropTypes.bool,
  className: PropTypes.string,
  disabled: PropTypes.bool,
  handler: PropTypes.string.isRequired,
  handlers: PropTypes.object.isRequired,
  hideLabel: PropTypes.bool,
  label: PropTypes.string,
  style: PropTypes.string
}

export default Button
