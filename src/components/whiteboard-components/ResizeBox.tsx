import React, { useRef, useCallback, useEffect, useState } from 'react';
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

    const rotationStateRef = useRef<{
        initialMouseX: number;
        initialMouseY: number;
        initialRotation: number;
        centerX: number;
        centerY: number;
    } | null>(null);

    const isShiftPressedRef = useRef<boolean>(false);

    const handleKeyDown = useCallback((event: KeyboardEvent) => {
        if (event.key === 'Shift') {
            isShiftPressedRef.current = true;
            console.log('Shift key down');
        }
    }, []);

    const handleKeyUp = useCallback((event: KeyboardEvent) => {
        if (event.key === 'Shift') {
            isShiftPressedRef.current = false;
            console.log('Shift key up');
        }
    }, []);

    useEffect(() => {
        document.addEventListener('keydown', handleKeyDown);
        document.addEventListener('keyup', handleKeyUp);

        return () => {
            document.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('keyup', handleKeyUp);
        };
    }, [handleKeyDown, handleKeyUp]);

    const handleMouseDownResize = (event: React.MouseEvent, direction: string) => {
        event.preventDefault();
        resizeStateRef.current = {
            direction,
            initialMouseX: event.clientX,
            initialMouseY: event.clientY,
            initialWidth: parseFloat(whiteBoardStore.jsonSpecs[id].width),
            initialHeight: parseFloat(whiteBoardStore.jsonSpecs[id].height),
            initialLeft: whiteBoardStore.jsonSpecs[id].location.x,
            initialTop: whiteBoardStore.jsonSpecs[id].location.y,
        };
        console.log('Mouse down resize:', resizeStateRef.current);
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);
    };


    const handleMouseDownRotation = (event: React.MouseEvent) => {
        event.preventDefault();
        const rect = draggableRef.current!.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        rotationStateRef.current = {
            initialMouseX: event.clientX,
            initialMouseY: event.clientY,
            initialRotation: whiteBoardStore.jsonSpecs[id].rotation,
            centerX,
            centerY
        };
        document.addEventListener('mousemove', handleMouseMoveRotation);
        document.addEventListener('mouseup', handleMouseUpRotation);
    };

    const handleMouseMove = useCallback((event: MouseEvent) => {
        console.log('Mouse moving:', event.clientX, event.clientY);

        if (!resizeStateRef.current) return;

        const deltaX = event.clientX - resizeStateRef.current.initialMouseX;
        const deltaY = event.clientY - resizeStateRef.current.initialMouseY;

        let newWidth = resizeStateRef.current.initialWidth;
        let newHeight = resizeStateRef.current.initialHeight;
        let newLeft = resizeStateRef.current.initialLeft;
        let newTop = resizeStateRef.current.initialTop;

        const rotation = whiteBoardStore.jsonSpecs[id].rotation || 0;
        const centerX = resizeStateRef.current.initialLeft + resizeStateRef.current.initialWidth / 2;
        const centerY = resizeStateRef.current.initialTop + resizeStateRef.current.initialHeight / 2;

        if (rotation === 0) {
            // Resize logic for no rotation
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

            if (isShiftPressedRef.current) {
                const newSize = Math.min(newWidth, newHeight);
                if (resizeStateRef.current.direction.includes('top-left')) {
                    newTop += newHeight - newSize;
                    newLeft += newWidth - newSize;
                } else if (resizeStateRef.current.direction.includes('top-right')) {
                    newTop += newHeight - newSize;
                } else if (resizeStateRef.current.direction.includes('bottom-left')) {
                    newLeft += newWidth - newSize;
                }
                newWidth = newSize;
                newHeight = newSize;
            }
        } else {
            // Resize logic for rotated object
            const angle = (rotation * Math.PI) / 180;
            const cosAngle = Math.cos(angle);
            const sinAngle = Math.sin(angle);

            // Adjust delta values for rotation
            const deltaXAdjusted = deltaX * cosAngle - deltaY * sinAngle;
            const deltaYAdjusted = deltaX * sinAngle + deltaY * cosAngle;

            if (resizeStateRef.current.direction.includes('right')) {
                newWidth += deltaXAdjusted;
            }
            if (resizeStateRef.current.direction.includes('left')) {
                newLeft += deltaXAdjusted;
                newWidth -= deltaXAdjusted;
            }
            if (resizeStateRef.current.direction.includes('bottom')) {
                newHeight += deltaYAdjusted;
            }
            if (resizeStateRef.current.direction.includes('top')) {
                newTop += deltaYAdjusted;
                newHeight -= deltaYAdjusted;
            }

            if (isShiftPressedRef.current) {
                const newSize = Math.min(newWidth, newHeight);
                newWidth = newSize;
                newHeight = newSize;
            }

            // Adjust position to keep the center fixed
            newLeft = centerX - newWidth / 2;
            newTop = centerY - newHeight / 2;
        }

        // Debugging: Print updated values
        console.log('Updated Size:', newWidth, newHeight);
        console.log('Updated Position:', newLeft, newTop);

        const updatedSpecs = {
            ...whiteBoardStore.jsonSpecs,
            [id]: {
                ...whiteBoardStore.jsonSpecs[id],
                location: {
                    x: newLeft,
                    y: newTop
                },
                width: `${newWidth}px`,
                height: `${newHeight}px`,
            },
        };

        whiteBoardStore.setJsonSpecs(updatedSpecs);
    }, [id, whiteBoardStore]);




    const handleMouseMoveRotation = useCallback((event: MouseEvent) => {
        if (!rotationStateRef.current) return;

        const { initialMouseX, initialMouseY, initialRotation, centerX, centerY } = rotationStateRef.current;

        const currentX = event.clientX;
        const currentY = event.clientY;

        const angle1 = Math.atan2(initialMouseY - centerY, initialMouseX - centerX);
        const angle2 = Math.atan2(currentY - centerY, currentX - centerX);

        const angleDiff = angle2 - angle1;
        let newRotation = initialRotation + (angleDiff * 180) / Math.PI;

        // Normalize the rotation angle to the range [0, 360]
        newRotation = (newRotation + 360) % 360;

        // Snap to multiples of 45 degrees
        const snapTolerance = 5; // degrees
        const snapAngles = Array.from({ length: 8 }, (_, i) => i * 45); // [0, 45, 90, 135, 180, 225, 270, 315]
        for (let snapAngle of snapAngles) {
            if (Math.abs(newRotation - snapAngle) < snapTolerance) {
                newRotation = snapAngle;
                break;
            }
        }

        const updatedSpecs = {
            ...whiteBoardStore.jsonSpecs,
            [id]: {
                ...whiteBoardStore.jsonSpecs[id],
                rotation: newRotation
            },
        };

        whiteBoardStore.setJsonSpecs(updatedSpecs);
    }, [id, whiteBoardStore]);



    const handleMouseUp = useCallback(() => {
        resizeStateRef.current = null;
        console.log('Mouse up');
        document.removeEventListener('mousemove', handleMouseMove);
        document.removeEventListener('mouseup', handleMouseUp);
    }, [handleMouseMove]);

    const handleMouseUpRotation = useCallback(() => {
        rotationStateRef.current = null;
        console.log('Mouse up');
        document.removeEventListener('mousemove', handleMouseMoveRotation);
        document.removeEventListener('mouseup', handleMouseUpRotation);
    }, [handleMouseMoveRotation]);

    useEffect(() => {
        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
            document.removeEventListener('mousemove', handleMouseMoveRotation);
            document.removeEventListener('mouseup', handleMouseUpRotation);
        };
    }, [handleMouseMove, handleMouseUp, handleMouseMoveRotation, handleMouseUpRotation]);


    return (
        <

            >
            <div
                style={{ ...resizeHandleStyles.resizeHandle, ...resizeHandleStyles.topLeft }}
                onMouseDown={(e) => handleMouseDownResize(e, 'top-left')}
            />
            <div
                style={{ ...resizeHandleStyles.resizeHandle, ...resizeHandleStyles.rotator }}
                onMouseDown={handleMouseDownRotation}
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
            <div
                style={{ ...resizeHandleStyles.resizeHandle, ...resizeHandleStyles.top }}
                onMouseDown={(e) => handleMouseDownResize(e, 'top')}
            />
            <div
                style={{ ...resizeHandleStyles.resizeHandle, ...resizeHandleStyles.bottom }}
                onMouseDown={(e) => handleMouseDownResize(e, 'bottom')}
            />
            <div
                style={{ ...resizeHandleStyles.resizeHandle, ...resizeHandleStyles.left }}
                onMouseDown={(e) => handleMouseDownResize(e, 'left')}
            />
            <div
                style={{ ...resizeHandleStyles.resizeHandle, ...resizeHandleStyles.right }}
                onMouseDown={(e) => handleMouseDownResize(e, 'right')}
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
    rotator: {
        left: 'calc(50% - 4px)',
        top: '-50px',
        width: '8px',
        height: '8px',
        cursor: 'pointer',  // Adjust cursor as needed
    },
    top: {
        top: '-5px',
        left: '50%',
        transform: 'translateX(-50%)',
        cursor: 'ns-resize',
    },
    bottom: {
        bottom: '-5px',
        left: '50%',
        transform: 'translateX(-50%)',
        cursor: 'ns-resize',
    },
    left: {
        top: '50%',
        left: '-5px',
        transform: 'translateY(-50%)',
        cursor: 'ew-resize',
    },
    right: {
        top: '50%',
        right: '-5px',
        transform: 'translateY(-50%)',
        cursor: 'ew-resize',
    }
};
