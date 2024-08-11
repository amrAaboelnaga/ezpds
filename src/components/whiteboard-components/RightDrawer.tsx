import React, { useEffect, useRef, useState } from 'react';
import { observer } from "mobx-react-lite";
import { rootStore } from '../../stores/rootStore';
import { categories } from '../../handlers/marketHandlers';
import ExportAndImport from './ExportAndImport';
import ProductInfoBox from './productInfoBox';


const RightDrawer: React.FC = () => {
    const { whiteBoardStore } = rootStore;
    const componentRef = useRef<HTMLDivElement>(null);
    const [showObject, setshowObject] = useState(false)


    useEffect(() => {
        try {
            const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
                if (componentRef.current && !componentRef.current.contains(event.target as Node)) {
                    setshowObject(false);
                }
            };

            const isTouchDevice = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
            const clickEvent = isTouchDevice ? 'touchstart' : 'mousedown';

            document.addEventListener(clickEvent, handleOutsideClick);

            return () => {
                document.removeEventListener(clickEvent, handleOutsideClick);
            };
        } catch (e) {
            console.error(e);
        }
    }, []);
    return (
        <div onMouseOver={() => setshowObject(true)} ref={componentRef} style={{ ...styles.rightDrawerCont, right: showObject ? '-10px' : '-180px' }}>
            <ProductInfoBox />
            <div style={{ height: '10px' }} />
            <ExportAndImport />
        </div>
    );
};

const styles = {
    rightDrawerCont: {
        display: 'flex',
        position: 'fixed',
        top: '100px',
        flexWrap: 'wrap',
        padding: '10px',
        borderRadius: '5px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        width: '200px',
    } as React.CSSProperties,
    productLabel: {
        marginBottom: '5px',
        fontSize: '12px',
        fontWeight: 'bold',
    } as React.CSSProperties,
    input: {
        margin: '5px 0',
        padding: '8px',
        width: '100%',
        borderRadius: '3px',
        border: '1px solid #ccc',
        boxSizing: 'border-box',
    } as React.CSSProperties,
    select: {
        margin: '5px 0',
        padding: '8px',
        width: '100%',
        borderRadius: '3px',
        border: '1px solid #ccc',
        boxSizing: 'border-box',
    } as React.CSSProperties,
    addPageButon: {
        margin: '5px 0',
        padding: '8px',
        width: '100%',
        borderRadius: '3px',
        border: '1px solid #ccc',
        boxSizing: 'border-box',
    } as React.CSSProperties,
};

export default observer(RightDrawer);
