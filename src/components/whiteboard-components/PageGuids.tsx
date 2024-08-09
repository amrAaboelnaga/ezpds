import React, { useState, useCallback } from 'react';
import { observer } from 'mobx-react-lite';
import { rootStore } from '../../stores/rootStore';

const PageGuids: React.FC = () => {
    const { whiteBoardStore } = rootStore;

    const [dragging, setDragging] = useState<{ line: string; startX: number; startY: number } | null>(null);

    const handleMouseDown = (line: string, e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation(); // Prevents event from bubbling up to the parent elements
        setDragging({
            line,
            startX: e.clientX,
            startY: e.clientY
        });
        // Set visibility to true when dragging starts
        whiteBoardStore.setGuidLines({
            ...whiteBoardStore.guidLines,
            [`${line}Visb`]: true
        });
    };

    const handleDoubleClick = (line: string) => {
        // Reset the corresponding guideline to 50 on double-click
        whiteBoardStore.setGuidLines({
            ...whiteBoardStore.guidLines,
            [`${line}`]: 50
        });
    };

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (dragging) {
            const dx = e.clientX - dragging.startX;
            const dy = e.clientY - dragging.startY;

            const newGuidelines = { ...whiteBoardStore.guidLines };

            switch (dragging.line) {
                case 'top':
                    newGuidelines.top = Math.max(0, whiteBoardStore.guidLines.top + dy);
                    break;
                case 'bottom':
                    newGuidelines.bottom = Math.max(0, whiteBoardStore.guidLines.bottom - dy);
                    break;
                case 'left':
                    newGuidelines.left = Math.max(0, whiteBoardStore.guidLines.left + dx);
                    break;
                case 'right':
                    newGuidelines.right = Math.max(0, whiteBoardStore.guidLines.right - dx);
                    break;
            }

            whiteBoardStore.setGuidLines(newGuidelines);

            setDragging({
                ...dragging,
                startX: e.clientX,
                startY: e.clientY
            });
        }
    }, [dragging, whiteBoardStore]);

    const handleMouseUp = () => {
        if (dragging) {
            // Set visibility to false when dragging stops
            whiteBoardStore.setGuidLines({
                ...whiteBoardStore.guidLines,
                [`${dragging.line}Visb`]: false
            });
        }
        setDragging(null);
    };

    React.useEffect(() => {
        document.addEventListener('mousemove', handleMouseMove);
        document.addEventListener('mouseup', handleMouseUp);

        return () => {
            document.removeEventListener('mousemove', handleMouseMove);
            document.removeEventListener('mouseup', handleMouseUp);
        };
    }, [handleMouseMove]);

    return (
        <div style={styles.productInfoInputCont}>
            {/* Top line */}
            <div
                onMouseDown={(e) => handleMouseDown('top', e)}
                onDoubleClick={() => handleDoubleClick('top')}
                style={{ ...styles.boxRight, top: (whiteBoardStore.guidLines.top - 5), left: "-25px" }}
            />
            <div
                style={{ ...styles.line, ...styles.horz, top: whiteBoardStore.guidLines.top, backgroundColor: whiteBoardStore.guidLines.topVisb ? 'grey' : 'transparent' }}
                id='topLineGuid'
            />
            <div
                onMouseDown={(e) => handleMouseDown('top', e)}
                onDoubleClick={() => handleDoubleClick('top')}
                style={{ ...styles.boxLeft, top: (whiteBoardStore.guidLines.top - 5), right: "-25px" }}
            />
            {/* Right line */}
            <div
                onMouseDown={(e) => handleMouseDown('right', e)}
                onDoubleClick={() => handleDoubleClick('right')}
                style={{ ...styles.boxBottom, right: (whiteBoardStore.guidLines.right - 5), top: "-25px" }}
            />
            <div
                style={{ ...styles.line, ...styles.vert, right: whiteBoardStore.guidLines.right, backgroundColor: whiteBoardStore.guidLines.rightVisb ? 'grey' : 'transparent' }}
                id='rightLineGuid'
            />
            <div
                onMouseDown={(e) => handleMouseDown('right', e)}
                onDoubleClick={() => handleDoubleClick('right')}
                style={{ ...styles.boxTop, right: (whiteBoardStore.guidLines.right - 5), bottom: "-25px" }}
            />

            {/* Bottom line */}
            <div
                onMouseDown={(e) => handleMouseDown('bottom', e)}
                onDoubleClick={() => handleDoubleClick('bottom')}
                style={{ ...styles.boxRight, bottom: (whiteBoardStore.guidLines.bottom - 5), left: "-25px" }}
            />
            <div
                style={{ ...styles.line, ...styles.horz, bottom: whiteBoardStore.guidLines.bottom, backgroundColor: whiteBoardStore.guidLines.bottomVisb ? 'grey' : 'transparent' }}
                id='bottomLineGuid'
            />
            <div
                onMouseDown={(e) => handleMouseDown('bottom', e)}
                onDoubleClick={() => handleDoubleClick('bottom')}
                style={{ ...styles.boxLeft, bottom: (whiteBoardStore.guidLines.bottom - 5), right: "-25px" }}
            />

            {/* Left line */}
            <div
                onMouseDown={(e) => handleMouseDown('left', e)}
                onDoubleClick={() => handleDoubleClick('left')}
                style={{ ...styles.boxBottom, left: (whiteBoardStore.guidLines.left - 5), top: "-25px" }}
            />
            <div
                style={{ ...styles.line, ...styles.vert, left: whiteBoardStore.guidLines.left, backgroundColor: whiteBoardStore.guidLines.leftVisb ? 'grey' : 'transparent' }}
                id='leftLineGuid'
            />
            <div
                onMouseDown={(e) => handleMouseDown('left', e)}
                onDoubleClick={() => handleDoubleClick('left')}
                style={{ ...styles.boxTop, left: (whiteBoardStore.guidLines.left - 5), bottom: "-25px" }}
            />
            {/* Center vertical line */}
            <div
                style={{ ...styles.vert, ...styles.centerVert, backgroundColor: whiteBoardStore.guidLines.centerVisb ? 'grey' : 'transparent' }}
                id='centerVertGuidLine'
            />
        </div>
    );
};

