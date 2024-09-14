import { rootStore } from "../stores/rootStore";
import { useCallback, useState } from "react";
import { createDraggableCircleleSpec, createDraggableImageSpec, createDraggableListSpec, createDraggableRectangleSpec, createDraggableTableSpec, createDraggableTextSpec, createDraggableTriangleSpec, DraggableImageInterface, DraggableListInterface, DraggableTableInterface, DraggableTextInterface, JsonSpecs, Text } from "../types/whiteBoard";

export const useWhiteBoardHandlers = () => {
    const { whiteBoardStore } = rootStore;


    const useHandleDrop = () => {
        return (event: React.DragEvent<HTMLDivElement>, pageId: number) => {
            event.preventDefault();
            const itemType = event.dataTransfer.getData('itemType');
            const page = whiteBoardStore.pages.find(page => page.id === pageId);
            const existingSpecs = page?.jsonSpecs || {};
            const itemIds = Object.keys(existingSpecs).filter(id => id.startsWith(itemType));
            const newIdNumber = itemIds.length > 0
                ? Math.max(...itemIds.map(id => parseInt(id.split('-')[1], 10))) + 1
                : 1; // Start with 1 if no existing IDs

            const id = `${itemType}-${newIdNumber}`;
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
                case 'Rectangle':
                    newSpec = { [id]: createDraggableRectangleSpec(id, x, y) };
                    break;
                case 'Circle':
                    newSpec = { [id]: createDraggableCircleleSpec(id, x, y) };
                    break;
                case 'Triangle':
                    newSpec = { [id]: createDraggableTriangleSpec(id, x, y) };
                    break;
                default:
                    newSpec = { [id]: createDraggableTextSpec(id, x, y) };
            }

            whiteBoardStore.addObjectToPage(pageId, newSpec);
        };
    };

    const useHandleDragOver = () => {
        return (event: React.DragEvent<HTMLDivElement>) => {
            event.preventDefault();
        };
    }

    const useToggleEditing = () => {

        return (pageId: number, id: string) => {
            const page = whiteBoardStore.pages.find(page => page.id === pageId);
            if (page) {
                const updatedSpecs = {
                    ...page.jsonSpecs,
                    [id]: {
                        ...page.jsonSpecs[id],
                        isEditing: !page.jsonSpecs[id]?.isEditing,
                    },
                };

                // Update the jsonSpecs for the specified page
                whiteBoardStore.setJsonSpecs(updatedSpecs, pageId);
            } else {
                console.error(`Page with ID ${pageId} not found.`);
            }
        };
    };

    const useEditStandards = (
        pageId: number,
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
                updateStandards(pageId, id, undefined, newBorder, undefined, undefined, undefined, undefined);
            } else if (type === 'borderRadius') {
                const currentBorderRadius = standardSpecs.borderRadius || 0;
                const newBorderRadius = action === 'increase' ? currentBorderRadius + borderRadiusStep : Math.max(0, currentBorderRadius - borderRadiusStep);
                updateStandards(pageId, id, undefined, undefined, undefined, newBorderRadius, undefined, undefined);
            } else if (type === 'opacity') {
                const currentOpacity = standardSpecs.opacity || 1;
                const newOpacity = action === 'increase' ? Math.min(1, currentOpacity + opacityStep) : Math.max(0, currentOpacity - opacityStep);
                updateStandards(pageId, id, newOpacity, undefined, undefined, undefined, undefined, undefined);
            } else if (type === 'zIndex') {
                const currentZIndex = standardSpecs.zIndex || 0;
                const newZIndex = action === 'increase' ? currentZIndex + zIndexStep : Math.max(0, currentZIndex - zIndexStep);
                updateStandards(pageId, id, undefined, undefined, undefined, undefined, newZIndex, undefined);
            } else if (type === 'padding') {
                const currentPadding = standardSpecs.padding || 0;
                const newPadding = action === 'increase' ? currentPadding + paddingStep : Math.max(0, currentPadding - paddingStep);
                updateStandards(pageId, id, undefined, undefined, undefined, undefined, undefined, undefined, newPadding);
            }
        };
    };

    const useUpdateStandards = () => {

        return (
            pageId: number,
            id: string,
            opacity?: number,
            border?: number,
            borderColor?: string,
            borderRadius?: number,
            zIndex?: number,
            backgroundColor?: string,
            padding?: number,
            repeate?: boolean
        ) => {
            const page = whiteBoardStore.pages.find(page => page.id === pageId);
            if (page) {
                const updatedSpecs = {
                    ...page.jsonSpecs,
                    [id]: {
                        ...page.jsonSpecs[id],
                        opacity: opacity !== undefined ? opacity : page.jsonSpecs[id]?.opacity,
                        border: border !== undefined ? border : page.jsonSpecs[id]?.border,
                        borderColor: borderColor !== undefined ? borderColor : page.jsonSpecs[id]?.borderColor,
                        borderRadius: borderRadius !== undefined ? borderRadius : page.jsonSpecs[id]?.borderRadius,
                        zIndex: zIndex !== undefined ? zIndex : page.jsonSpecs[id]?.zIndex,
                        backgroundColor: backgroundColor !== undefined ? backgroundColor : page.jsonSpecs[id]?.backgroundColor,
                        padding: padding !== undefined ? padding : page.jsonSpecs[id]?.padding,
                        repeate: repeate !== undefined ? repeate : page.jsonSpecs[id]?.repeate
                    },
                };

                // Update the jsonSpecs for the specified page
                whiteBoardStore.setJsonSpecs(updatedSpecs, pageId);                
            } else {
                console.error(`Page with ID ${pageId} not found.`);
            }
        };
    };


    const useDeleteItem = () => {
        return (pageId: number, id: string) => {
            const page = whiteBoardStore.pages.find(page => page.id === pageId);
            whiteBoardStore.setTextEditor(null, null);
            whiteBoardStore.setContainerEditor(null);
            if (page) {
                const oldSpecs = whiteBoardStore.pages[pageId].jsonSpecs
                delete oldSpecs[id]
                whiteBoardStore.setJsonSpecs(oldSpecs, pageId);
            } else {
                console.error(`Page with ID ${pageId} not found.`);
            }
        };
    };


    const useHandleTextEdit = () => {

        return (pageId: number, id: string, event?: React.ChangeEvent<HTMLTextAreaElement | HTMLSelectElement>, textIndex?: number, updatedText?: string) => {
            const page = whiteBoardStore.pages.find(page => page.id === pageId);
            if (page) {
                let updatedData;
                if (event) {
                    const { name, value } = event.target;
                    updatedData = { ...(page.jsonSpecs[id] as DraggableTextInterface).data, [name]: value };
                } else {
                    updatedData = { ...(page.jsonSpecs[id] as any).data, content: updatedText };
                }

                const updatedSpecs = {
                    ...page.jsonSpecs,
                    [id]: {
                        ...(page.jsonSpecs[id] as DraggableTextInterface),
                        data: updatedData,
                        zIndex: textIndex !== undefined ? textIndex : page.jsonSpecs[id].zIndex,
                    },
                };

                // Update the jsonSpecs for the specified page
                whiteBoardStore.setJsonSpecs(updatedSpecs, pageId);
            } else {
                console.error(`Page with ID ${pageId} not found.`);
            }
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
        return (pageId: number, event: React.ChangeEvent<HTMLInputElement>, id: string) => {
            const file = event.target.files?.[0];

            if (file) {
                const reader = new FileReader();
                reader.onloadend = () => {
                    const base64String = reader.result as string;

                    // Find the page by pageId
                    const page = whiteBoardStore.pages.find(page => page.id === pageId);

                    if (page) {
                        const updatedSpecs = {
                            ...page.jsonSpecs,
                            [id]: {
                                ...page.jsonSpecs[id],
                                src: base64String,
                            },
                        };

                        // Update jsonSpecs for the specified page
                        whiteBoardStore.setJsonSpecs(updatedSpecs, pageId);
                    } else {
                        console.error(`Page with ID ${pageId} not found.`);
                    }
                };

                reader.readAsDataURL(file);
            }
        };
    };

    const useDirectSizeUpdate = () => {
        return (pageId: number, id: string, newWidth: number, newHeight: number) => {
            const getJsonSpecs = () => whiteBoardStore.pages.find(page => page.id === pageId)?.jsonSpecs || {};

            const updatedSpecs = {
                ...getJsonSpecs(),
                [id]: {
                    ...getJsonSpecs()[id],
                    width: `${newWidth}px`,
                    height: `${newHeight}px`,
                },
            };
            whiteBoardStore.setJsonSpecs(updatedSpecs, pageId);
        };
    };





    const useHandleMouseDownReposition = () => {
        return (
            event: React.MouseEvent<HTMLDivElement>,
            id: string,
            draggableRef: React.RefObject<HTMLDivElement>,
            pageId: number
        ) => {
            const page = whiteBoardStore.pages.find(page => page.id === pageId);
            if (!page || page.jsonSpecs[id].isEditing) return;

            const snapThreshold = 10;
            let isSnapped = {
                left: false,
                right: false,
                top: false,
                bottom: false,
                center: false
            };

            const guidLines = page.guidLines;

            const offsetX = event.clientX - page.jsonSpecs[id].location.x;
            const offsetY = event.clientY - page.jsonSpecs[id].location.y;
            const draggable = draggableRef.current;

            const topLineRect = document.getElementById(`page${pageId}topLineGuid`)?.getBoundingClientRect();
            const rightLineRect = document.getElementById(`page${pageId}rightLineGuid`)?.getBoundingClientRect();
            const bottomLineRect = document.getElementById(`page${pageId}bottomLineGuid`)?.getBoundingClientRect();
            const leftLineRect = document.getElementById(`page${pageId}leftLineGuid`)?.getBoundingClientRect();
            const centerVertLineRect = document.getElementById(`page${pageId}centerVertGuidLine`)?.getBoundingClientRect();

            const handleMouseMoveReposition = (event: MouseEvent) => {
                if (!draggable) return;

                const objRect = draggable.getBoundingClientRect();
                const objWidth = objRect.width;
                const objHeight = objRect.height;
                const objLeft = objRect.left;
                const objRight = objRect.right;
                const objTop = objRect.top;
                const objBottom = objRect.bottom;

                let newX = event.clientX - offsetX;
                let newY = event.clientY - offsetY;

                let updatedGuidelines = { ...guidLines };

                // Left snapping
                if (leftLineRect && Math.abs(objLeft - leftLineRect.left) < snapThreshold) {
                    if (Math.abs(event.clientX - offsetX - guidLines.left) < snapThreshold) {
                        newX = guidLines.left;
                        isSnapped.left = true;
                        updatedGuidelines.leftVisb = true;
                    } else {
                        isSnapped.left = false;
                        updatedGuidelines.leftVisb = false;
                    }
                } else {
                    isSnapped.left = false;
                    updatedGuidelines.leftVisb = false;
                }

                // Right snapping
                if (rightLineRect && Math.abs(objRight - rightLineRect.left) < snapThreshold) {
                    const parentLeft = draggable.offsetParent?.getBoundingClientRect().left || 0;
                    const rightGuidelineRelativeToParent = rightLineRect.left - parentLeft;
                    if (Math.abs(event.clientX - offsetX - (rightGuidelineRelativeToParent - objWidth)) < snapThreshold) {
                        newX = rightGuidelineRelativeToParent - objWidth + 4;
                        isSnapped.right = true;
                        updatedGuidelines.rightVisb = true;
                    } else {
                        isSnapped.right = false;
                        updatedGuidelines.rightVisb = false;
                    }
                } else {
                    isSnapped.right = false;
                    updatedGuidelines.rightVisb = false;
                }

                // Top snapping
                if (topLineRect && Math.abs(objTop - topLineRect.top) < snapThreshold) {
                    if (Math.abs(event.clientY - offsetY - guidLines.top) < snapThreshold) {
                        newY = guidLines.top;
                        isSnapped.top = true;
                        updatedGuidelines.topVisb = true;
                    } else {
                        isSnapped.top = false;
                        updatedGuidelines.topVisb = false;
                    }
                } else {
                    isSnapped.top = false;
                    updatedGuidelines.topVisb = false;
                }

                // Bottom snapping
                if (bottomLineRect && Math.abs(objBottom - bottomLineRect.top) < snapThreshold) {
                    const parentTop = draggable.offsetParent?.getBoundingClientRect().top || 0;
                    const bottomGuidelineRelativeToParent = bottomLineRect.top - parentTop;
                    if (Math.abs(event.clientY - offsetY - (bottomGuidelineRelativeToParent - objHeight)) < snapThreshold) {
                        newY = bottomGuidelineRelativeToParent - objHeight + 4;
                        isSnapped.bottom = true;
                        updatedGuidelines.bottomVisb = true;
                    } else {
                        isSnapped.bottom = false;
                        updatedGuidelines.bottomVisb = false;
                    }
                } else {
                    isSnapped.bottom = false;
                    updatedGuidelines.bottomVisb = false;
                }

                // Center snapping
                if (centerVertLineRect && Math.abs(objLeft + objWidth / 2 - centerVertLineRect.left) < snapThreshold) {
                    const parentLeft = draggable.offsetParent?.getBoundingClientRect().left || 0;
                    const centerGuidelineRelativeToParent = centerVertLineRect.left - parentLeft;
                    if (Math.abs(event.clientX - offsetX - (centerGuidelineRelativeToParent - objWidth / 2)) < snapThreshold) {
                        newX = centerGuidelineRelativeToParent - objWidth / 2;
                        isSnapped.center = true;
                        updatedGuidelines.centerVisb = true;
                    } else {
                        isSnapped.center = false;
                        updatedGuidelines.centerVisb = false;
                    }
                } else {
                    isSnapped.center = false;
                    updatedGuidelines.centerVisb = false;
                }

                // Update guideline visibility in the store
                whiteBoardStore.setGuidLines(updatedGuidelines, pageId);

                const updatedSpecs = {
                    ...page.jsonSpecs,
                    [id]: {
                        ...page.jsonSpecs[id],
                        location: {
                            x: newX,
                            y: newY,
                        },
                    },
                };
                whiteBoardStore.setJsonSpecs(updatedSpecs, pageId);
            };

            const handleMouseUpReposition = () => {
                whiteBoardStore.setGuidLines({
                    ...guidLines,
                    topVisb: false,
                    rightVisb: false,
                    bottomVisb: false,
                    leftVisb: false,
                    centerVisb: false
                }, pageId);
                document.removeEventListener('mousemove', handleMouseMoveReposition);
                document.removeEventListener('mouseup', handleMouseUpReposition);
                whiteBoardStore.saveCurrentState()
            };

            document.addEventListener('mousemove', handleMouseMoveReposition);
            document.addEventListener('mouseup', handleMouseUpReposition);
        };
    };






    const useUpdateListSpecs = () => (pageId: number, updatedListData: Text[], id: string, gap: string, containerBackgroundColor: string, newZIndex: number, updatedOrderedList?: boolean) => {
        const page = whiteBoardStore.pages.find(page => page.id === pageId);
        if (page) {
            const updatedSpecs = {
                ...page.jsonSpecs,
                [id]: {
                    ...page.jsonSpecs[id],
                    data: updatedListData,
                    gap: gap,
                    backgroundColor: containerBackgroundColor,
                    zIndex: newZIndex,
                    orderedList: updatedOrderedList && (updatedOrderedList)
                },
            };
            whiteBoardStore.setJsonSpecs(updatedSpecs, pageId);
        } else {
            console.error(`Page with ID ${pageId} not found.`);
        }
    };

    const useOrderedList = (
        pageId: number,
        listData: Text[],
        id: string,
        newGap: string,
        orderedList: boolean,
        containerBackgroundColor: string,
        zIndex: number,
        updateListSpecs: ReturnType<typeof useUpdateListSpecs>
    ) => {
        return () => {
            const newOrderedList = !orderedList;
            console.log(newOrderedList)
            updateListSpecs(pageId, listData, id, newGap, containerBackgroundColor, zIndex, newOrderedList);
        };
    };

    const selectkMarkerForList = (
        pageId: number,
        id: string,
        marker: string
    ) => {

        const page = whiteBoardStore.pages.find(page => page.id === pageId);
        if (page) {
            const updatedSpecs = {
                ...page.jsonSpecs,
                [id]: {
                    ...page.jsonSpecs[id],
                    marker: marker,
                },
            };
            whiteBoardStore.setJsonSpecs(updatedSpecs, pageId);
        }
    };



    const useAddList = (
        pageId: number,
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
            updateListSpecs(pageId, updatedListData, id, gap, containerBackgroundColor, zIndex);
        };
    };

    const useRemoveList = (
        pageId: number,
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
            updateListSpecs(pageId, updatedListData, id, gap, containerBackgroundColor, zIndex);
        };
    };

    const useHandleListItemChange = (
        pageId: number,
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
            updateListSpecs(pageId, updatedListData, id, gap, containerBackgroundColor, zIndex);
        };
    };

    const useChangeListRowHeight = () => {
        return (pageId: number, id: string, index: number, newHeight: number) => {
            const page = whiteBoardStore.pages.find(page => page.id === pageId);
            if (page) {
                // Retrieve the current rowHeight
                const currentRowHeight = (page.jsonSpecs[id] as DraggableListInterface)?.rowHeight || {};
                // Update the rowHeight with the new value
                const updatedRowHeight = {
                    ...currentRowHeight,
                    [index]: { height: newHeight }
                };
                // Create the updated specs object
                const updatedSpecs = {
                    ...page.jsonSpecs,
                    [id]: {
                        ...page.jsonSpecs[id],
                        rowHeight: updatedRowHeight
                    }
                };

                // Set the updated specs in the store
                whiteBoardStore.setJsonSpecs(updatedSpecs, pageId);
            } else {
                console.error(`Page with ID ${pageId} not found.`);
            }
        };
    };



    const useUpdateListGap = (
        pageId: number,
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
            updateListSpecs(pageId, listData, id, newGap, containerBackgroundColor, zIndex);
        };
    };

    const useHandleListTextStyleChange = (
        pageId: number,
        listData: Text[],
        id: string,
        gap: string,
        containerBackgroundColor: string,
        zIndex: number,
        updateListSpecs: (pageId: number, listData: Text[], id: string, gap: string, containerBackgroundColor: string, zIndex: number) => void,
        focusedIndex: number | null
    ) => {
        return useCallback((newStyle: Partial<Text>) => {
            const updatedListData = focusedIndex !== null
                ? listData.map((item, index) =>
                    index === focusedIndex ? { ...item, ...newStyle } : item
                )
                : listData.map(item => ({ ...item, ...newStyle }));

            updateListSpecs(pageId, updatedListData, id, gap, containerBackgroundColor, zIndex);
        }, [listData, id, gap, containerBackgroundColor, zIndex, focusedIndex, updateListSpecs]);
    };

    const useHandleListMouseDown = (
        pageId: number,
        id: string,
        resizeRefs: any,
        changeListRowHeight: (pageId: number, id: string, index: number, height: number) => void
    ) => {
        return useCallback(
            (
                e: React.MouseEvent,
                index: number,
                draggableRef: React.RefObject<HTMLDivElement>,
                threshold: number = 5
            ) => {
                const startY = e.clientY;
                const startHeight = resizeRefs.current[index]?.clientHeight || 0;
                const nextItemHeight = resizeRefs.current[index + 1]?.clientHeight || 0;
                let isSnapped = false; // Track whether the item is snapped

                const parentBottom = draggableRef.current?.getBoundingClientRect().bottom || 0;

                const onMouseMove = (e: MouseEvent) => {
                    const currentItemTop = resizeRefs.current[index]?.getBoundingClientRect().top || 0;
                    const cursorPosition = e.clientY;

                    let newHeight = startHeight + (e.clientY - startY);
                    let newNextHeight = nextItemHeight - (e.clientY - startY);
                    if (newHeight < 16) {
                        return;
                    }

                    if (Math.abs(cursorPosition - parentBottom) <= threshold) {
                        // Snap to the bottom of the parent
                        newHeight = parentBottom - currentItemTop;
                        isSnapped = true;
                    } else {
                        isSnapped = false;
                    }

                    changeListRowHeight(pageId, id, index, newHeight);
                    changeListRowHeight(pageId, id, index + 1, newNextHeight);
                };

                const onMouseUp = () => {
                    document.removeEventListener('mousemove', onMouseMove);
                    document.removeEventListener('mouseup', onMouseUp);
                    whiteBoardStore.saveCurrentState()
                };

                document.addEventListener('mousemove', onMouseMove);
                document.addEventListener('mouseup', onMouseUp);
            },
            [pageId, id, resizeRefs, changeListRowHeight]
        );
    };


    const useUpdateTableSpecs = () => (pageId: number, updatedTableData: Text[][], id: string, updatedRows?: number, updatedColumns?: number, updatedRowGap?: number, updatedColumnGap?: number, newZIndex?: number, backgroundColor?: string, upDatedCellDimensions?: any) => {
        const page = whiteBoardStore.pages.find(page => page.id === pageId);

        if (page) {
            const currentSpecs = page.jsonSpecs[id];

            if (currentSpecs && 'rows' in currentSpecs && 'columns' in currentSpecs) {
                const updatedSpecs = {
                    ...page.jsonSpecs,
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

                // Update the jsonSpecs for the specified page
                whiteBoardStore.setJsonSpecs(updatedSpecs, pageId);
            } else {
                console.error(`Item with id ${id} is not a valid table specification.`);
            }
        } else {
            console.error(`Page with ID ${pageId} not found.`);
        }
    };

    const useUpdateRowOrColumn = (
        pageId: number,
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
                updateTableSpecs(pageId, updatedTableData, id, rows, action === 'add' ? columns + 1 : columns - 1);
            } else if (type === 'row') {
                if (action === 'add') {
                    updatedTableData.push(new Array(columns).fill({ ...defaultText }));
                    updateTableSpecs(pageId, updatedTableData, id, rows + 1, columns);
                } else {
                    if (rows <= 1) return;
                    updatedTableData.pop();
                    updateTableSpecs(pageId, updatedTableData, id, rows - 1, columns);
                }
            }
        };
    };

    const useUpdateGap = (
        pageId: number,
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
                updateTableSpecs(pageId, tableData, id, rows, columns, newRowGap);
            } else if (type === 'column') {
                const newColumnGap = action === 'increase' ? columnGap + 2 : Math.max(0, columnGap - 2);
                updateTableSpecs(pageId, tableData, id, rows, columns, undefined, newColumnGap);
            }
        };
    };

    const handleTableMouseMove = (
        pageId: number,
        e: MouseEvent,
        isResizing: { rowIndex: number; colIndex: number } | null,
        startPos: { x: number; y: number } | null,
        cellDimensionsStore: { [key: string]: { width?: string; height?: string } },
        tableData: any[][],
        updateTableCellDimensions: (pageId: number, id: string, newDimensions: any) => void,
        id: string,
        setStartPos: (pos: { x: number; y: number }) => void,
        tableRef: React.RefObject<HTMLTableElement>,
        parentRef: React.RefObject<HTMLDivElement>
    ) => {
        if (!isResizing || !startPos) return;

        const { rowIndex, colIndex } = isResizing;
        const deltaX = e.clientX - startPos.x;
        const deltaY = e.clientY - startPos.y;

        const newDimensions = { ...cellDimensionsStore };

        const totalRows = tableData.length;
        const totalCols = tableData[0]?.length || 0;

        if (colIndex >= 0 && colIndex < totalCols - 1) {
            const currentCol = `col-${colIndex}`;
            const nextCol = `col-${colIndex + 1}`;

            const currentWidth = parseFloat(newDimensions[currentCol]?.width || '100px');
            const nextWidth = parseFloat(newDimensions[nextCol]?.width || '100px');

            const isShiftKey = e.shiftKey; // Check if Shift key is pressed

            if (isShiftKey) {
                // Apply resizing to all columns
                for (let i = 0; i < totalCols - 1; i++) {
                    const col = `col-${i}`;
                    const nextCol = `col-${i + 1}`;

                    const colWidth = parseFloat(newDimensions[col]?.width || '100px');
                    const nextColWidth = parseFloat(newDimensions[nextCol]?.width || '100px');

                    newDimensions[col] = {
                        width: `${colWidth + deltaX}px`
                    };
                    newDimensions[nextCol] = {
                        width: `${nextColWidth - deltaX}px`
                    };
                }
            } else {
                // Apply resizing to selected column
                newDimensions[currentCol] = {
                    width: `${currentWidth + deltaX}px`
                };
                newDimensions[nextCol] = {
                    width: `${nextWidth - deltaX}px`
                };
            }
        }

        if (rowIndex >= 0 && rowIndex < totalRows) {
            const currentRow = `row-${rowIndex}`;

            const currentHeight = parseFloat(newDimensions[currentRow]?.height || '40px');

            const isShiftKey = e.shiftKey; // Check if Shift key is pressed

            if (isShiftKey) {
                // Apply resizing to all rows
                for (let i = 0; i < totalRows; i++) {
                    const row = `row-${i}`;
                    const rowHeight = parseFloat(newDimensions[row]?.height || '40px');

                    newDimensions[row] = {
                        height: `${rowHeight + deltaY}px`
                    };
                }
            } else {
                // Apply resizing to selected row
                newDimensions[currentRow] = {
                    height: `${currentHeight + deltaY}px`
                };
            }
        }

        updateTableCellDimensions(pageId, id, newDimensions);
        setStartPos({ x: e.clientX, y: e.clientY });
    };



    //const handleTableMouseMove = (
    //    pageId: number,
    //    e: MouseEvent,
    //    isResizing: { rowIndex: number; colIndex: number } | null,
    //    startPos: { x: number; y: number } | null,
    //    cellDimensionsStore: { [key: string]: { width?: string; height?: string } },
    //    tableData: any[][],
    //    updateTableCellDimensions: (pageId: number, id: string, newDimensions: any) => void,
    //    id: string,
    //    setStartPos: (pos: { x: number; y: number }) => void,
    //    tableRef: React.RefObject<HTMLTableElement>,
    //    parentRef: React.RefObject<HTMLDivElement>
    //) => {
    //    if (!isResizing || !startPos) return;
    //
    //    const { rowIndex, colIndex } = isResizing;
    //    const deltaX = e.clientX - startPos.x;
    //    const deltaY = e.clientY - startPos.y;
    //
    //    const minDimension = 20; // Minimum width/height in pixels
    //
    //    const parentWidth = parentRef.current?.getBoundingClientRect().width || 0;
    //    const parentHeight = parentRef.current?.getBoundingClientRect().height || 0;
    //
    //    const rows = Array.from(tableRef.current?.rows || []);
    //    const cols = rows[0] ? Array.from(rows[0].cells) : [];
    //
    //    let newDimensions = { ...cellDimensionsStore };
    //
    //    const resizeColumn = () => {
    //        if (deltaX === 0 || colIndex >= tableData[0].length - 1) return;
    //
    //        const currentCol = `col-${colIndex}`;
    //        const nextCol = `col-${colIndex + 1}`;
    //
    //        const currentColWidth = parseFloat(newDimensions[currentCol]?.width || `${cols[colIndex].offsetWidth}px`);
    //        const nextColWidth = parseFloat(newDimensions[nextCol]?.width || `${cols[colIndex + 1].offsetWidth}px`);
    //
    //        const intendedCurrentColWidth = Math.max(currentColWidth + deltaX, minDimension);
    //        const intendedNextColWidth = Math.max(nextColWidth - deltaX, minDimension);
    //
    //        // Ensure that the resized table doesn't exceed the parent's width
    //        if (intendedCurrentColWidth + intendedNextColWidth <= parentWidth) {
    //            newDimensions[currentCol] = { width: `${intendedCurrentColWidth}px` };
    //            newDimensions[nextCol] = { width: `${intendedNextColWidth}px` };
    //        }
    //    };
    //
    //    const resizeRow = () => {
    //        if (deltaY === 0 || rowIndex >= tableData.length - 1) return;
    //
    //        const currentRow = `row-${rowIndex}`;
    //        const nextRow = `row-${rowIndex + 1}`;
    //
    //        const currentRowHeight = parseFloat(newDimensions[currentRow]?.height || `${rows[rowIndex].offsetHeight}px`);
    //        const nextRowHeight = parseFloat(newDimensions[nextRow]?.height || `${rows[rowIndex + 1].offsetHeight}px`);
    //
    //        const intendedCurrentRowHeight = Math.max(currentRowHeight + deltaY, minDimension);
    //        const intendedNextRowHeight = Math.max(nextRowHeight - deltaY, minDimension);
    //
    //        // Ensure that the resized table doesn't exceed the parent's height
    //        if (intendedCurrentRowHeight + intendedNextRowHeight <= parentHeight) {
    //            newDimensions[currentRow] = { height: `${intendedCurrentRowHeight}px` };
    //            newDimensions[nextRow] = { height: `${intendedNextRowHeight}px` };
    //        }
    //    };
    //
    //    resizeColumn();
    //    resizeRow();
    //
    //    updateTableCellDimensions(pageId, id, newDimensions);
    //    setStartPos({ x: e.clientX, y: e.clientY });
    //};


    const useHandleCellChange = (
        pageId: number,
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
            updateTableSpecs(pageId, updatedTableData, id);
        };

        return handleCellChange;
    };


    const useHandleTableTextEditorChange = (
        pageId: number,
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
                updateTableSpecs(pageId, updatedTableData, id);
            } else {
                const updatedTableData = tableData.map(row =>
                    row.map(cell => ({ ...cell, ...updatedContent }))
                );
                updateTableSpecs(pageId, updatedTableData, id);
            }
        };

        return handleTextEditorChange;
    };


    const useUpdateTableCellDimensions = () => {
        const { whiteBoardStore } = rootStore; // Ensure you have access to rootStore and whiteBoardStore

        return (pageId: number, id: string, updatedCellDimension: any) => {
            const page = whiteBoardStore.pages.find(page => page.id === pageId);

            if (page) {
                const updatedSpecs = {
                    ...page.jsonSpecs,
                    [id]: {
                        ...page.jsonSpecs[id],
                        cellDimensions: updatedCellDimension
                    },
                };

                // Update the jsonSpecs for the specified page
                whiteBoardStore.setJsonSpecs(updatedSpecs, pageId);
            } else {
                console.error(`Page with ID ${pageId} not found.`);
            }
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
        useOrderedList,
        selectkMarkerForList,
        useHandleListTextStyleChange,
        useHandleListMouseDown,
        useHandleCellChange,
        handleTableMouseMove,
        useHandleTableTextEditorChange,
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
        useDirectSizeUpdate,
        useHandleMouseDownReposition,
        useUpdateListSpecs,
        useUpdateTableSpecs,
        useHandleTopTextBar,
        useUpdateTableCellDimensions,
        useUpdateRowOrColumn
    };
};

