import React, { useState } from 'react';
import { JsonSpecs, useDeleteItem } from '../../../handlers/whiteBoardHandlers';
import { rootStore } from "../../../stores/rootStore";

const { whiteBoardStore } = rootStore;

interface DraggableTableProps {
  id: string;
  rows: number;
  columns: number;
  tableData: string[][];
  isEditing: boolean;
  toggleEditing: (id: string) => void;
}

export function DraggableTable({
  id,
  rows,
  columns,
  tableData,
  isEditing,
  toggleEditing,
}: DraggableTableProps) {
  const [editedTableData, setEditedTableData] = useState<string[][]>(tableData);
  const handleDeleteItem = useDeleteItem();

  // Function to add a column
  const addColumn = () => {
    const updatedTableData = editedTableData.map(row => [...row, 'Add Data']); // Add empty cell to each row
    setEditedTableData(updatedTableData);
    updateTableSpecs(undefined, columns + 1); // Update columns count
  };

  // Function to remove the last column
  const removeColumn = () => {
    if (editedTableData.length === 0 || columns === 1) return; // Ensure at least one column remains
    const updatedTableData = editedTableData.map(row => row.slice(0, -1)); // Remove last cell from each row
    setEditedTableData(updatedTableData);
    updateTableSpecs(undefined, columns - 1); // Update columns count
  };

  // Function to add a row
  const addRow = () => {
    const newRow = new Array(columns).fill('Add Data'); // Create a new array with empty strings for each column
    const updatedTableData = [...editedTableData, newRow]; // Add the new row to the table data
    setEditedTableData(updatedTableData);
    updateTableSpecs(rows + 1); // Update rows count
  };

  // Function to remove the last row
  const removeRow = () => {
    if (editedTableData.length === 0 || rows === 1) return; // Ensure at least one row remains
    const updatedTableData = editedTableData.slice(0, -1); // Remove the last row
    setEditedTableData(updatedTableData);
    updateTableSpecs(rows - 1); // Update rows count
  };

  // Function to update JSON specs
  const updateTableSpecs = (updatedRows?: number, updatedColumns?: number) => {
    const updatedSpecs = {
      ...whiteBoardStore.jsonSpecs,
      [id]: {
        ...whiteBoardStore.jsonSpecs[id],
        rows: updatedRows !== undefined ? updatedRows : whiteBoardStore.jsonSpecs[id].rows,
        columns: updatedColumns !== undefined ? updatedColumns : whiteBoardStore.jsonSpecs[id].columns,
        tableData: editedTableData,
      },
    };
    whiteBoardStore.setJsonSpecs(updatedSpecs);
  };

  // Function to handle cell value change
  const handleCellChange = (rowIndex: number, colIndex: number, newValue: string) => {
    const updatedTableData = [...editedTableData];
    updatedTableData[rowIndex][colIndex] = newValue;
    setEditedTableData(updatedTableData);
  };

  // Function to handle onBlur event (save changes)
  const handleBlur = () => {
    updateTableSpecs(); // Update table data
  };

  return (
    <div style={styles.draggableChildCont}>
      {isEditing && (
        <div style={styles.editTableCount}>
          <button onClick={() => toggleEditing(id)}>Done</button>
          <button onClick={addColumn}>Col +</button>
          <button onClick={removeColumn}>Col -</button>
          <button onClick={addRow}>Row +</button>
          <button onClick={removeRow}>Row -</button>
          <button onClick={() => handleDeleteItem(id)}>Delete</button>
        </div>
      )}
      {isEditing ? (
        <table style={styles.draggableTable}>
          <tbody>
            {editedTableData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <td key={colIndex}>
                    <input
                      type="text"
                      value={cell}
                      onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                      onBlur={handleBlur}
                      style={styles.tableInput}
                    />
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <table style={styles.draggableTable}>
          <tbody>
            {tableData.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, colIndex) => (
                  <td key={colIndex} style={{ width: `${100 / row.length}%`, ...styles.tableCell }}>
                    <p style={styles.tableCellText}>{cell}</p>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
}

const styles = {
  draggableChildCont: {
    position: 'relative',
    height: '100%',
    width: '100%',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  } as React.CSSProperties,
  editTableCount: {
    position: 'absolute',
    top: '5px',
    right: '-65px',
    display: 'flex',
    flexDirection: 'column',
    gap: '5px',
  } as React.CSSProperties,
  draggableTable: {
    width: '100%',
    borderCollapse: 'collapse',
    height:'100%'
  } as React.CSSProperties,
  tableInput: {
    width: '100%',
    height: '100%',
    border: 'none',
    outline: 'none',
    padding: '5px',
    fontSize: '14px',
    textAlign:'center'
  } as React.CSSProperties,
  tableCell: {
    border: '1px solid #ccc',
    textAlign: 'center',
  } as React.CSSProperties,
  tableCellText: {
    width: 'fit-content',
    margin: 'auto',
    fontSize: '14px',
  } as React.CSSProperties,
};
