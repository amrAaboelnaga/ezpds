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
    toggleEditing: (pageId: number, id: string) => void;
    cellDimensionsStore: CellDimensions;
    pageId: number
    draggableRef: React.RefObject<HTMLDivElement>

}

export const DraggableTable: React.FC<DraggableTableProps> = observer(({ draggableRef, pageId, id, standardSpecs, tableData, focusedIndex, setFocusedIndex, toggleEditing, cellDimensionsStore }) => {
    const { padding, rows, rowGap, columnGap, columns, backgroundColor, isEditing, border, borderColor, borderRadius, zIndex } = standardSpecs
    const { useDirectSizeUpdate, useHandleContainerEditorBar, handleTableMouseMove, useDeleteItem, useUpdateTableSpecs, useHandleTopTextBar, useHandleCellChange, useHandleTableTextEditorChange, useZIndexHandler, useUpdateGap, useUpdateTableCellDimensions, useUpdateRowOrColumn } = useWhiteBoardHandlers();
    const directSizeUpdate = useDirectSizeUpdate()
    const handleTopTextBar = useHandleTopTextBar();
    const handleContainerEditor = useHandleContainerEditorBar();
    const handleDeleteItem = useDeleteItem();
    const updateTableSpecs = useUpdateTableSpecs();
    const updateTableCellDimensions = useUpdateTableCellDimensions()
    const updateRowOrColumn = useUpdateRowOrColumn(pageId, tableData, id, rows, columns, updateTableSpecs, defaultText);
    const updateGap = useUpdateGap(pageId, tableData, id, rows, columns, rowGap, columnGap, updateTableSpecs);
    const handleCellChange = useHandleCellChange(pageId, tableData, id, updateTableSpecs);
    const handleTextEditorChange = useHandleTableTextEditorChange(pageId, tableData, id, focusedIndex, updateTableSpecs);
    const tableRef = useRef<HTMLTableElement>(null);
    const [isResizing, setIsResizing] = useState<{ rowIndex: number; colIndex: number } | null>(null);
    const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);


    useEffect(() => {
        try {
            if (!tableRef.current) return;
            const dimensions: CellDimensions = { ...cellDimensionsStore };
            const rows = tableRef.current.rows;

            // Update each row's height based on actual rendered size
            for (let rowIndex = 0; rowIndex < tableData.length; rowIndex++) {
                const rowHeight = rows[rowIndex]?.getBoundingClientRect().height || dimensions[`row-${rowIndex}`].height;
                dimensions[`row-${rowIndex}`] = { height: `${rowHeight}px` };
            }

            if (tableData.length > 0) {
                const cols = rows[0]?.cells || [];

                // Update each column's width based on actual rendered size
                for (let colIndex = 0; colIndex < cols.length; colIndex++) {
                    const colWidth = cols[colIndex]?.getBoundingClientRect().width || dimensions[`col-${colIndex}`].width;
                    dimensions[`col-${colIndex}`] = { width: `${colWidth}px` };
                }
            }

            updateTableCellDimensions(pageId, id, dimensions);
        } catch (e) {
            console.error("Error updating table cell dimensions:", e);
        }
    }, [standardSpecs.rows, standardSpecs.columns, standardSpecs.rowGap, standardSpecs.columnGap, isResizing, isEditing]);

    useEffect(() => {
        try {
            const dimensions: CellDimensions = { ...cellDimensionsStore };
            for (let rowIndex = 0; rowIndex < tableData.length; rowIndex++) {
                if (!dimensions[`row-${rowIndex}`]) {
                    dimensions[`row-${rowIndex}`] = { height: `40px` }; // Default height for rows
                }
            }
            if (tableData.length > 0) {
                for (let colIndex = 0; colIndex < tableData[0].length; colIndex++) {
                    if (!dimensions[`col-${colIndex}`]) {
                        dimensions[`col-${colIndex}`] = { width: `125px` }; // Default width for columns
                    }
                }
            }
            updateTableCellDimensions(pageId, id, dimensions);
        } catch (e) {
            console.error("Error updating table cell dimensions:", e);
        }
    }, []);

    useEffect(() => {
        if (!tableRef.current) return;
        const tableHeight = tableRef.current.getBoundingClientRect().height;
        const intWidth = parseFloat(standardSpecs.width)

        directSizeUpdate(pageId, id, intWidth, (tableHeight));

    }, [isEditing, startPos]);


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

    const handleMouseDown = (e: any, rowIndex: number, colIndex: number) => {
        setIsResizing({ rowIndex, colIndex });
        setStartPos({ x: e.clientX, y: e.clientY });
    };

    const onMouseMove = (e: MouseEvent) => {
        handleTableMouseMove(pageId, e, isResizing, startPos, cellDimensionsStore, tableData, updateTableCellDimensions, id, setStartPos, tableRef, draggableRef);

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
        handleContainerEditor(isEditing, { pageId: pageId, done: () => toggleEditing(pageId, id), colIncrease: () => updateRowOrColumn('column', 'add'), colDecrease: () => updateRowOrColumn('column', 'remove'), rowIncrease: () => updateRowOrColumn('row', 'add'), rowDecrease: () => updateRowOrColumn('row', 'remove'), gapIncrease: () => updateGap('column', 'increase'), gapDecrease: () => updateGap('column', 'decrease'), rowGapIncrease: () => updateGap('row', 'increase'), rowGapDecrease: () => updateGap('row', 'decrease'), deleteItem: () => handleDeleteItem(pageId, id), id: id });
    }, [isEditing, standardSpecs, focusedIndex])

    return (
        <div style={{
            ...styles.draggableChildCont,
        }}>
            <table ref={tableRef} style={{
                ...styles.resizableTable, borderSpacing: `${columnGap}px ${rowGap}px`,
                borderRadius: borderRadius,
                padding: isEditing ? `calc(0px + ${padding}px)` : `calc(1px + ${padding}px)`,
                backgroundColor: backgroundColor,
                border: `${border}px solid ${borderColor}`,
            }}>
                <tbody style={{
                    ...styles.draggableTableBody,
                    borderRadius: borderRadius,
                }}>
                    {tableData.map((row, rowIndex) => (
                        <tr key={rowIndex} style={{ height: cellDimensionsStore[`row-${rowIndex}`]?.height || '40px' }}>
                            {row.map((cell, colIndex) => (
                                <td
                                    onClick={() => console.log(`${cellDimensionsStore[`col-${colIndex}`]?.width}` + cellDimensionsStore[`row-${rowIndex}`]?.height)}

                                    key={colIndex}
                                    style={{
                                        ...getBorderRadiusStyle(rowIndex, colIndex), // Border radius styles
                                        ...styles.tableCell, // Other predefined styles
                                        width: cellDimensionsStore[`col-${colIndex}`]?.width || '50px',
                                        height: cellDimensionsStore[`row-${rowIndex}`]?.height || '25px',
                                        position: 'relative',
                                        border: `${border}px solid ${borderColor}`,
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
        height: 'fit-content',
        width: '100%',
        display: 'flex',
        alignSelf: 'start'
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
        color: 'red'
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
