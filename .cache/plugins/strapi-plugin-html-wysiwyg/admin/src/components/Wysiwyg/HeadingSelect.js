import React from 'react'
import PropTypes from 'prop-types'
import { InputSelect as Select } from 'strapi-helper-plugin'
import { HEADER_OPTIONS } from './constants'
import SelectWrapper from './SelectWrapper'

const CustomSelect = ({ disabled, value, onChange }) => {
  return (
    <SelectWrapper>
      <Select
        disabled={disabled}
        name="headerSelect"
        onChange={e => onChange(e.target.value)}
        value={value}
        selectOptions={HEADER_OPTIONS}
      />
    </SelectWrapper>
  )
}

CustomSelect.defaultProps = {
  disabled: false,
  value: ''
}

CustomSelect.propTypes = {
  disabled: PropTypes.bool,
  value: PropTypes.string,
  onChange: PropTypes.func.isRequired
}

export default CustomSelect
