import React, { useState, useRef, useEffect, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { useWhiteBoardHandlers } from '../../../handlers/whiteBoardHandlers';
import { CellDimensions, defaultText, DraggableTableInterface, Text } from '../../../types/whiteBoard';
import { EditableText } from '../EditableText';

interface DraggableTableProps {
    id: string;
    standardSpecs: DraggableTableInterface;
    tableData: Text[][];
    focusedIndex: any;
    setFocusedIndex: any;
    toggleEditing: (id: string) => void;
    cellDimensionsStore: CellDimensions;
}

export const DraggableTable: React.FC<DraggableTableProps> = observer(({ id, standardSpecs, tableData, focusedIndex, setFocusedIndex, toggleEditing, cellDimensionsStore }) => {
    const { padding, rows, rowGap, columnGap, columns, backgroundColor, isEditing, border, borderColor, borderRadius, zIndex } = standardSpecs
    const { useHandleContainerEditorBar, handleTableMouseMove, useDeleteItem, useUpdateTableSpecs, useHandleTopTextBar, useHandleCellChange, useHandleTextEditorChange, useZIndexHandler, useUpdateGap, useUpdateTableCellDimensions, useUpdateRowOrColumn } = useWhiteBoardHandlers();
    const handleTopTextBar = useHandleTopTextBar();
    const handleContainerEditor = useHandleContainerEditorBar();
    const handleDeleteItem = useDeleteItem();
    const updateTableSpecs = useUpdateTableSpecs();
    const updateTableCellDimensions = useUpdateTableCellDimensions()
    const updateRowOrColumn = useUpdateRowOrColumn(tableData, id, rows, columns, updateTableSpecs, defaultText);
    const updateGap = useUpdateGap(tableData, id, rows, columns, rowGap, columnGap, updateTableSpecs);
    const handleCellChange = useHandleCellChange(tableData, id, updateTableSpecs);
    const handleTextEditorChange = useHandleTextEditorChange(tableData, id, focusedIndex, updateTableSpecs);
    const tableRef = useRef<HTMLTableElement>(null);
    const [isResizing, setIsResizing] = useState<{ rowIndex: number; colIndex: number } | null>(null);
    const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);


    const getBorderRadiusStyle = (rowIndex: any, colIndex: any) => {
        try {
            let style: any = {};

            if (rowIndex === 0 && colIndex === 0) {
                // Top-left corner
                style.borderTopLeftRadius = borderRadius;
            } else if (rowIndex === 0 && colIndex === columns - 1) {
                // Top-right corner
                style.borderTopRightRadius = borderRadius;
            } else if (rowIndex === rows - 1 && colIndex === 0) {
                // Bottom-left corner
                style.borderBottomLeftRadius = borderRadius;
            } else if (rowIndex === rows - 1 && colIndex === columns - 1) {
                // Bottom-right corner
                style.borderBottomRightRadius = borderRadius;
            }

            return style;
        } catch (e) {

        }

    };

    useEffect(() => {
        try {
            const dimensions: CellDimensions = { ...cellDimensionsStore };
            for (let rowIndex = 0; rowIndex < tableData.length; rowIndex++) {
                if (!dimensions[`row-${rowIndex}`]) {
                    dimensions[`row-${rowIndex}`] = { height: `20px` }; // Default height for rows
                }
            }
            if (tableData.length > 0) {
                for (let colIndex = 0; colIndex < tableData[0].length; colIndex++) {
                    if (!dimensions[`col-${colIndex}`]) {
                        dimensions[`col-${colIndex}`] = { width: `100px` }; // Default width for columns
                    }
                }
            }
            updateTableCellDimensions(id, dimensions);
        } catch (e) {
            console.error("Error updating table cell dimensions:", e);
        }
    }, []);


    const handleMouseDown = (e: any, rowIndex: number, colIndex: number) => {
        setIsResizing({ rowIndex, colIndex });
        setStartPos({ x: e.clientX, y: e.clientY });
    };

    const onMouseMove = (e: MouseEvent) => {
        handleTableMouseMove(e, isResizing, startPos, cellDimensionsStore, tableData, updateTableCellDimensions, id, setStartPos);
    };

    const handleMouseUp = () => {
        setIsResizing(null);
        setStartPos(null);
    };

    useEffect(() => {
        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [isResizing]);


    const handleCellFocus = (rowIndex: number, colIndex: number) => {
        setFocusedIndex({ row: rowIndex, col: colIndex });
    };

    const handleCellBlur = () => {
        setFocusedIndex(null);
    };

    useEffect(() => {
        handleTopTextBar(isEditing, focusedIndex !== null ? tableData[focusedIndex.row][focusedIndex.col] : tableData[0][0], handleTextEditorChange)
        handleContainerEditor(isEditing, { done: () => toggleEditing(id), colIncrease: () => updateRowOrColumn('column', 'add'), colDecrease: () => updateRowOrColumn('column', 'remove'), rowIncrease: () => updateRowOrColumn('row', 'add'), rowDecrease: () => updateRowOrColumn('row', 'remove'), gapIncrease: () => updateGap('column', 'increase'), gapDecrease: () => updateGap('column', 'decrease'), rowGapIncrease: () => updateGap('row', 'increase'), rowGapDecrease: () => updateGap('row', 'decrease'), deleteItem: () => handleDeleteItem(id), id });
    }, [isEditing, standardSpecs, focusedIndex])

    return (
        <div style={{
            ...styles.draggableChildCont, padding: isEditing ? `calc(0px + ${padding}px)` : `calc(1px + ${padding}px)`,
            borderRadius: borderRadius,
            backgroundColor: backgroundColor,
            border: `${border}px solid ${borderColor}`,
        }}>
            <table ref={tableRef} style={{
                ...styles.resizableTable, borderSpacing: `${columnGap}px ${rowGap}px`,
                borderRadius: borderRadius,
            }}>
                <tbody style={{
                    ...styles.draggableTableBody,
                    borderRadius: borderRadius,
                }}>
                    {tableData.map((row, rowIndex) => (
                        <tr key={rowIndex} style={{ height: cellDimensionsStore[`row-${rowIndex}`]?.height }}>
                            {row.map((cell, colIndex) => (
                                <td key={colIndex} style={{
                                    ...getBorderRadiusStyle(rowIndex, colIndex), // Border radius styles
                                    ...styles.tableCell, // Other predefined styles
                                    width: cellDimensionsStore[`col-${colIndex}`]?.width || 'auto',
                                    height: cellDimensionsStore[`row-${rowIndex}`]?.height,
                                    position: 'relative',
                                    border: '1px solid #ccc',
                                    backgroundColor: cell.backgroundColor,
                                }}>
                                    <EditableText
                                        textData={cell}
                                        isEditing={isEditing}
                                        onChange={(newValue) => handleCellChange(rowIndex, colIndex, newValue)}
                                        onFocus={() => handleCellFocus(rowIndex, colIndex)}
                                        onBlur={handleCellBlur}
                                    />
                                    {isEditing && colIndex < row.length - 1 && (
                                        <div
                                            style={{ ...styles.resizerCol, right: -10 - columnGap / 2 }}
                                            onMouseDown={(e) => handleMouseDown(e, rowIndex, colIndex)}
                                        />
                                    )}
                                    {isEditing && rowIndex < tableData.length && (
                                        <div
                                            style={{ ...styles.resizerRow, bottom: -10 - rowGap / 2 }}
                                            onMouseDown={(e) => handleMouseDown(e, rowIndex, colIndex)}
                                        />
                                    )}
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div >
    );
});

const styles = {
    draggableChildCont: {
        position: 'relative',
        height: '100%',
        width: '100%',
        display: 'flex',
        justifyContent: 'left',
    } as React.CSSProperties,
    editTableCount: {
        position: 'absolute',
        top: '5px',
        right: '-65px',
        display: 'flex',
        flexDirection: 'column',
        gap: '5px',
        zIndex: '900',
        overflow: 'visible'
    } as React.CSSProperties,
    draggableTable: {
        width: '100%',
        borderCollapse: 'collapse',
        height: 'auto',
        minHeight: '100%',
        padding: '0px',
        backgroundColor: 'transparent'
    } as React.CSSProperties,
    draggableTableBody: {
        height: '100%',
        width: 'fit-content',
        padding: '0px',
        backgroundColor: 'transparent'
        //display:'block'
    } as React.CSSProperties,
    tableCell: {
        textAlign: 'center',
        position: 'relative',
        width: '100%',
        padding: '0px'
    } as React.CSSProperties,
    colorBoxWrapper: {
        position: 'absolute',
        right: '-220px',
    } as React.CSSProperties,
    resizableTable: {
        borderCollapse: "separate",
        width: '100%',
        height: '100%',
    } as React.CSSProperties,
    resizerCol: {
        position: 'absolute',
        top: 0,
        bottom: 0,
        width: '20px',
        cursor: 'col-resize',
        backgroundColor: 'transparent',
        zIndex: 1000
    } as React.CSSProperties,
    resizerRow: {
        position: 'absolute',
        left: 0,
        right: 0,
        height: '20px',
        cursor: 'row-resize',
        backgroundColor: 'transparent',
        zIndex: '1000'
    } as React.CSSProperties,
};