const styles = {
    productInfoInputCont: {
        display: 'flex',
        position: 'absolute',
        width: '100%',
        height: '100%',
        left: '0px',
        top: '0px'
    } as React.CSSProperties,
    line: {
        position: 'absolute',
    } as React.CSSProperties,
    horz: {
        width: '100%',
        height: '1px',
        left: '0px',
    } as React.CSSProperties,
    vert: {
        width: '1px',
        height: '100%',
        top: '0px',
    } as React.CSSProperties,
    boxTop: {
        position: 'absolute',
        width: '0',
        height: '0',
        borderLeft: '5px solid transparent',
        borderRight: '5px solid transparent',
        borderBottom: '10px solid black',
    } as React.CSSProperties,
    boxBottom: {
        position: 'absolute',
        width: '0',
        height: '0',
        borderLeft: '5px solid transparent',
        borderRight: '5px solid transparent',
        borderTop: '10px solid black',
    } as React.CSSProperties,
    boxLeft: {
        position: 'absolute',
        width: '0',
        height: '0',
        borderTop: '5px solid transparent',
        borderBottom: '5px solid transparent',
        borderRight: '10px solid black',
    } as React.CSSProperties,
    boxRight: {
        position: 'absolute',
        width: '0',
        height: '0',
        borderTop: '5px solid transparent',
        borderBottom: '5px solid transparent',
        borderLeft: '10px solid black',
    } as React.CSSProperties,
    centerVert: {
        margin: 'auto'
    } as React.CSSProperties,
};

export default observer(PageGuids);
