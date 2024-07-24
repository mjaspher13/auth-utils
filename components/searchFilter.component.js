import React, { useState, useCallback } from 'react';
import PropTypes from 'prop-types';
import { debounce } from 'lodash';
import { USBGrid, USBColumn, USBSearchInput, USBButton } from '@usb-shield/react-ui-components';

/**
 * SearchFilter Component
 * Manages search input and validation for filtering data.
 * 
 * @param {function} setSearchValue - Function to update the search values state.
 * @param {object} searchValue - The current state of search values.
 * @param {function} handleSearch - Function to handle the search form submission.
 */
const SearchFilter = ({ setSearchValue, searchValue, handleSearch }) => {
  const [updateByError, setUpdateByError] = useState(false); // State to track input validation errors
  const [updateByErrorText, setUpdateByErrorText] = useState(''); // State to hold error text

  /**
   * Handles the update of search input values.
   * Validates the input based on length and alphanumeric criteria.
   * 
   * @param {object} e - The event object from the input change.
   */
  const handleSearchInputUpdate = (e) => {
    const { name, value } = e.target;
    const alphanumericRegex = /^[\w ]+$/gm; // Regex to match alphanumeric characters and spaces
    const isValid = value.length >= 2 && alphanumericRegex.test(value);
    const isClear = value === '';

    // Update error states based on validity of the input
    setUpdateByError(!isValid && !isClear);
    setUpdateByErrorText(
      !isValid && !isClear ? 'Use alphanumeric characters only' : 'Use at least two digits'
    );

    // Update search value state
    setSearchValue((prevState) => ({
      ...prevState,
      [name]: isValid ? value : '',
    }));
  };

  // Debounced version of the input update handler to prevent excessive updates
  const debouncedSearchInputUpdate = useCallback(
    debounce((e) => {
      handleSearchInputUpdate(e);
    }, 300),
    []
  );

  return (
    <form className="filter-form" onSubmit={handleSearch}>
      <USBGrid gridGap="half" justifyContent="stretch" className="grid-filter">
        <USBColumn layoutOpts={{ spans: { small: 4, medium: 4, large: 5, xlarge: 5 } }}>
          <USBSearchInput
            id="test-idd"
            name="search"
            addClasses="test-class"
            type="search"
            isClearable
            isError={updateByError}
            errorText={updateByErrorText}
            helperText="Search by partial or full name."
            placeholder="Search"
            handleChange={(e) => debouncedSearchInputUpdate(e)}
          />
        </USBColumn>
        <USBColumn layoutOpts={{ spans: { small: 4, medium: 4, large: 5, xlarge: 5 } }} addClasses="filter-button">
          <USBButton type="submit" variant="primary" size="medium" ariaLabel="Apply filters" handleClick={handleSearch}>
            Search
          </USBButton>
        </USBColumn>
      </USBGrid>
    </form>
  );
};

SearchFilter.propTypes = {
  setSearchValue: PropTypes.func.isRequired,
  handleSearch: PropTypes.func.isRequired,
  searchValue: PropTypes.shape({
    accountName: PropTypes.string,
    accountNumber: PropTypes.string,
    lastUpdatedBy: PropTypes.string,
    status: PropTypes.arrayOf(PropTypes.shape({})),
    type: PropTypes.arrayOf(PropTypes.shape({})),
    product: PropTypes.arrayOf(PropTypes.shape({})),
  }).isRequired,
};

export default React.memo(SearchFilter);
