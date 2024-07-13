import React from 'react';


interface ResizeBoxProps {
    handleMouseDownResize: (event: React.MouseEvent<HTMLDivElement>, direction: string) => void;
}

export function ResizeBox({ handleMouseDownResize }: ResizeBoxProps) {
    return (
        <>
            <div style={{ ...resizeHandleStyles.resizeHandle, ...resizeHandleStyles.topLeft }} onMouseDown={(e) => handleMouseDownResize(e, 'topleft')} />
            <div style={{ ...resizeHandleStyles.resizeHandle, ...resizeHandleStyles.topRight }} onMouseDown={(e) => handleMouseDownResize(e, 'topright')} />
            <div style={{ ...resizeHandleStyles.resizeHandle, ...resizeHandleStyles.bottomLeft }} onMouseDown={(e) => handleMouseDownResize(e, 'bottomleft')} />
            <div style={{ ...resizeHandleStyles.resizeHandle, ...resizeHandleStyles.bottomRight }} onMouseDown={(e) => handleMouseDownResize(e, 'bottomright')} />
        </>
    );
}


const resizeHandleStyles = {
    resizeHandle: {
        position: 'absolute' as const,
        width: '10px',
        height: '10px',
        backgroundColor: '#000',
    },
    top: {
        top: '-5px',
        left: '50%',
        transform: 'translateX(-50%)',
        cursor: 'ns-resize',
        /* Cursor for top resize */
    },
    bottom: {
        bottom: '-5px',
        left: '50%',
        transform: 'translateX(-50%)',
        cursor: 'ns-resize',
        /* Cursor for bottom resize */
    },
    left: {
        top: '50%',
        left: '-5px',
        transform: 'translateY(-50%)',
        cursor: 'ew-resize',
        /* Cursor for left resize */
    },
    right: {
        top: '50%',
        right: '-5px',
        transform: 'translateY(-50%)',
        cursor: 'ew-resize',
        /* Cursor for right resize */
    },
    topLeft: {
        top: '-5px',
        left: '-5px',
        cursor: 'nwse-resize',
        /* Cursor for top-left corner resize */
    },
    topRight: {
        top: '-5px',
        right: '-5px',
        cursor: 'nesw-resize',
        /* Cursor for top-right corner resize */
    },
    bottomLeft: {
        bottom: '-5px',
        left: '-5px',
        cursor: 'nesw-resize',
        /* Cursor for bottom-left corner resize */
    },
    bottomRight: {
        bottom: '-5px',
        right: '-5px',
        cursor: 'nwse-resize',
        /* Cursor for bottom-right corner resize */
    },
};