export const extractColorsFromItem = (item: any, colors: Set<string>) => {
    const isTransparent = (color: string) => {
        const lowerColor = color.toLowerCase();
        return lowerColor === 'transparent' ||
            lowerColor === 'rgba(255, 255, 255, 0)' ||
            lowerColor === 'rgba(0, 0, 0, 0)' ||
            lowerColor === 'rgba(0, 0, 0, 0.0)' ||
            lowerColor === 'rgba(255, 255, 255, 0.0)' ||
            lowerColor === '#ffffff00';
    };

    if (item.backgroundColor && !isTransparent(item.backgroundColor)) {
        colors.add(item.backgroundColor);
    }
    if (item.borderColor && !isTransparent(item.borderColor)) {
        colors.add(item.borderColor);
    }
    if (item.data) {
        const textData = Array.isArray(item.data) ? item.data : [item.data];
        textData.forEach((textItem: any) => {
            if (textItem.color && !isTransparent(textItem.color)) {
                colors.add(textItem.color);
            }
            if (textItem.backgroundColor && !isTransparent(textItem.backgroundColor)) {
                colors.add(textItem.backgroundColor);
            }
        });
    }
};

export const extractColorsFromPages = (pages: any[]) => {
    const colors: Set<string> = new Set();

    pages.forEach(page => {
        Object.values(page.jsonSpecs).forEach(item => {
            extractColorsFromItem(item, colors);
        });
    });

    return Array.from(colors);
};