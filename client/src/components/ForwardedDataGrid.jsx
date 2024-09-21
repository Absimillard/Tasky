import React, { useState, useEffect, forwardRef } from 'react';
import { DataGrid } from '@mui/x-data-grid';

const ForwardedDataGrid = forwardRef((props, ref) => {
  const [selectedRows, setSelectedRows] = useState([]);

  const handleRowClick = (event, row) => {
    event.stopPropagation();
    setSelectedRows((prevSelectedRows) => {
      const selectedIndex = prevSelectedRows.indexOf(row);
      if (selectedIndex === -1) {
        return [...prevSelectedRows, row];
      }
      return prevSelectedRows.filter((r) => r !== row);
    });
    onRowClick(row);
  };

  return (
    <div
      onContextMenu={(event) => {
        event.preventDefault();
      }}
    >
      <DataGrid
        {...props}
        ref={ref}
        onRowClick={handleRowClick}
        onSelectionModelChange={(newSelectionModel) => {
          setSelectedRows(newSelectionModel);
        }}
      />
    </div>
  );
});

export default ForwardedDataGrid;