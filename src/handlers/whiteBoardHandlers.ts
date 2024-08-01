import { rootStore } from "../stores/rootStore";
import { useCallback, useState } from "react";
import { createDraggableImageSpec, createDraggableListSpec, createDraggableTableSpec, createDraggableTextSpec, DraggableImageInterface, DraggableListInterface, DraggableTableInterface, DraggableTextInterface, JsonSpecs, Text } from "../types/whiteBoard";
import { zIndex } from "html2canvas/dist/types/css/property-descriptors/z-index";

export const useWhiteBoardHandlers = () => {
    const { whiteBoardStore } = rootStore;


    const useHandleDrop = () => {
        return (event: React.DragEvent<HTMLDivElement>) => {
            event.preventDefault();
            const itemType = event.dataTransfer.getData('itemType');
            const id = `${itemType}-${Object.keys(whiteBoardStore.jsonSpecs).length}`;
            const rect = event.currentTarget.getBoundingClientRect();
            const x = event.clientX - rect.left - 50;
            const y = event.clientY - rect.top - 25;


            let newSpec;
            switch (itemType) {
                case 'Text':
                    newSpec = { [id]: createDraggableTextSpec(id, x, y) };
                    break;
                case 'Image':
                    newSpec = { [id]: createDraggableImageSpec(id, x, y) };
                    break;
                case 'List':
                    newSpec = { [id]: createDraggableListSpec(id, x, y) };
                    break;
                case 'Table':
                    newSpec = { [id]: createDraggableTableSpec(id, x, y) };
                    break;
                default:
                    newSpec = { [id]: createDraggableTextSpec(id, x, y) };
            }

            whiteBoardStore.setJsonSpecs({
                ...whiteBoardStore.jsonSpecs,
                ...newSpec,
            });
        };
    };

    const useHandleDragOver = () => {
        return (event: React.DragEvent<HTMLDivElement>) => {
            event.preventDefault();
        };
    }

    const useToggleEditing = () => {
        return (id: string) => {
            const updatedSpecs = {
                ...whiteBoardStore.jsonSpecs,
                [id]: {
                    ...whiteBoardStore.jsonSpecs[id],
                    isEditing: !whiteBoardStore.jsonSpecs[id].isEditing,
                },
            };
            whiteBoardStore.setJsonSpecs(updatedSpecs);
        };
    }

    const useEditStandards = (
        id: string,
        standardSpecs: {
            border?: number,
            borderRadius?: number,
            opacity?: number,
            zIndex?: number,
            padding?: number,
        },
        updateStandards: ReturnType<typeof useUpdateStandards>
    ) => {
        const borderStep = 1; // Define the step size for border
        const borderRadiusStep = 1; // Define the step size for border radius
        const opacityStep = 0.1; // Define the step size for opacity
        const zIndexStep = 1; // Define the step size for zIndex
        const paddingStep = 1; // Define the step size for padding

        return (type: 'border' | 'borderRadius' | 'opacity' | 'zIndex' | 'padding', action: 'increase' | 'decrease') => {
            if (type === 'border') {
                const currentBorder = standardSpecs.border || 0;
                const newBorder = action === 'increase' ? currentBorder + borderStep : Math.max(0, currentBorder - borderStep);
                updateStandards(id, undefined, newBorder, undefined, undefined, undefined, undefined);
            } else if (type === 'borderRadius') {
                const currentBorderRadius = standardSpecs.borderRadius || 0;
                const newBorderRadius = action === 'increase' ? currentBorderRadius + borderRadiusStep : Math.max(0, currentBorderRadius - borderRadiusStep);
                updateStandards(id, undefined, undefined, undefined, newBorderRadius, undefined, undefined);
            } else if (type === 'opacity') {
                const currentOpacity = standardSpecs.opacity || 1;
                const newOpacity = action === 'increase' ? Math.min(1, currentOpacity + opacityStep) : Math.max(0, currentOpacity - opacityStep);
                updateStandards(id, newOpacity, undefined, undefined, undefined, undefined, undefined);
            } else if (type === 'zIndex') {
                const currentZIndex = standardSpecs.zIndex || 0;
                const newZIndex = action === 'increase' ? currentZIndex + zIndexStep : Math.max(0, currentZIndex - zIndexStep);
                updateStandards(id, undefined, undefined, undefined, undefined, newZIndex, undefined);
            } else if (type === 'padding') {
                const currentPadding = standardSpecs.padding || 0;
                const newPadding = action === 'increase' ? currentPadding + paddingStep : Math.max(0, currentPadding - paddingStep);
                updateStandards(id, undefined, undefined, undefined, undefined, undefined, undefined, newPadding);
            }
        };
    };

    const useUpdateStandards = () => {
        return (
            id: string,
            opacity?: number,
            border?: number,
            borderColor?: string,
            borderRadius?: number,
            zIndex?: number,
            backgroundColor?: string,
            padding?: number
        ) => {
            const updatedSpecs = {
                ...whiteBoardStore.jsonSpecs,
                [id]: {
                    ...whiteBoardStore.jsonSpecs[id],
                    opacity: opacity !== undefined ? opacity : whiteBoardStore.jsonSpecs[id]?.opacity,
                    border: border !== undefined ? border : whiteBoardStore.jsonSpecs[id]?.border,
                    borderColor: borderColor !== undefined ? borderColor : whiteBoardStore.jsonSpecs[id]?.borderColor,
                    borderRadius: borderRadius !== undefined ? borderRadius : whiteBoardStore.jsonSpecs[id]?.borderRadius,
                    zIndex: zIndex !== undefined ? zIndex : whiteBoardStore.jsonSpecs[id]?.zIndex,
                    backgroundColor: backgroundColor !== undefined ? backgroundColor : whiteBoardStore.jsonSpecs[id]?.backgroundColor,
                    padding: padding !== undefined ? padding : whiteBoardStore.jsonSpecs[id]?.padding,
                },
            };

            whiteBoardStore.setJsonSpecs(updatedSpecs);
        };
    };


    const useDeleteItem = () => {
        return (id: string) => {
            whiteBoardStore.setTextEditor(null, null)
            whiteBoardStore.setContainerEditor(null)
            whiteBoardStore.setTextEditor(null, null)
            const updatedSpecs = { ...whiteBoardStore.jsonSpecs };
            if (id in updatedSpecs) {
                delete updatedSpecs[id];
            }
            whiteBoardStore.setJsonSpecs(updatedSpecs);

        };
    }


    const useHandleTextEdit = () => {
        return (id: string, event?: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>, textIndex?: number, updatedText?: string) => {
            let updatedData;
            switch (whiteBoardStore.jsonSpecs[id].type) {
                case 'Text':
                    if (event) {
                        const { name, value } = event.target;
                        updatedData = { ...(whiteBoardStore.jsonSpecs[id] as DraggableTextInterface).data, [name]: value };
                    } else {
                        updatedData = { ...(whiteBoardStore.jsonSpecs[id] as any).data, content: updatedText };
                    }
                    whiteBoardStore.jsonSpecs[id] = {
                        ...(whiteBoardStore.jsonSpecs[id] as DraggableTextInterface),
                        data: updatedData,
                        zIndex: textIndex !== undefined ? textIndex : whiteBoardStore.jsonSpecs[id].zIndex,

                    };
                    break;
                default:
                    return; // Exit if the type is not handled
            }

            const updatedSpecs = {
                ...whiteBoardStore.jsonSpecs,
                [id]: {
                    ...whiteBoardStore.jsonSpecs[id],
                    data: updatedData
                },
            };

            whiteBoardStore.setJsonSpecs(updatedSpecs);
        };
    };


    const useZIndexHandler = () => {
        return (id: string, textIndex: number) => {

            const updatedSpecs = {
                ...whiteBoardStore.jsonSpecs,
                [id]: {
                    ...whiteBoardStore.jsonSpecs[id],
                    zIndex: textIndex
                },
            };

            whiteBoardStore.setJsonSpecs(updatedSpecs);
        };
    };


    const useHandleKeyDown = (handleBlur: (id: string) => void) => {
        return (event: React.KeyboardEvent<HTMLInputElement>, id: string) => {
            if (event.key === 'Enter') {
                //event.preventDefault();
                //handleBlur(id);
            }
        };
    }

    const useHandleBlur = () => {
        return (id: string) => {
            const updatedSpecs = {
                ...whiteBoardStore.jsonSpecs,
                [id]: {
                    ...whiteBoardStore.jsonSpecs[id],
                    isEditing: false,
                },
            };
            whiteBoardStore.setJsonSpecs(updatedSpecs);
        };
    }

    const useHandleAddImage = (inputRef: React.RefObject<HTMLInputElement>) => {
        return (id: string) => {
            if (inputRef.current) {
                inputRef.current.click();


            }
        };
    }

    const useHandleImageUpload = () => {
        return (event: React.ChangeEvent<HTMLInputElement>, id: string) => {
            const file = event.target.files?.[0];

            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64String = reader.result as string;

                    const updatedSpecs = {
                        ...whiteBoardStore.jsonSpecs,
                        [id]: {
                            ...whiteBoardStore.jsonSpecs[id],
                            src: base64String,
                        },
                    };
                    whiteBoardStore.setJsonSpecs(updatedSpecs);
                };

                reader.readAsDataURL(file);
            }
        };
    }


    const useHandleMouseDownReposition = (
    ) => {
        return (
            event: React.MouseEvent<HTMLDivElement>,
            id: string
        ) => {
            if (whiteBoardStore.jsonSpecs[id].isEditing) return;

            const offsetX = event.clientX - whiteBoardStore.jsonSpecs[id].location.x;
            const offsetY = event.clientY - whiteBoardStore.jsonSpecs[id].location.y;

            const handleMouseMoveReposition = (event: MouseEvent) => {
                const updatedSpecs = {
                    ...whiteBoardStore.jsonSpecs,
                    [id]: {
                        ...whiteBoardStore.jsonSpecs[id],
                        location: {
                            x: event.clientX - offsetX,
                            y: event.clientY - offsetY,
                        },
                    },
                };
                whiteBoardStore.setJsonSpecs(updatedSpecs);
            };

            const handleMouseUpReposition = () => {
                document.removeEventListener('mousemove', handleMouseMoveReposition);
                document.removeEventListener('mouseup', handleMouseUpReposition);
            };

            document.addEventListener('mousemove', handleMouseMoveReposition);
            document.addEventListener('mouseup', handleMouseUpReposition);
        };
    }


    const useUpdateListSpecs = () => (updatedListData: Text[], id: string, gap: string, containerBackgroundColor: string, newZIndex: number) => {
        const updatedSpecs = {
            ...whiteBoardStore.jsonSpecs,
            [id]: {
                ...whiteBoardStore.jsonSpecs[id],
                data: updatedListData,
                gap: gap,
                backgroundColor: containerBackgroundColor,
                zIndex: newZIndex
            },
        };
        whiteBoardStore.setJsonSpecs(updatedSpecs);
    };


    const useAddList = (
        listData: Text[],
        id: string,
        gap: string,
        containerBackgroundColor: string,
        zIndex: number,
        updateListSpecs: ReturnType<typeof useUpdateListSpecs>,
        defaultText: Text
    ) => {
        return () => {
            const updatedListData = [...listData, { ...defaultText }];
            updateListSpecs(updatedListData, id, gap, containerBackgroundColor, zIndex);
        };
    };

    const useRemoveList = (
        listData: Text[],
        id: string,
        gap: string,
        containerBackgroundColor: string,
        zIndex: number,
        updateListSpecs: ReturnType<typeof useUpdateListSpecs>
    ) => {
        return () => {
            if (listData.length === 0) return;
            const updatedListData = listData.slice(0, -1);
            updateListSpecs(updatedListData, id, gap, containerBackgroundColor, zIndex);
        };
    };

    const useHandleListItemChange = (
        listData: Text[],
        id: string,
        gap: string,
        containerBackgroundColor: string,
        zIndex: number,
        updateListSpecs: ReturnType<typeof useUpdateListSpecs>
    ) => {
        return (index: number, newValue: string) => {
            const updatedListData = [...listData];
            updatedListData[index] = { ...updatedListData[index], content: newValue };
            updateListSpecs(updatedListData, id, gap, containerBackgroundColor, zIndex);
        };
    };

    const useChangeListRowHeight = () => {
        return (id: string, index: number, newHeight: number) => {
            // Retrieve the current rowHeight
            const currentRowHeight = (whiteBoardStore.jsonSpecs[id] as DraggableListInterface)?.rowHeight || {};
            // Update the rowHeight with the new value
            const updatedRowHeight = {
                ...currentRowHeight,
                [index]: { height: newHeight }
            };
            // Create the updated specs object
            const updatedSpecs = {
                ...whiteBoardStore.jsonSpecs,
                [id]: {
                    ...whiteBoardStore.jsonSpecs[id],
                    rowHeight: updatedRowHeight
                }
            };

            // Set the updated specs in the store
            whiteBoardStore.setJsonSpecs(updatedSpecs);
        };
    };


    const useUpdateListGap = (
        listData: Text[],
        id: string,
        gap: string,
        containerBackgroundColor: string,
        zIndex: number,
        updateListSpecs: ReturnType<typeof useUpdateListSpecs>
    ) => {
        return (action: 'increase' | 'decrease') => {
            const currentGap = parseInt(gap, 10);
            const newGap = action === 'increase'
                ? `${currentGap + 10}px`
                : `${Math.max(0, currentGap - 10)}px`;
            updateListSpecs(listData, id, newGap, containerBackgroundColor, zIndex);
        };
    };

    const useHandleListTextStyleChange = (
        listData: Text[],
        id: string,
        gap: string,
        containerBackgroundColor: string,
        zIndex: number,
        updateListSpecs: (listData: Text[], id: string, gap: string, containerBackgroundColor: string, zIndex: number) => void,
        focusedIndex: number | null
    ) => {
        return useCallback((newStyle: Partial<Text>) => {
            const updatedListData = focusedIndex !== null
                ? listData.map((item, index) =>
                    index === focusedIndex ? { ...item, ...newStyle } : item
                )
                : listData.map(item => ({ ...item, ...newStyle }));

            updateListSpecs(updatedListData, id, gap, containerBackgroundColor, zIndex);
        }, [listData, id, gap, containerBackgroundColor, zIndex, focusedIndex, updateListSpecs]);
    };

    const useUpdateTableSpecs = () => (updatedTableData: Text[][], id: string, updatedRows?: number, updatedColumns?: number, updatedRowGap?: number, updatedColumnGap?: number, newZIndex?: number, backgroundColor?: string, upDatedCellDimensions?: any) => {
        const currentSpecs = rootStore.whiteBoardStore.jsonSpecs[id];

        if (currentSpecs && 'rows' in currentSpecs && 'columns' in currentSpecs) {
            const updatedSpecs = {
                ...rootStore.whiteBoardStore.jsonSpecs,
                [id]: {
                    ...currentSpecs,
                    rows: updatedRows !== undefined ? updatedRows : currentSpecs.rows,
                    columns: updatedColumns !== undefined ? updatedColumns : currentSpecs.columns,
                    data: updatedTableData,
                    rowGap: updatedRowGap !== undefined ? updatedRowGap : currentSpecs.rowGap,
                    columnGap: updatedColumnGap !== undefined ? updatedColumnGap : currentSpecs.columnGap,
                    zIndex: newZIndex !== undefined ? newZIndex : currentSpecs.zIndex,
                    backgroundColor: backgroundColor !== undefined ? backgroundColor : currentSpecs.backgroundColor,
                    cellDimensions: upDatedCellDimensions !== undefined ? upDatedCellDimensions : currentSpecs.cellDimensions,
                },
            };

            rootStore.whiteBoardStore.setJsonSpecs(updatedSpecs);
        } else {
            console.error(`Item with id ${id} is not a valid table specification.`);
        }
    };

    const useUpdateRowOrColumn = (
        tableData: Text[][],
        id: string,
        rows: number,
        columns: number,
        updateTableSpecs: ReturnType<typeof useUpdateTableSpecs>,
        defaultText: Text
    ) => {
        return (type: 'row' | 'column', action: 'add' | 'remove') => {
            const updatedTableData = [...tableData];

            if (type === 'column') {
                if (action === 'add') {
                    updatedTableData.forEach(row => row.push({ ...defaultText }));
                } else {
                    if (columns <= 1) return;
                    updatedTableData.forEach(row => row.pop());
                }
                updateTableSpecs(updatedTableData, id, rows, action === 'add' ? columns + 1 : columns - 1);
            } else if (type === 'row') {
                if (action === 'add') {
                    updatedTableData.push(new Array(columns).fill({ ...defaultText }));
                    updateTableSpecs(updatedTableData, id, rows + 1, columns);
                } else {
                    if (rows <= 1) return;
                    updatedTableData.pop();
                    updateTableSpecs(updatedTableData, id, rows - 1, columns);
                }
            }
        };
    };

    const useUpdateGap = (
        tableData: Text[][],
        id: string,
        rows: number,
        columns: number,
        rowGap: number,
        columnGap: number,
        updateTableSpecs: ReturnType<typeof useUpdateTableSpecs>
    ) => {
        return (type: 'row' | 'column', action: 'increase' | 'decrease') => {
            if (type === 'row') {
                const newRowGap = action === 'increase' ? rowGap + 2 : Math.max(0, rowGap - 2);
                updateTableSpecs(tableData, id, rows, columns, newRowGap);
            } else if (type === 'column') {
                const newColumnGap = action === 'increase' ? columnGap + 2 : Math.max(0, columnGap - 2);
                updateTableSpecs(tableData, id, rows, columns, undefined, newColumnGap);
            }
        };
    };

    const handleTableMouseMove = (
        e: MouseEvent,
        isResizing: { rowIndex: number; colIndex: number } | null,
        startPos: { x: number; y: number } | null,
        cellDimensionsStore: { [key: string]: { width?: string; height?: string } },
        tableData: any[][],
        updateTableCellDimensions: (id: string, newDimensions: any) => void,
        id: string,
        setStartPos: (pos: { x: number; y: number }) => void
    ) => {
        if (!isResizing || !startPos) return;

        const { rowIndex, colIndex } = isResizing;
        const deltaX = e.clientX - startPos.x;
        const deltaY = e.clientY - startPos.y;

        const newDimensions = { ...cellDimensionsStore };

        if (deltaX !== 0 && colIndex < (tableData[0].length - 1)) {
            const currentCol = `col-${colIndex}`;
            const nextCol = `col-${colIndex + 1}`;
            newDimensions[currentCol] = {
                width: `${parseFloat(newDimensions[currentCol]?.width || '100px') + deltaX}px`
            };
            newDimensions[nextCol] = {
                width: `${parseFloat(newDimensions[nextCol]?.width || '100px') - deltaX}px`
            };
        }

        if (deltaY !== 0 && rowIndex < (tableData.length)) {
            const currentRow = `row-${rowIndex}`;
            const nextRow = `row-${rowIndex + 1}`;

            newDimensions[currentRow] = {
                height: `${parseFloat(newDimensions[currentRow]?.height || '40px') + deltaY}px`
            };
            newDimensions[nextRow] = {
                height: `${parseFloat(newDimensions[nextRow]?.height || '40px') - deltaY}px`
            };
        }

        updateTableCellDimensions(id, newDimensions);
        setStartPos({ x: e.clientX, y: e.clientY });
    };

    const useHandleCellChange = (
        tableData: Text[][],
        id: string,
        updateTableSpecs: ReturnType<typeof useUpdateTableSpecs>
    ) => {
        const handleCellChange = (rowIndex: number, colIndex: number, newValue: string) => {
            const updatedTableData = tableData.map((row, rIndex) =>
                row.map((cell, cIndex) =>
                    rIndex === rowIndex && cIndex === colIndex ? { ...cell, content: newValue } : cell
                )
            );
            updateTableSpecs(updatedTableData, id);
        };

        return handleCellChange;
    };


    const useHandleTextEditorChange = (
        tableData: Text[][],
        id: string,
        focusedIndex: { row: number; col: number } | null,
        updateTableSpecs: ReturnType<typeof useUpdateTableSpecs>
    ) => {
        const handleTextEditorChange = (updatedContent: Partial<Text>) => {
            if (focusedIndex) {
                const { row, col } = focusedIndex;
                const updatedTableData = tableData.map((r, rIndex) =>
                    r.map((cell, cIndex) =>
                        rIndex === row && cIndex === col ? { ...cell, ...updatedContent } : cell
                    )
                );
                updateTableSpecs(updatedTableData, id);
            } else {
                const updatedTableData = tableData.map(row =>
                    row.map(cell => ({ ...cell, ...updatedContent }))
                );
                updateTableSpecs(updatedTableData, id);
            }
        };

        return handleTextEditorChange;
    };


    const useUpdateTableCellDimensions = () => {
        return (id: string, updatedCellDimension: any) => {

            const updatedSpecs = {
                ...whiteBoardStore.jsonSpecs,
                [id]: {
                    ...whiteBoardStore.jsonSpecs[id],
                    cellDimensions: updatedCellDimension
                },
            };

            whiteBoardStore.setJsonSpecs(updatedSpecs);
        };
    };


    const useHandleTopTextBar = () => (isEditing: any, content: any, onChange: any) => {
        if (isEditing === true) {
            whiteBoardStore.setTextEditor(content, onChange)
        } else {
            whiteBoardStore.setTextEditor(null, null)
        }
    };

    const useHandleContainerEditorBar = () => (isEditing: any, object: any) => {
        if (isEditing === true) {
            whiteBoardStore.setContainerEditor(object)
        } else {
            whiteBoardStore.setContainerEditor(null)
        }
    };



    return {
        useEditStandards,
        useUpdateStandards,
        useAddList,
        useRemoveList,
        useHandleListItemChange,
        useChangeListRowHeight,
        useUpdateListGap,
        useHandleListTextStyleChange,
        useHandleCellChange,
        handleTableMouseMove,
        useHandleTextEditorChange,
        useUpdateGap,
        useHandleContainerEditorBar,
        useHandleDrop,
        useHandleDragOver,
        useToggleEditing,
        useDeleteItem,
        useHandleTextEdit,
        useZIndexHandler,
        useHandleKeyDown,
        useHandleBlur,
        useHandleAddImage,
        useHandleImageUpload,
        useHandleMouseDownReposition,
        useUpdateListSpecs,
        useUpdateTableSpecs,
        useHandleTopTextBar,
        useUpdateTableCellDimensions,
        useUpdateRowOrColumn
    };
};

