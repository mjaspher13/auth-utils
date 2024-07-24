import React from 'react';
import PropTypes from 'prop-types';
import { USBGrid, USBColumn, USBDropdown } from '@usb-shield/react-ui-components';

/**
 * DropdownFilter Component
 * Handles dropdown selection for filtering.
 * 
 * @param {function} handleDropdownChange - Function to handle dropdown selection changes.
 * @param {Array} dropdownItems - Array of dropdown items to be displayed.
 */
const DropdownFilter = ({ handleDropdownChange, dropdownItems }) => {
  return (
    <USBGrid className="filters">
      <USBColumn className="column-filter" layoutOpts={{ spans: { small: 4, medium: 8, large: 15, xlarge: 15 } }}>
        <USBGrid gridGap="half" justifyContent="stretch" className="grid-filter">
          <USBColumn layoutOpts={{ spans: { small: 4, medium: 4, large: 5, xlarge: 5 } }}>
            <USBDropdown
              emphasis="subtle"
              handleChange={handleDropdownChange}
              items={dropdownItems}
              labelText="Filter by"
              listPosition="bottom"
            />
          </USBColumn>
        </USBGrid>
      </USBColumn>
    </USBGrid>
  );
};

DropdownFilter.propTypes = {
  handleDropdownChange: PropTypes.func.isRequired,
  dropdownItems: PropTypes.arrayOf(
    PropTypes.shape({
      id: PropTypes.number.isRequired,
      value: PropTypes.string.isRequired,
    })
  ).isRequired,
};

export default DropdownFilter;
