import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getActiveCardsData } from "../../app/actions/activeCardSlice";
import Loader from "../../common/loader/loader";
import { USBTable } from "@usb-shield/react-table";
import {
  USBIconEdit,
  USBIconDownload,
  USBIconShow2,
} from "@usb-shield/react-icons";
import { USBCard } from "@usb-shield/react-card";
import dayjs from "dayjs";
import SearchFilter from "./searchFilters";
import DropdownFilter from "./DropdownFilter";
import { SEARCH_VALUES, COLUMNS } from "./constants";
import "./activeCards.scss";

const ActiveCards = (props) => {
  const dispatch = useDispatch();
  const activeCards = useSelector((state) => state.activeCards);
  const [searchValue, setSearchValue] = useState(SEARCH_VALUES);
  const [selectedDropdown, setSelectedDropdown] = useState('Me');
  const [tableData, setTableData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [paginationIndex, setPaginationIndex] = useState(false);
  const [columns, setColumns] = useState(COLUMNS);

  useEffect(() => {
    dispatch(getActiveCardsData());
  }, [dispatch]);

  useEffect(() => {
    if (activeCards.data) {
      setTableData(activeCards.data);
      setFilteredData(activeCards.data);
    }
  }, [activeCards]);

   /**
   * Generic function to filter items based on a search value.
   * @param {object} item - The item to check.
   * @param {string} value - The search value.
   * @param {object} columnVisibility - The visibility state of columns.
   * @returns {boolean} - Whether the item matches the search criteria.
   */
   const matchesSearch = (item, value, columnVisibility) => {
    if (!value) return true;
    return Object.keys(columnVisibility).some((key) => {
      if (!columnVisibility[key]) return false;
      const itemValue = item[key];
      if (typeof itemValue === 'string' || itemValue instanceof String) {
        return itemValue.toLowerCase().includes(value.toLowerCase());
      }
      return false;
    });
  };

  /**
   * Handles the account search by applying all filters based on visible columns.
   * @param {object} e - The event object from the form submission.
   */
  const handleAccountSearch = (e) => {
    e.preventDefault();
    let result = tableData;
    // Apply filters based on visible columns
    result = result.filter((item) => matchesSearch(item, searchValue, columnVisibility));
    // Apply dropdown filter
    setFilteredData(result);
    setPaginationIndex(true);
  };

  // Handle visible columns
  const handleVisibleColumns = (columns) => {
    return columns.filter((col) => col.isVisible);
  };

  // Column visibility state
  const [columnVisibility, setColumnVisibility] = useState(
    Object.fromEntries(columns.map((col) => [col.accessorKey, col.isVisible]))
  );

  // Handle column visibility change
  const handleColumnVisibilityChange = (columnId, isVisible) => {
    setColumnVisibility((prevState) => ({
      ...prevState,
      [columnId]: isVisible,
    }));
    setColumns((prevColumns) =>
      prevColumns.map((col) =>
        col.accessorKey === columnId ? { ...col, isVisible } : col
      )
    );
  };

  /**
   * Basic sorting function for dates.
   * @param {object} a - The first item to compare.
   * @param {object} b - The second item to compare.
   * @param {string} columnId - The column being sorted.
   * @param {boolean} desc - Whether the sort is descending.
   * @returns {number} - Comparison result for sorting.
   */
  const basicDateSorting = (a, b, columnId, desc) => {
    const aDate = dayjs(a[columnId]);
    const bDate = dayjs(b[columnId]);

    if (!aDate.isValid() || !bDate.isValid()) return 0;

    if (aDate.isBefore(bDate)) {
      return desc ? 1 : -1;
    }
    if (aDate.isAfter(bDate)) {
      return desc ? -1 : 1;
    }
    return 0;
  };

  /**
   * Handles the dropdown change to filter data based on selection.
   * @param {object} selectedItem - The selected dropdown item.
   */
  const handleDropdownChange = (selectedItem) => {
    setSelectedDropdown(selectedItem.value);
    handleAccountSearch({ preventDefault: () => {} }); // Reapply search with new dropdown filter
  };

  // Define dropdown items
  const dropdownItems = [
    { id: 1, value: "All" },
    { id: 2, value: "Me" },
  ];

  return (
    <div className="activeCardsContainer">
      <br />
      <br />
      <SearchFilter
        setSearchValue={setSearchValue}
        searchValue={searchValue}
        handleSearch={handleAccountSearch}
      />
      <DropdownFilter
        handleDropdownChange={handleDropdownChange}
        dropdownItems={dropdownItems}
      />
      <p className="para-head">VIEWING OF {filteredData.length} ACTIVE CARDS</p>
      <USBCard.Body className="tableContainer">
        {activeCards.isLoading ? (
          <Loader addClasses="page-loader" dataTestId="usb-loading-spinner" />
        ) : (
          <USBTable
            showHideColumns={true}
            batchActionsBar
            options={{
              columns: handleVisibleColumns(columns),
              data: filteredData,
              getCoreRowModel: getCoreRowModel(),
              getSortedRowModel: getSortedRowModel(),
              getPaginationRowModel: getPaginationRowModel(),
              getFilteredRowModel: getFilteredRowModel(),
              onColumnVisibilityChange: handleColumnVisibilityChange,
              onPaginationChange: setPaginationIndex,
              onRowSelectionChange: setRowSelection,
              onSortingChange: setSorting,
              manualPagination: false,
              enableMultiRowSelection: true,
            }}
            state={{
              sorting,
              columnVisibility,
              pagination: {
                pageIndex,
                pageSize,
              },
              rowSelection,
            }}
            editableCells
            pageCount={Math.ceil(tableData.length / pageSize)}
            sortingFns={{
              dateCustomSorting: basicDateSorting,
            }}
            content={{
              paginationDropdownItems: [
                { label: "5 rows", value: 5 },
                { label: "10 rows", value: 10 },
                { label: "20 rows", value: 20 },
              ],
              showHideText: {
                modalBodyCurrentSort: " is currently being sorted.",
                modalBodyLegend: "Select the columns to show.",
                modalBodyLegendColumns:
                  " are essential columns and cannot be hidden.",
                modalBodyTitle: "Show/Hide columns",
                modalButtonLabel: tableHeaderButton("show"),
                modalFooterApply: "Apply",
                modalFooterCancel: "Cancel",
              },
              batchActions: {
                selectAllCheckboxAriaLabel: "Select",
                selectAllCheckboxLabel: "Select all",
                selectRowCheckboxAriaLabel: "Select item",
              },
            }}
            emptyTableContent="We couldn't find any matching transactions. Search again with different criteria."
            tablePaginationFocus={false}
            isZebraStriped
            borders="none"
            rowSize="spacious"
            hasPagination
            responsiveView="stackable"
            toolbarActions={{
              primary: [
                {
                  clickEvent: function noRefCheck() {},
                  id: "primary-button-test-id",
                  size: "small",
                  text: tableHeaderButton("download"),
                  type: "secondary",
                },
                {
                  clickEvent: function noRefCheck() {},
                  id: "secondary-button-test-id",
                  size: "small",
                  text: tableHeaderButton("edit"),
                  type: "secondary",
                },
              ],
            }}
          />
        )}
      </USBCard.Body>
    </div>
  );
};

export default ActiveCards;
