import React, { useRef, useCallback, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { rootStore } from '../../stores/rootStore';

interface ResizeBoxProps {
    id: string;
    draggableRef: React.RefObject<HTMLDivElement>;
}

export const ResizeBox: React.FC<ResizeBoxProps> = observer(({ id, draggableRef }) => {
    const { whiteBoardStore } = rootStore;
    const resizeStateRef = useRef<{
        direction: string;
        initialMouseX: number;
        initialMouseY: number;
        initialWidth: number;
        initialHeight: number;
        initialLeft: number;
        initialTop: number;
    } | null>(null);

    const handleMouseDownResize = (event: React.MouseEvent, direction: string) => {
        event.preventDefault();
        const rect = draggableRef.current!.getBoundingClientRect();
        resizeStateRef.current = {
            direction,
            initialMouseX: event.clientX,
            initialMouseY: event.clientY,
            initialWidth: rect.width,
            initialHeight: rect.height,
            initialLeft: whiteBoardStore.jsonSpecs[id].location.x,
            initialTop: whiteBoardStore.jsonSpecs[id].location.y,
        };
        console.log('Mouse down:', resizeStateRef.current);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };

    const handleMouseMove = useCallback((event: MouseEvent) => {
        if (!resizeStateRef.current) return;

        const deltaX = event.clientX - resizeStateRef.current.initialMouseX;
        const deltaY = event.clientY - resizeStateRef.current.initialMouseY;

        let newWidth = resizeStateRef.current.initialWidth;
        let newHeight = resizeStateRef.current.initialHeight;
        let newLeft = resizeStateRef.current.initialLeft;
        let newTop = resizeStateRef.current.initialTop;

        if (resizeStateRef.current.direction.includes('right')) {
            newWidth += deltaX;
        }
        if (resizeStateRef.current.direction.includes('left')) {
            newLeft += deltaX;
            newWidth -= deltaX;
        }
        if (resizeStateRef.current.direction.includes('bottom')) {
            newHeight += deltaY;
        }
        if (resizeStateRef.current.direction.includes('top')) {
            newTop += deltaY;
            newHeight -= deltaY;
        }

        const updatedSpecs = {
            ...whiteBoardStore.jsonSpecs,
            [id]: {
                ...whiteBoardStore.jsonSpecs[id],
                location: {
                    x: newLeft,
                    y: newTop
                },
                width: `${newWidth}px`,
                height: `${newHeight}px`
            },
        };

        console.log('Updated specs:', updatedSpecs);
        whiteBoardStore.setJsonSpecs(updatedSpecs);
    }, [id, whiteBoardStore]);

    const handleMouseUp = useCallback(() => {
        resizeStateRef.current = null;
        console.log('Mouse up');
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    }, [handleMouseMove]);

    useEffect(() => {
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [handleMouseMove, handleMouseUp]);

    return (
        <>
            <div
                style={{ ...resizeHandleStyles.resizeHandle, ...resizeHandleStyles.topLeft }}
                onMouseDown={(e) => handleMouseDownResize(e, 'top-left')}
            />
            <div
                style={{ ...resizeHandleStyles.resizeHandle, ...resizeHandleStyles.topRight }}
                onMouseDown={(e) => handleMouseDownResize(e, 'top-right')}
            />
            <div
                style={{ ...resizeHandleStyles.resizeHandle, ...resizeHandleStyles.bottomLeft }}
                onMouseDown={(e) => handleMouseDownResize(e, 'bottom-left')}
            />
            <div
                style={{ ...resizeHandleStyles.resizeHandle, ...resizeHandleStyles.bottomRight }}
                onMouseDown={(e) => handleMouseDownResize(e, 'bottom-right')}
            />
        </>
    );
});

const resizeHandleStyles = {
    resizeHandle: {
        position: 'absolute' as const,
        width: '8px',
        height: '8px',
        borderRadius: '50%' as const,
        backgroundColor: '#000',
    },
    topLeft: {
        top: '-5px',
        left: '-5px',
        cursor: 'nwse-resize',
    },
    topRight: {
        top: '-5px',
        right: '-5px',
        cursor: 'nesw-resize',
    },
    bottomLeft: {
        bottom: '-5px',
        left: '-5px',
        cursor: 'nesw-resize',
    },
    bottomRight: {
        bottom: '-5px',
        right: '-5px',
        cursor: 'nwse-resize',
    },
};
