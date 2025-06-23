import React, { useState, useEffect } from "react";
import Row from "./Row";
import data from "../data/table.json";

function deepClone(obj) {
  return JSON.parse(JSON.stringify(obj));
}

function updateRowValue(rows, id, newValue, newChildren) {
  return rows.map(row => {
    if (row.id === id) {
      let updatedRow = { ...row, value: newValue };
      if (newChildren) updatedRow.children = newChildren;
      return updatedRow;
    }
    if (row.children) {
      const updatedChildren = updateRowValue(row.children, id, newValue, newChildren);
      // After updating children, recalculate subtotal
      const subtotal = updatedChildren.reduce((sum, c) => sum + c.value, 0);
      return { ...row, children: updatedChildren, value: subtotal };
    }
    return row;
  });
}

function getGrandTotal(rows) {
  return rows.reduce((sum, row) => sum + (row.value || 0), 0);
}

const HierarchicalTable = () => {
  const [tableRows, setTableRows] = useState(() => {
    // Try to load saved data from localStorage
    const savedData = localStorage.getItem('tableData');
    if (savedData) {
      try {
        return JSON.parse(savedData);
      } catch (error) {
        console.error('Error loading saved data:', error);
        return deepClone(data.rows);
      }
    }
    return deepClone(data.rows);
  });

  const [originalRows] = useState(deepClone(data.rows));
  const [error, setError] = useState(null);

  // Save to localStorage whenever tableRows changes
  useEffect(() => {
    try {
      localStorage.setItem('tableData', JSON.stringify(tableRows));
    } catch (error) {
      console.error('Error saving data:', error);
      setError('Failed to save changes. Please try again.');
    }
  }, [tableRows]);

  const handleValueChange = (id, newValue, newChildren) => {
    try {
      const updatedRows = updateRowValue(tableRows, id, newValue, newChildren);
      setTableRows(updatedRows);
      setError(null); // Clear any previous errors
    } catch (error) {
      console.error('Error updating value:', error);
      setError('Failed to update value. Please try again.');
    }
  };

  const handleReset = () => {
    try {
      setTableRows(deepClone(data.rows));
      localStorage.removeItem('tableData');
      setError(null);
    } catch (error) {
      console.error('Error resetting data:', error);
      setError('Failed to reset data. Please try again.');
    }
  };

  return (
    <div className="table-container">
      {error && (
        <div className="error-message" role="alert">
          {error}
        </div>
      )}
      <div className="table-actions">
        <button
          onClick={handleReset}
          className="reset-button"
          title="Reset to original values"
        >
          Reset Table
        </button>
      </div>
      <div className="table-wrapper">
        <table className="hierarchical-table">
          <thead>
            <tr>
              <th>Label</th>
              <th>Value</th>
              <th>Input</th>
              <th>Allocation %</th>
              <th>Allocation Val</th>
              <th>Variance %</th>
            </tr>
          </thead>
          <tbody>
            {tableRows.map((row, idx) => (
              <Row
                key={row.id}
                row={row}
                originalRow={originalRows[idx]}
                onValueChange={handleValueChange}
              />
            ))}
            <tr className="grand-total">
              <td>Grand Total</td>
              <td>{getGrandTotal(tableRows).toFixed(2)}</td>
              <td colSpan={4}></td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default HierarchicalTable;