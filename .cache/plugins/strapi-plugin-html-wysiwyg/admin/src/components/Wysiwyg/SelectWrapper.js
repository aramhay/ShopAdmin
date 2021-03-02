import styled, { css } from 'styled-components'

/* eslint-disable */

const SelectWrapper = styled.div`
  min-width: ${({ isFullScreen }) => (isFullScreen ? '177px' : '150px')};
  > select {
    margin-top: 0.9rem;
    margin-left: 16px;
    line-height: 3.2rem;
    font-size: 1.3rem;
    width: auto;
    min-width: 134px;
    height: 3.1rem;
    font-weight: 600;
    outline: none;

    &:focus,
    &:active {
      border: 1px solid #e3e9f3;
    }
    ${({ isFullScreen }) => {
      if (isFullScreen) {
        return css`
          min-width: 110px !important;
        `
      } else {
        return css`
          margin-right: 5px;
        `
      }
    }}
    box-shadow: 0 0 0 rgba(0, 0, 0, 0) !important;
  }
`

export default SelectWrapper
