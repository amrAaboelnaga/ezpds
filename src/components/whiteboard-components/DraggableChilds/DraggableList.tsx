import React, { useState, useRef, useEffect, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { useWhiteBoardHandlers } from '../../../handlers/whiteBoardHandlers';

import { EditableText } from '../EditableText';
import { TextEditorBar } from '../TextEditorBar';
import { ColorSelectorForConts } from '../ColorSelectorForConts';
import { defaultText, Text } from '../../../types/whiteBoard';


interface DraggableListProps { id: string; listData: Text[]; isEditing: boolean; toggleEditing: (id: string) => void; gap: string; backgroundColor: string; zIndex: number; focusedIndex: any; setFocusedIndex: any; }

export const DraggableList: React.FC<DraggableListProps> = observer(({ id, listData, isEditing, toggleEditing, gap, backgroundColor, zIndex, focusedIndex, setFocusedIndex }) => {
    const { useHandleContainerEditorBar, useAddList, useRemoveList, useHandleListItemChange, useChangeListRowHeight, useUpdateListGap, useHandleListTextStyleChange, useDeleteItem, useUpdateListSpecs, useHandleTopTextBar, useZIndexHandler } = useWhiteBoardHandlers();

    const resizeRefs = useRef<(HTMLDivElement | null)[]>([]);

    const handleDeleteItem = useDeleteItem();
    const updateListSpecs = useUpdateListSpecs();
    const handleTopTextBar = useHandleTopTextBar();
    const handleZindex = useZIndexHandler();

    const handleContainerEditor = useHandleContainerEditorBar();
    const addList = useAddList(listData, id, gap, backgroundColor, zIndex, updateListSpecs, defaultText);
    const removeList = useRemoveList(listData, id, gap, backgroundColor, zIndex, updateListSpecs);
    const handleListItemChange = useHandleListItemChange(listData, id, gap, backgroundColor, zIndex, updateListSpecs);
    const changeListRowHeight = useChangeListRowHeight(listData, id, gap, backgroundColor, zIndex, updateListSpecs);
    const updateListGap = useUpdateListGap(listData, id, gap, backgroundColor, zIndex, updateListSpecs);
    const handleListTextStyleChange = useHandleListTextStyleChange(listData, id, gap, backgroundColor, zIndex, updateListSpecs, focusedIndex);

    const handleListMouseDown = (e: React.MouseEvent, index: number) => {
        const startY = e.clientY;
        const startHeight = resizeRefs.current[index]?.clientHeight || 0;

        const onMouseMove = (e: MouseEvent) => {
            const newHeight = startHeight + (e.clientY - startY);
            if (newHeight < 30) {
                return
            }
            changeListRowHeight(index, `${newHeight}px`);
        };

        const onMouseUp = () => {
            document.removeEventListener('mousemove', onMouseMove);
            document.removeEventListener('mouseup', onMouseUp);
        };

        document.addEventListener('mousemove', onMouseMove);
        document.addEventListener('mouseup', onMouseUp);
    };


    const increaseZIndex = () => {
        const newZIndex = zIndex + 1;
        handleZindex(id, newZIndex);
    };

    const reduceZIndex = () => {
        const newZIndex = zIndex - 1;
        handleZindex(id, newZIndex);
    };

    const handleBackgroundColorChange = (color: string) => {
        updateListSpecs(listData, id, gap, color, zIndex);
    };

    const handleBlur = (event: React.FocusEvent | MouseEvent) => {
        //setFocusedIndex(null);
    };

    const handleStyleChange = () => {
        handleListTextStyleChange({ content: 'New Content' });
    };

    useEffect(() => {
        handleTopTextBar(isEditing, focusedIndex !== null ? listData[focusedIndex] : listData[0], handleListTextStyleChange);
        handleContainerEditor(isEditing, { done: () => toggleEditing(id), colIncrease: undefined, colDecrease: undefined, rowIncrease: () => addList(), rowDecrease: () => removeList(), gapIncrease: undefined, gapDecrease: undefined, rowGapIncrease: () => updateListGap('increase'), rowGapDecrease: () => updateListGap('decrease'), increaseZIndex, reduceZIndex, deleteItem: () => handleDeleteItem(id), handleBackgroundColorChange, backgroundColor, id });
    }, [isEditing, focusedIndex, listData, gap]);




    return (
        <div style={{ ...styles.draggableChildCont, backgroundColor: backgroundColor }}>


            <div style={{ ...styles.draggableList, gap: gap, padding: isEditing ? '0px' : '1px' }}>
                {listData.map((item, index) => (
                    <div key={index} style={{ ...styles.row, height: item.height, backgroundColor: item.backgroundColor }} ref={el => resizeRefs.current[index] = el}>
                        <EditableText
                            textData={item}
                            isEditing={isEditing}
                            onFocus={() => setFocusedIndex(index)}
                            onBlur={handleBlur}
                            onChange={(newValue) => handleListItemChange(index, newValue)}
                        />
                        {isEditing && (
                            <div style={{ ...styles.resizeHandle, bottom: index !== (listData.length - 1) ? `calc(-16px - (${gap} * 0.5))` : "-16px" }} onMouseDown={(e) => handleListMouseDown(e, index)} >
                                <div style={styles.horzLine} />
                            </div>
                        )}
                    </div>
                ))}
            </div>
        </div>
    );
});

const styles = {
    draggableChildCont: {
        height: '100%',
        width: '100%',
        display: 'flex',
        justifyContent: 'center',
        overflow: "revert"
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
    colorBoxWrapper: {
        position: 'absolute',
        right: '-220px',
    } as React.CSSProperties,
    draggableList: {
        overflow: 'visible',
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        alignItems: 'center'
    } as React.CSSProperties,
    row: {
        position: 'relative',
        width: '100%',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
    } as React.CSSProperties,
    resizeHandle: {
        position: 'absolute',
        width: '100%',
        height: '16px',
        cursor: 'row-resize',
        backgroundColor: 'transparent',
        zIndex: 100
    } as React.CSSProperties,
    horzLine: {
        height: '1px',
        backgroundColor: 'black',
        width: '100%'
    } as React.CSSProperties,
};
