import React, { useState, useRef, useEffect } from 'react'
import PropTypes from 'prop-types'
import styled from 'styled-components'
import { Play as PlayIcon, Remove as RemoveIcon } from '@buffetjs/icons'
import Button from './StyledButton'
// import CrossIcon from '../../icons/Cross'

const Wrapper = styled.div`
  position: absolute;
  top: 49px;
  display: ${({ active }) => (active ? 'flex' : 'none')};
  padding: 8px 12px;
  background-color: #f3f4f4;
  z-index: 100;

  input {
    height: 32px;
    width: 175px;
    background-color: #fff;
    padding: 4px 8px;
    border: 1px solid rgba(16, 22, 34, 0.1);
  }
  button {
    margin-left: 4px;
  }
  button:first-of-type {
    margin-left: 8px;
  }
`

function LinkInput({ model, isOpen, onChange }) {
  const [urlValue, setUrlValue] = useState('')
  const urlRef = useRef(null)

  useEffect(() => {
    if (isOpen) {
      setUrlValue(model.url)
      setTimeout(() => urlRef.current.focus(), 0)
    }
  }, [isOpen])

  const onConfirm = e => {
    e.preventDefault()
    onChange({ url: urlValue })
    setUrlValue('')
  }

  const onRemove = e => {
    e.preventDefault()
    onChange({ url: null })
    setUrlValue('')
  }

  const onLinkInputKeyDown = e => {
    if (e.which === 13) {
      onConfirm(e)
    }
  }

  return (
    <Wrapper active={isOpen}>
      <input
        onChange={e => setUrlValue(e.target.value)}
        ref={urlRef}
        name="url"
        type="text"
        placeholder="URL"
        value={urlValue}
        onKeyDown={onLinkInputKeyDown}
      />
      <Button type="button" onMouseDown={onRemove}>
        <RemoveIcon fill="#333740" />
      </Button>
      <Button type="button" onMouseDown={onConfirm}>
        <PlayIcon fill="#333740" />
      </Button>
    </Wrapper>
  )
}

LinkInput.propTypes = {
  model: PropTypes.object.isRequired,
  isOpen: PropTypes.bool.isRequired,
  onChange: PropTypes.func.isRequired
}

export default LinkInput
