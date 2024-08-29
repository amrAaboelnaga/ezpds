import React, { useEffect, useLayoutEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { rootStore } from '../../stores/rootStore';
import { DraggableImageInterface, DraggableListInterface, DraggableTableInterface, DraggableTextInterface } from '../../types/whiteBoard';
import TextTextModifier from './TextOnly/TextTextModifier';
import ListTextModifier from './TextOnly/ListTextModifier';
import ImageLinkModifier from './TextOnly/ImageLinkModifier';
import TableTextModifier from './TextOnly/TableTextModifier';
import { useWhiteBoardHandlers } from '../../handlers/whiteBoardHandlers';

const TextPageModifiers: React.FC = () => {
    const { whiteBoardStore } = rootStore;
    const { useDeleteItem, useUpdateStandards } = useWhiteBoardHandlers();
    const handleDeleteItem = useDeleteItem();
    const currentPageInView = whiteBoardStore.currentPage;
    const currentPageItems = whiteBoardStore.pages[currentPageInView];
    const jsonSpecs = currentPageItems?.jsonSpecs || {};
    const componentRef = useRef<HTMLDivElement>(null);
    const [show, setShow] = useState(false);
    const [contentChangeTrigger, setContentChangeTrigger] = useState(0);
    const [hoveredIcon, setHoveredIcon] = useState<{ x: number; y: number; description: string } | null>(null);
    const updateStandards = useUpdateStandards();

    const handleRepeateState = (pageId: number, objId: string, repeateState: boolean, type: string) => {
        updateStandards(pageId, objId, undefined, undefined, undefined, undefined, undefined, undefined, undefined, !repeateState);

        try {
            if (pageId !== 0) {
                const id = `Repeated-${type}-${Object.keys(whiteBoardStore.pages[0]?.jsonSpecs || {}).length}`;
                const newRepeatable = { [id]: whiteBoardStore.pages[pageId].jsonSpecs[objId] };
                console.log(newRepeatable)
                whiteBoardStore.addObjectToPage(0, newRepeatable);
                handleDeleteItem(pageId, objId)
            }
        } catch (error) {
            console.log(error);
        }
    };

    useEffect(() => {
        const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
            if (componentRef.current && !componentRef.current.contains(event.target as Node)) {
                setShow(false);
            }
        };

        const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
        const clickEvent = isTouchDevice ? 'touchstart' : 'mousedown';

        document.addEventListener(clickEvent, handleOutsideClick);

        return () => {
            document.removeEventListener(clickEvent, handleOutsideClick);
        };
    }, []);

    useLayoutEffect(() => {
    }, [whiteBoardStore.pages, whiteBoardStore.textContent]);

    const renderContent = (itemSpecs: any, id: string, pageId: number) => {
        switch (itemSpecs.type) {
            case 'Text':
            case 'Rectangle':
            case 'Triangle':
            case 'Circle': {
                const textSpecs = itemSpecs as DraggableTextInterface;
                return <TextTextModifier key={id} id={id} standardSpecs={textSpecs} pageId={pageId} />;
            }
            case 'List': {
                const listSpecs = itemSpecs as DraggableListInterface;
                return <ListTextModifier key={id} id={id} standardSpecs={listSpecs} pageId={pageId} />;
            }
            case 'Image': {
                const imageSpecs = itemSpecs as DraggableImageInterface;
                return <ImageLinkModifier key={id} id={id} standardSpecs={imageSpecs} pageId={pageId} />;
            }
            case 'Table': {
                const tableSpecs = itemSpecs as DraggableTableInterface;
                return <TableTextModifier key={id} id={id} standardSpecs={tableSpecs} pageId={pageId} />;
            }
            default:
                return null;
        }
    };

    const handleMouseMove = (event: React.MouseEvent<HTMLElement>, description: string) => {
        setHoveredIcon({ x: event.clientX, y: event.clientY, description });
    };

    const handleIconLeave = () => {
        setHoveredIcon(null);
    };

    return (
        <div
            ref={componentRef}
            style={{
                ...styles.textModifiersCont,
                bottom: show ? "10px" : 'calc(100vh - 50px)',
                height: 'calc(100vh - 60px)',
            }}
        >
            <p style={styles.pageEdetingText}>EDETING PAGE {currentPageInView + 1}:</p>
            {Object.keys(whiteBoardStore.pages[0].jsonSpecs).map((id, index) => {
                if (whiteBoardStore.pages[0].jsonSpecs[id]?.repeate === true && whiteBoardStore.pages[0].jsonSpecs[id].type !== 'PageNumber') {
                    return (
                        <div key={index} style={styles.textOnlyCardCont}>
                            {renderContent(whiteBoardStore.pages[0].jsonSpecs[id], id, 0)}
                            <i
                                onClick={() => { handleDeleteItem(0, id) }}
                                onMouseMove={(e) => handleMouseMove(e, "Delete Item")}
                                onMouseLeave={handleIconLeave}
                                className="fa fa-trash textEditButton"
                                style={styles.icon}
                            ></i>
                        </div>
                    )
                }
            })}
            {Object.keys(jsonSpecs).map((id, index) => {
                if (jsonSpecs[id].repeate === false) {
                    return (
                        <div key={index} style={styles.textOnlyCardCont}>
                            {renderContent(jsonSpecs[id], id, currentPageInView)}
                            <div style={{ ...styles.textOnlyCardCont, flexDirection: 'column' }}>
                                <i
                                    onClick={() => { handleRepeateState(currentPageInView, id, jsonSpecs[id].repeate, jsonSpecs[id].type) }}
                                    onMouseMove={(e) => handleMouseMove(e, "Repeat Item on All Pages")}
                                    onMouseLeave={handleIconLeave}
                                    className="fa fa-repeat textEditButton"
                                    style={styles.icon}
                                ></i>
                                <i
                                    onClick={() => { handleDeleteItem(currentPageInView, id) }}
                                    onMouseMove={(e) => handleMouseMove(e, "Delete Item")}
                                    onMouseLeave={handleIconLeave}
                                    className="fa fa-trash textEditButton"
                                    style={styles.icon}
                                ></i>
                            </div>
                        </div>
                    )
                }
            })}
            {
                !show && (
                    <div
                        onClick={() => { setShow(true); setHoveredIcon(null) }}
                        style={{ ...styles.directTextOpener, top: whiteBoardStore.textContent ? "80px" : "50px" }}
                        onMouseMove={(e) => handleMouseMove(e, "Quick Edit all text on currunt page.")}
                        onMouseLeave={handleIconLeave}
                    >
                        <i className="fa fa-edit " style={styles.icon}></i>
                        <p style={styles.text}>Quick Edit</p>
                    </div>
                )
            }

            {
                hoveredIcon && (
                    <div
                        style={{
                            ...styles.descriptionContainer,
                            top: hoveredIcon.y + 10,
                            left: hoveredIcon.x + 10,
                        }}
                    >
                        <p style={styles.description}>{hoveredIcon.description}</p>
                    </div>
                )
            }
        </div >
    );
};

