import React, { useState, useRef, useEffect, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { useWhiteBoardHandlers } from '../../../handlers/whiteBoardHandlers';
import { CellDimensions, defaultText, Text } from '../../../types/whiteBoard';
import { EditableText } from '../EditableText';
import { ColorSelectorForConts } from '../ColorSelectorForConts';

interface DraggableTableProps { id: string; rows: number; columns: number; tableData: Text[][]; isEditing: boolean; toggleEditing: (id: string) => void; backgroundColor: string; rowGap: number; columnGap: number; zIndex: number; focusedIndex: any; setFocusedIndex: any; cellDimensionsStore: any; }

export const DraggableTable: React.FC<DraggableTableProps> = observer(({ id, rows, columns, tableData, isEditing, toggleEditing, backgroundColor, rowGap, columnGap, zIndex, focusedIndex, setFocusedIndex, cellDimensionsStore }) => {
    const { useHandleContainerEditorBar, handleTableMouseMove, useDeleteItem, useUpdateTableSpecs, useHandleTopTextBar, useHandleCellChange, useHandleTextEditorChange, useZIndexHandler, useUpdateGap, useUpdateTableCellDimensions, useUpdateRowOrColumn } = useWhiteBoardHandlers();
    const handleTopTextBar = useHandleTopTextBar();
    const handleContainerEditor = useHandleContainerEditorBar();
    const handleDeleteItem = useDeleteItem();
    const updateTableSpecs = useUpdateTableSpecs();
    const updateTableCellDimensions = useUpdateTableCellDimensions()
    const handleZindex = useZIndexHandler();
    const updateRowOrColumn = useUpdateRowOrColumn(tableData, id, rows, columns, updateTableSpecs, defaultText);
    const updateGap = useUpdateGap(tableData, id, rows, columns, rowGap, columnGap, updateTableSpecs);
    const handleCellChange = useHandleCellChange(tableData, id, updateTableSpecs);
    const handleTextEditorChange = useHandleTextEditorChange(tableData, id, focusedIndex, updateTableSpecs);
    const tableRef = useRef<HTMLTableElement>(null);
    const [isResizing, setIsResizing] = useState<{ rowIndex: number; colIndex: number } | null>(null);
    const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);



    useEffect(() => {
        try {
            const dimensions: CellDimensions = { ...cellDimensionsStore };
            for (let rowIndex = 0; rowIndex < tableData.length; rowIndex++) {
                if (!dimensions[`row-${rowIndex}`]) {
                    dimensions[`row-${rowIndex}`] = { height: `80px` }; // Default height for rows
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
    }, [isResizing, startPos]);

    const increaseZIndex = () => {
        const newZIndex = zIndex + 1
        handleZindex(id, newZIndex)
    };

    const reduceZIndex = () => {
        const newZIndex = zIndex - 1
        handleZindex(id, newZIndex)
    };


    const handleBackgroundColorChange = (color: string) => {
        updateTableSpecs(tableData, id, undefined, undefined, undefined, undefined, undefined, color, cellDimensionsStore);
    };

    const handleCellFocus = (rowIndex: number, colIndex: number) => {
        setFocusedIndex({ row: rowIndex, col: colIndex });
    };

    const handleCellBlur = () => {
        setFocusedIndex(null);
    };

    useEffect(() => {
        handleTopTextBar(isEditing, focusedIndex !== null ? tableData[focusedIndex.row][focusedIndex.col] : tableData[0][0], handleTextEditorChange)
        handleContainerEditor(isEditing, { done: () => toggleEditing(id), colIncrease: () => updateRowOrColumn('column', 'add'), colDecrease: () => updateRowOrColumn('column', 'remove'), rowIncrease: () => updateRowOrColumn('row', 'add'), rowDecrease: () => updateRowOrColumn('row', 'remove'), gapIncrease: () => updateGap('column', 'increase'), gapDecrease: () => updateGap('column', 'decrease'), rowGapIncrease: () => updateGap('row', 'increase'), rowGapDecrease: () => updateGap('row', 'decrease'), increaseZIndex, reduceZIndex, deleteItem: () => handleDeleteItem(id), handleBackgroundColorChange, backgroundColor, id });
    }, [isEditing, focusedIndex, tableData, rowGap, columnGap])

    return (
        <div style={{ ...styles.draggableChildCont, backgroundColor: backgroundColor, padding: isEditing ? "0px" : "1px" }}>
            <table ref={tableRef} style={{ ...styles.resizableTable, borderSpacing: `${columnGap}px ${rowGap}px`, borderColor: backgroundColor }}>
                <tbody style={{ ...styles.draggableTableBody }}>
                    {tableData.map((row, rowIndex) => (
                        <tr key={rowIndex} style={{ height: cellDimensionsStore[`row-${rowIndex}`]?.height }}>
                            {row.map((cell, colIndex) => (
                                <td key={colIndex} style={{
                                    ...styles.tableCell,
                                    minWidth: '50px',
                                    width: cellDimensionsStore[`col-${colIndex}`]?.width || 'auto',
                                    height: cellDimensionsStore[`row-${rowIndex}`]?.height,
                                    position: 'relative',
                                    border: '1px solid #ccc',
                                    backgroundColor: cell.backgroundColor

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
                                    {isEditing && rowIndex < tableData.length - 1 && (
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
        height: 'fit-content',
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
        width: '100%'
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
