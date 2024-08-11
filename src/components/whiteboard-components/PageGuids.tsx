import React, { useState, useCallback, useEffect } from 'react';
import { observer } from 'mobx-react-lite';
import { rootStore } from '../../stores/rootStore';

interface PageGuidsProps {
    pageId: number;
}

const PageGuids: React.FC<PageGuidsProps> = ({ pageId }) => {
    const { whiteBoardStore } = rootStore;
    const [dragging, setDragging] = useState<{ line: string; startX: number; startY: number } | null>(null);

    // Get the current page's guidelines
    const page = whiteBoardStore.pages.find(page => page.id === pageId);
    const guidLines = page ? page.guidLines : {
        left: 50,
        leftVisb: false,
        top: 50,
        topVisb: false,
        right: 50,
        rightVisb: false,
        bottom: 50,
        bottomVisb: false,
        centerVisb: false
    };

    const handleMouseDown = (line: string, e: React.MouseEvent<HTMLDivElement>) => {
        e.stopPropagation(); // Prevents event from bubbling up to the parent elements
        setDragging({
            line,
            startX: e.clientX,
            startY: e.clientY
        });
        // Set visibility to true when dragging starts
        whiteBoardStore.setGuidLines({
            ...guidLines,
            [`${line}Visb`]: true
        }, pageId);
    };

    const handleDoubleClick = (line: string) => {
        // Reset the corresponding guideline to 50 on double-click
        whiteBoardStore.setGuidLines({
            ...guidLines,
            [`${line}`]: 50
        }, pageId);
    };

    const handleMouseMove = useCallback((e: MouseEvent) => {
        if (dragging) {
            const dx = e.clientX - dragging.startX;
            const dy = e.clientY - dragging.startY;

            const newGuidelines = { ...guidLines };

            switch (dragging.line) {
                case 'top':
                    newGuidelines.top = Math.max(0, guidLines.top + dy);
                    break;
                case 'bottom':
                    newGuidelines.bottom = Math.max(0, guidLines.bottom - dy);
                    break;
                case 'left':
                    newGuidelines.left = Math.max(0, guidLines.left + dx);
                    break;
                case 'right':
                    newGuidelines.right = Math.max(0, guidLines.right - dx);
                    break;
            }

            whiteBoardStore.setGuidLines(newGuidelines, pageId);

            setDragging({
                ...dragging,
                startX: e.clientX,
                startY: e.clientY
            });
        }
    }, [dragging, guidLines, pageId, whiteBoardStore]);

    const handleMouseUp = () => {
        if (dragging) {
            // Set visibility to false when dragging stops
            whiteBoardStore.setGuidLines({
                ...guidLines,
                [`${dragging.line}Visb`]: false
            }, pageId);
        }
        setDragging(null);
    };

    useEffect(() => {
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
                style={{ ...styles.boxRight, top: (guidLines.top - 5), left: "-25px" }}
                id={`page${pageId}topLineGuid`}
            />
            <div
                style={{ ...styles.line, ...styles.horz, top: guidLines.top, backgroundColor: guidLines.topVisb ? 'grey' : 'transparent' }}
                id={`page${pageId}topLineGuid`}
            />
            <div
                onMouseDown={(e) => handleMouseDown('top', e)}
                onDoubleClick={() => handleDoubleClick('top')}
                style={{ ...styles.boxLeft, top: (guidLines.top - 5), right: "-25px" }}
                id={`page${pageId}topLineGuid`}
            />
            {/* Right line */}
            <div
                onMouseDown={(e) => handleMouseDown('right', e)}
                onDoubleClick={() => handleDoubleClick('right')}
                style={{ ...styles.boxBottom, right: (guidLines.right - 5), top: "-25px" }}
                id={`page${pageId}rightLineGuid`}
            />
            <div
                style={{ ...styles.line, ...styles.vert, right: guidLines.right, backgroundColor: guidLines.rightVisb ? 'grey' : 'transparent' }}
                id={`page${pageId}rightLineGuid`}
            />
            <div
                onMouseDown={(e) => handleMouseDown('right', e)}
                onDoubleClick={() => handleDoubleClick('right')}
                style={{ ...styles.boxTop, right: (guidLines.right - 5), bottom: "-25px" }}
                id={`page${pageId}rightLineGuid`}
            />

            {/* Bottom line */}
            <div
                onMouseDown={(e) => handleMouseDown('bottom', e)}
                onDoubleClick={() => handleDoubleClick('bottom')}
                style={{ ...styles.boxRight, bottom: (guidLines.bottom - 5), left: "-25px" }}
                id={`page${pageId}bottomLineGuid`}
            />
            <div
                style={{ ...styles.line, ...styles.horz, bottom: guidLines.bottom, backgroundColor: guidLines.bottomVisb ? 'grey' : 'transparent' }}
                id={`page${pageId}bottomLineGuid`}
            />
            <div
                onMouseDown={(e) => handleMouseDown('bottom', e)}
                onDoubleClick={() => handleDoubleClick('bottom')}
                style={{ ...styles.boxLeft, bottom: (guidLines.bottom - 5), right: "-25px" }}
                id={`page${pageId}bottomLineGuid`}
            />

            {/* Left line */}
            <div
                onMouseDown={(e) => handleMouseDown('left', e)}
                onDoubleClick={() => handleDoubleClick('left')}
                style={{ ...styles.boxBottom, left: (guidLines.left - 5), top: "-25px" }}
                id={`page${pageId}leftLineGuid`}
            />
            <div
                style={{ ...styles.line, ...styles.vert, left: guidLines.left, backgroundColor: guidLines.leftVisb ? 'grey' : 'transparent' }}
                id={`page${pageId}leftLineGuid`}
            />
            <div
                onMouseDown={(e) => handleMouseDown('left', e)}
                onDoubleClick={() => handleDoubleClick('left')}
                style={{ ...styles.boxTop, left: (guidLines.left - 5), bottom: "-25px" }}
                id={`page${pageId}leftLineGuid`}
            />
            {/* Center vertical line */}
            <div
                style={{ ...styles.vert, ...styles.centerVert, backgroundColor: guidLines.centerVisb ? 'grey' : 'transparent' }}
                id={`page${pageId}centerVertGuidLine`}
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