const styles = {
    textModifiersCont: {
        display: 'flex',
        flexDirection: 'column',
        position: 'fixed',
        left: '195px',
        padding: '10px',
        paddingBottom: '0px',
        borderBottomRightRadius: '8px',
        borderBottomLeftRadius: '8px',
        backgroundColor: '#f4f4f4',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s',
        overflowY: 'auto',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        zIndex: 900,
    } as React.CSSProperties,
    textOnlyCardCont: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '10px',
    } as React.CSSProperties,
    pageEdetingText: {
        textDecoration: "underline",
        margin: '0px',
        marginBottom: '10px',
        fontWeight: 'bold',
    } as React.CSSProperties,
    directTextOpener: {
        position: 'fixed',
        display: 'flex',
        alignItems: 'center',
        backgroundColor: 'white',
        padding: '10px',
        borderRadius: '5px',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        cursor: 'pointer',
        transition: 'all 0.4s',
        width: 'fit-content',
        margin: '10px',
        textAlign: 'center',
        left: '190px',
    } as React.CSSProperties,
    icon: {
        fontSize: '20px',
        color: '#333',
        marginRight: '8px',
        borderRadius: '3px',
        padding: '4px',
        transform: 'scale(0.7)',
        cursor: "pointer",

    } as React.CSSProperties,
    text: {
        fontSize: '14px',
        fontWeight: '500',
        color: '#333',
        margin: '0',
    } as React.CSSProperties,
    descriptionContainer: {
        position: 'fixed',
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
        color: '#333',
    } as React.CSSProperties,
};

export default observer(TextPageModifiers);
