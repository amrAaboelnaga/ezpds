import React, { useState } from 'react';
import { whiteBoardStore } from '../../stores/whiteBoardStore';
import MiniPage from './MiniPage';

interface SingleSmallPageContProps {
    index: number;
    isActive: boolean;
    onScroll: (e: React.MouseEvent<HTMLDivElement, MouseEvent>, pageId: number) => void;
}

const SingleSmallPageCont: React.FC<SingleSmallPageContProps> = ({ index, isActive, onScroll }) => {
    const [showPlus, setShowPlus] = useState(false);
    const [hoveredIcon, setHoveredIcon] = useState<{ x: number; y: number; description: string | null }>({
        x: 0,
        y: 0,
        description: null,
    });

    const handleMouseMove = (event: any, description: string) => {
        setHoveredIcon({ x: event.clientX, y: event.clientY, description });
    };

    const handleMouseLeave = () => {
        setHoveredIcon({ x: 0, y: 0, description: null });
    };

    return (
        <div
            style={styles.singleSmallPageCont}
            onMouseEnter={() => setShowPlus(true)}
            onMouseLeave={() => setShowPlus(false)}
        >
            {showPlus && (
                <div >
                    <i onMouseMove={(e) => handleMouseMove(e, 'NEW Page BEFORE current page')} onMouseLeave={handleMouseLeave} onClick={() => whiteBoardStore.addPageBefore(index)} className="fa fa-plus textEditButton" style={styles.plusPage}></i>
                    <i onMouseMove={(e) => handleMouseMove(e, 'DUPLICATE current page & ADD the copy BEFORE')} onMouseLeave={handleMouseLeave} onClick={() => whiteBoardStore.copyPageBefore(index)} className="fa fa-copy textEditButton" style={styles.plusPage}></i>
                </div>
            )}
            <div
                onClick={(e) => onScroll(e, index)}
                style={{
                    ...styles.singleSmallPage,
                    border: isActive ? '2px solid blue' : ''
                }}
            >
                <div style={{ transform: 'scale(0.095)', display: 'flex' }}>
                    <MiniPage index={index} />
                </div>
                <p style={styles.miniPageNumber}>{index + 1}</p>
            </div>
            {showPlus && (
                <i
                    onClick={() => whiteBoardStore.deletePage(index)}
                    className="fa fa-trash textEditButton"
                    style={styles.deletePage}
                    onMouseLeave={handleMouseLeave}
                    onMouseMove={(e) => handleMouseMove(e, 'Delete current page')}
                ></i>
            )}
            {showPlus && (
                <div >
                    <i onMouseLeave={handleMouseLeave} onMouseMove={(e) => handleMouseMove(e, 'NEW Page AFTER current page')} onClick={() => whiteBoardStore.addPageAfter(index)} className="fa fa-plus textEditButton" style={styles.plusPage}></i>
                    <i onMouseLeave={handleMouseLeave} onMouseMove={(e) => handleMouseMove(e, 'DUPLICATE this page & ADD the copy AFTER')} onClick={() => whiteBoardStore.copyPageAfter(index)} className="fa fa-copy textEditButton" style={styles.plusPage}></i>
                </div>
            )}

            {hoveredIcon.description && (
                <div
                    style={{
                        ...styles.descriptionContainer,
                        top: hoveredIcon.y + 10,
                        left: hoveredIcon.x + 10
                    }}
                >
                    {hoveredIcon.description}
                </div>
            )}
        </div>
    );
};

const styles = {
    singleSmallPageCont: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        marginBottom: '5px',
        position: 'relative'
    } as React.CSSProperties,
    singleSmallPage: {
        border: '2px solid transparent',
        width: '21mm',
        height: '29.7mm',
        textAlign: 'center',
        backgroundColor: '#FFF',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        position: 'relative',
        cursor: 'pointer',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'all 0.2s ease',
        flexShrink: 0
    } as React.CSSProperties,
    plusPage: {
        borderRadius: '3px',
        padding: '3px',
        transform: 'scale(0.7)',
        cursor: "pointer"
    } as React.CSSProperties,
    deletePage: {
        borderRadius: '3px',
        padding: '3px',
        transform: 'scale(0.7)',
        position: 'absolute',
        bottom: '22px',
        right: '2px',
        cursor: "pointer"
    } as React.CSSProperties,
    miniPageNumber: {
        position: 'absolute',
        fontSize: '12px',
        bottom: '-11px',
        left: 'calc(50% - 3px)'
    } as React.CSSProperties,
    descriptionContainer: {
        position: 'fixed',
        backgroundColor: '#f9f9f9',
        border: '1px solid #ddd',
        padding: '5px',
        borderRadius: '3px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        zIndex: 1000,
        fontSize: '12px',
        color: '#333',
    } as React.CSSProperties,
};

export default SingleSmallPageCont;
