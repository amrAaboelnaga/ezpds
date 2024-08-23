import React, { useState } from 'react';

interface ContainerEditorSingleButtonProps {
    iconClass?: string;
    imageSrc?: string;
    description: string;
    onClick: () => void;
}

const ContainerEditorSingleButton: React.FC<ContainerEditorSingleButtonProps> = ({ iconClass, imageSrc, description, onClick }) => {
    const [isHovered, setIsHovered] = useState(false);
    const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

    const handleMouseEnter = () => {
        setIsHovered(true);
    };

    const handleMouseLeave = () => {
        setIsHovered(false);
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        setMousePosition({
            x: e.clientX,
            y: e.clientY,
        });
    };

    return (
        <div
            style={{ position: 'relative' }}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
            onMouseMove={handleMouseMove}
        >
            {isHovered && (
                <div
                    style={{
                        ...styles.descriptionContainer,
                        top: mousePosition.y + 10, // Offset by 10px below the mouse
                        left: mousePosition.x + 10, // Offset by 10px to the right of the mouse
                    }}
                >
                    <p style={styles.description}>{description}</p>
                </div>
            )}
            <div
                className='textEditButton'
                style={{ ...styles.singleButton, backgroundColor: !iconClass && !imageSrc ? "transparent" : "" }}
                onClick={onClick}
            >
                {imageSrc && !iconClass && (
                    <img src={imageSrc} alt={description} style={styles.image} />
                )}
                {!imageSrc && iconClass && (
                    <i className={iconClass}></i>
                )}
                {imageSrc && iconClass && (
                    <i style={styles.iconClass} className={iconClass}>
                        <img src={imageSrc} alt={description} style={{ ...styles.image, ...styles.innerImage }} />
                    </i>
                )}
            </div>
        </div>
    );
};

const styles = {
    singleButton: {
        margin: '0px 0px',
        width: '25px',
        height: '25px',
        borderRadius: '8px',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        cursor: 'pointer',
        textAlign: 'center',
        transition: 'background-color 0.3s, transform 0.3s',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        fontSize: '16px',
        color: '#333',
        position: 'relative',
        zIndex: 1,   
    } as React.CSSProperties,
    iconClass: {} as React.CSSProperties,
    descriptionContainer: {
        position: 'fixed',  // Fixed positioning for the description
        backgroundColor: '#f0f0f0',
        border: '1px solid #ccc',
        borderRadius: '4px',
        padding: '2px 5px',
        boxShadow: '0 0px 2px rgba(0, 0, 0, 0.2)',
        whiteSpace: 'nowrap',
        userSelect: 'none',
        pointerEvents: 'none',  // Prevents interaction with the tooltip
        zIndex: 10,
    } as React.CSSProperties,
    description: {
        fontSize: '12px',
        margin: 0,
        zIndex: 11,
        color: 'black'
    } as React.CSSProperties,
    image: {
        maxWidth: '100%',
        maxHeight: '100%',
        padding: '4px',
        zIndex: 1,
    } as React.CSSProperties,
    innerImage: {
        position: 'absolute',
        top: '0px',
        left: '0px',
        zIndex: 1,
    } as React.CSSProperties,
};

export default ContainerEditorSingleButton;
