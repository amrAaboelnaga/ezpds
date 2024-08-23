import React, { useState } from 'react';

interface LeftToolBarSingleButtonProps {
    item: string;
    onDragStart: (event: React.DragEvent<HTMLDivElement>, itemType: string) => void;
}

const LeftToolBarSingleButton: React.FC<LeftToolBarSingleButtonProps> = ({ item, onDragStart }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    let iconClass = '';
    let svgElement: JSX.Element | null = null;

    switch (item) {
        case 'Text':
            iconClass = 'fa fa-font';
            break;
        case 'Image':
            iconClass = 'fa fa-image';
            break;
        case 'List':
            iconClass = 'fa fa-list';
            break;
        case 'Table':
            iconClass = 'fa fa-table';
            break;
        case 'Rectangle':
            svgElement = (
                <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                    <rect width="14" height="14" x="1" y="1" stroke="black" strokeWidth="1" fill="none" />
                </svg>
            );
            break;
        case 'Circle':
            svgElement = (
                <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                    <circle cx="8" cy="8" r="7" stroke="black" strokeWidth="1" fill="none" />
                </svg>
            );
            break;
        case 'Triangle':
            svgElement = (
                <svg width="16" height="16" xmlns="http://www.w3.org/2000/svg">
                    <polygon points="8,2 14,14 2,14" stroke="black" strokeWidth="1" fill="none" />
                </svg>
            );
            break;
        default:
            iconClass = 'fa fa-question';
            break;
    }

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        setMousePosition({
            x: e.clientX,
            y: e.clientY,
        });
    };

    return (
        <div>
            {isHovered && (
                <div
                    style={{
                        ...styles.descriptionContainer,
                        top: mousePosition.y + 10, // Offset by 10px below the mouse
                        left: mousePosition.x + 10, // Offset by 10px to the right of the mouse
                    }}
                >
                    <p style={styles.description}>{item}</p>
                </div>
            )}
            <div
                style={{ ...styles.singleLeftButton, ...(isHovered ? styles.hoverEffect : {}) }}
                draggable
                onDragStart={(e) => { onDragStart(e, item); setIsHovered(false); }}
                onMouseEnter={() => setIsHovered(true)}
                onMouseLeave={() => setIsHovered(false)}
                onMouseMove={handleMouseMove}
            >
                {svgElement ? svgElement : <i className={iconClass}></i>}
            </div>
        </div>

    );
};

const styles = {
    singleLeftButton: {
        margin: '20px 0',
        backgroundColor: '#e0e0e0',
        width: '40px',
        height: '40px',
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'grab',
        textAlign: 'center',
        transition: 'background-color 0.3s, transform 0.3s',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        fontSize: '16px',
        color: '#333',
        position: 'relative', // Needed for correct positioning of tooltip
    } as React.CSSProperties,
    hoverEffect: {
        backgroundColor: '#d0d0d0',
        transform: 'scale(1.1)',
    } as React.CSSProperties,
    descriptionContainer: {
        position: 'fixed', // Fixed positioning for the description
        backgroundColor: '#f0f0f0',
        border: '1px solid #ccc',
        borderRadius: '4px',
        padding: '2px 5px',
        boxShadow: '0 0px 2px rgba(0, 0, 0, 0.2)',
        whiteSpace: 'nowrap',
        userSelect: 'none',
        pointerEvents: 'none', // Prevents interaction with the tooltip
        zIndex: 999,
    } as React.CSSProperties,
    description: {
        fontSize: '12px',
        margin: 0,
    } as React.CSSProperties,
};

export default LeftToolBarSingleButton;
