import React, { useState, useRef, useEffect, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { useWhiteBoardHandlers } from '../../../handlers/whiteBoardHandlers';

import { EditableText } from '../EditableText';
import { TextEditorBar } from '../TextEditorBar';
import { ColorSelectorForConts } from '../ColorSelectorForConts';
import { defaultText, DraggableListInterface, Text } from '../../../types/whiteBoard';


interface DraggableListProps {
    id: string;
    standardSpecs: DraggableListInterface;
    listData: Text[];
    toggleEditing: (pageId: number, id: string) => void;
    focusedIndex: any;
    setFocusedIndex: any;
    draggableRef: React.RefObject<HTMLDivElement>,
    pageId: number
}



export const DraggableList: React.FC<DraggableListProps> = observer(({ pageId, id, standardSpecs, listData, toggleEditing, focusedIndex, setFocusedIndex, draggableRef }) => {
    const { useHandleListMouseDown, useHandleContainerEditorBar, useAddList, useRemoveList, useHandleListItemChange, useChangeListRowHeight, useUpdateListGap, useHandleListTextStyleChange, useDeleteItem, useUpdateListSpecs, useHandleTopTextBar, useZIndexHandler } = useWhiteBoardHandlers();
    const { rowHeight, padding, gap, backgroundColor, isEditing, border, borderColor, borderRadius, zIndex } = standardSpecs
    const resizeRefs = useRef<(HTMLDivElement | null)[]>([]);
    const handleDeleteItem = useDeleteItem();
    const updateListSpecs = useUpdateListSpecs();
    const handleTopTextBar = useHandleTopTextBar();

    const handleContainerEditor = useHandleContainerEditorBar();
    const addList = useAddList(pageId, listData, id, gap, backgroundColor, zIndex, updateListSpecs, defaultText);
    const removeList = useRemoveList(pageId, listData, id, gap, backgroundColor, zIndex, updateListSpecs);
    const handleListItemChange = useHandleListItemChange(pageId, listData, id, gap, backgroundColor, zIndex, updateListSpecs);
    const changeListRowHeight = useChangeListRowHeight();
    const updateListGap = useUpdateListGap(pageId, listData, id, gap, backgroundColor, zIndex, updateListSpecs);
    const handleListTextStyleChange = useHandleListTextStyleChange(pageId, listData, id, gap, backgroundColor, zIndex, updateListSpecs, focusedIndex);
    const handleListMouseDown = useHandleListMouseDown(pageId, id, resizeRefs, changeListRowHeight);



    const getBorderStyle = (index: number, totalItems: number): React.CSSProperties => {
        let style: any = {};

        if (index === 0) {
            // Top border for the first item
            style.borderTopLeftRadius = borderRadius;
            style.borderTopRightRadius = borderRadius;
        }
        if (index === totalItems - 1) {
            // Bottom border for the last item
            style.borderBottomLeftRadius = borderRadius;
            style.borderBottomRightRadius = borderRadius;
        }

        return style;
    };

    const handleBlur = (event: React.FocusEvent | MouseEvent) => {
        //setFocusedIndex(null);
    };

    useEffect(() => {
        handleTopTextBar(isEditing, focusedIndex !== null ? listData[focusedIndex] : listData[0], handleListTextStyleChange);
        handleContainerEditor(isEditing, { pageId: pageId, done: () => toggleEditing(pageId, id), rowIncrease: () => addList(), rowDecrease: () => removeList(), rowGapIncrease: () => updateListGap('increase'), rowGapDecrease: () => updateListGap('decrease'), deleteItem: () => handleDeleteItem(pageId, id), id });
    }, [isEditing, standardSpecs, focusedIndex]);




    return (
        <div style={{
            ...styles.draggableChildCont, backgroundColor: backgroundColor,
            border: `${border}px solid ${borderColor}`,
            borderRadius: borderRadius,
            padding: padding
        }}>
            <div style={{ ...styles.draggableList, gap: gap, padding: isEditing ? '0px' : '1px', borderRadius: borderRadius }}>
                {listData.map((item, index) => (
                    <div
                        key={index}
                        style={{
                            ...getBorderStyle(index, listData.length),
                            ...styles.row,
                            height: rowHeight[index]?.height || '50px',
                            backgroundColor: item.backgroundColor
                        }}
                        ref={el => resizeRefs.current[index] = el as HTMLDivElement}
                    >
                        <EditableText
                            textData={item}
                            isEditing={isEditing}
                            onFocus={() => setFocusedIndex(index)}
                            onBlur={handleBlur}
                            onChange={(newValue) => handleListItemChange(index, newValue)}
                        />
                        {isEditing && (
                            <div style={{ ...styles.resizeHandle, bottom: index !== (listData.length - 1) ? `calc(-16px - (${gap} * 0.5))` : "-16px" }}
                                onMouseDown={(e) => handleListMouseDown(e, index, draggableRef, 5)}
                            >
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
        display: 'flex',
        flexDirection: 'column',
        width: '100%',
        height: '100%',
        alignItems: 'center',
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
