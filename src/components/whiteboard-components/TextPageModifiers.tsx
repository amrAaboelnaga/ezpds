import React from 'react';
import { observer } from 'mobx-react-lite';
import { rootStore } from '../../stores/rootStore';
import { DraggableImageInterface, DraggableListInterface, DraggableTableInterface, DraggableTextInterface } from '../../types/whiteBoard';
import TextTextModifier from './TextOnly/TextTextModifier';
import ListTextModifier from './TextOnly/ListTextModifier';
import ImageLinkModifier from './TextOnly/ImageLinkModifier';
import TableTextModifier from './TextOnly/TableTextModifier';

const TextPageModifiers: React.FC = () => {
    const { whiteBoardStore } = rootStore;
    const currentPageInView = whiteBoardStore.currentPage;
    const currentPageItems = whiteBoardStore.pages[currentPageInView];
    const jsonSpecs = currentPageItems?.jsonSpecs || {};

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

    return (
        <div
            style={{
                ...styles.textModifiersCont,
                top: whiteBoardStore.textContent ? '80px' : '50px',
                maxHeight: `calc(100vh - ${whiteBoardStore.textContent ? '80px' : '50px'})`,
            }}
        >
            {Object.keys(whiteBoardStore.pages[0].jsonSpecs).map((id) => {
                if (whiteBoardStore.pages[0].jsonSpecs[id].repeate === true) {
                    return (
                        renderContent(whiteBoardStore.pages[0].jsonSpecs[id], id, 0)
                    );
                }
            })}
            {Object.keys(jsonSpecs).map((id) => {
                if (jsonSpecs[id].repeate === false) {
                    return (
                        renderContent(jsonSpecs[id], id, currentPageInView)
                    );
                }
            })}

        </div>
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
        backgroundColor: '#f4f4f4',
        boxShadow: '0 2px 6px rgba(0, 0, 0, 0.1)',
        transition: 'all 0.3s',
        overflowY: 'auto',
        scrollbarWidth: 'none',
        msOverflowStyle: 'none',
        maxWidth: '600px',
        zIndex: 900
    } as React.CSSProperties,
};

export default observer(TextPageModifiers);
