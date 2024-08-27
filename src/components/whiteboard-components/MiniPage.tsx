import React, { useEffect, useRef, useState } from 'react';
import { observer } from 'mobx-react-lite';
import { DraggableItem } from './DraggableItem';
import ContainerEditor from './ContainerEditor';
import PageGuids from './PageGuids';
import RulerComponent from './RulerComponent';
import { useWhiteBoardHandlers } from '../../handlers/whiteBoardHandlers';
import { rootStore } from "../../stores/rootStore";
import { DraggableRepeate } from './DraggableRepeate';

interface MiniPageProps {
    index: number; // Add index prop
}

const MiniPage: React.FC<MiniPageProps> = ({ index }) => {
    const { whiteBoardStore } = rootStore;
    const { useHandleDrop, useHandleDragOver, useToggleEditing } = useWhiteBoardHandlers();
    const [showItems, setShowItems] = useState(false)
    const pageRef = useRef<HTMLDivElement>(null);
    const handleDrop = useHandleDrop();
    const handleDragOver = useHandleDragOver();
    const toggleEditing = useToggleEditing();

    useEffect(() => {
        const page = pageRef.current;
        const options: IntersectionObserverInit = { root: null, rootMargin: '0px', threshold: [0.01, 0.7] }; // Multiple thresholds
        const handleIntersection = (entries: IntersectionObserverEntry[]) => {
            entries.forEach((entry) => {
                // Check which threshold was crossed
                if (entry.isIntersecting) {
                    if (entry.intersectionRatio >= 0.5) {
                        whiteBoardStore.setCurrentPage(index)
                    } else if (entry.intersectionRatio <= 0.6) {
                        // console.log('no page slected');
                    }
                    if (entry.intersectionRatio <= 0.01) {
                        setShowItems(false);
                    } else if (entry.intersectionRatio >= 0.01) {
                        setShowItems(true);
                    }

                } else {

                }
            });
        };
        const observer = new IntersectionObserver(handleIntersection, options);
        if (page) {
            observer.observe(page);
        }
        return () => {
            if (page) {
                observer.unobserve(page);
            }
        };
    }, []);


    const currentPage = whiteBoardStore.pages[index];
    const jsonSpecs = currentPage?.jsonSpecs || {};
    //console.log(jsonSpecs)
    return (
        <div ref={pageRef} style={{ ...styles.workSpaceFile }} onDrop={(e) => handleDrop(e, index)} onDragOver={handleDragOver}>
            {Object.keys(jsonSpecs).map((id) => {
                if (jsonSpecs[id].repeate === false) {
                    return (
                        <DraggableItem
                            key={id}
                            id={id}
                            itemSpecs={jsonSpecs[id]}
                            toggleEditing={toggleEditing}
                            pageId={index}
                            inMini={true}
                        />
                    );
                }
            })}
            {Object.keys(whiteBoardStore.pages[0].jsonSpecs).map((id) => {
                if (whiteBoardStore.pages[0].jsonSpecs[id].repeate === true) {
                    return (
                        <DraggableRepeate
                            key={id}
                            id={id}
                            itemSpecs={whiteBoardStore.pages[0].jsonSpecs[id]}
                            toggleEditing={toggleEditing}
                            pageId={index}
                            inMini={true}
                        />
                    );
                }
            })}
            <div style={styles.miniCover} />
        </div>
    );
};

const styles = {
    workSpaceFile: {
        width: '210mm',
        height: '297mm',
        backgroundColor: 'white',
        position: 'relative',
        padding: '1px'
    } as React.CSSProperties,
    miniCover: {
        width: '210mm',
        height: '297mm',
        zIndex: '9000',
        position: 'absolute',
        left: '0px',
        top: '0px'
    } as React.CSSProperties,
    rulerHider: {
        position: 'absolute',
        bottom: '0px',
        left: '-45px',
        width: '20px',
        height: '20px',
        backgroundColor: 'rgb(214, 214, 214)',
    } as React.CSSProperties,
    delPageButton: {
        position: 'absolute',
        top: '0px',
        right: '-100px',
        width: '60px',
        height: '40px',
        borderRadius: '10px'
    } as React.CSSProperties,
};

export default observer(MiniPage);
