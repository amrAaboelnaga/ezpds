import React from 'react';
import { observer } from "mobx-react-lite";
import { rootStore } from '../../stores/rootStore';
import { handlePagesToImage, handlePrintSelectedDivs } from '../../handlers/whiteBoardHandlers';


interface ExportAndImportProps {
    isExporting: boolean; // New prop
    setIsExporting: React.Dispatch<React.SetStateAction<boolean>>; // Function to update exporting state
}

const ExportAndImport: React.FC<ExportAndImportProps> = ({ isExporting, setIsExporting }) => {
    const { whiteBoardStore } = rootStore;

    // Function to handle reset
    const handleReset = () => {
        whiteBoardStore.setTextEditor(null, null)
        whiteBoardStore.setContainerEditor(null)
        whiteBoardStore.setTextEditor(null, null)
        whiteBoardStore.resetPages();
        whiteBoardStore.setProductInfo({ id: 0, title: '', price: '', category: '' });
    };

    // Function to handle export
    const handleExportJson = () => {
        if (!whiteBoardStore.productInfo.title || !whiteBoardStore.productInfo.price) {
            alert('Make shure you add title and price')
            return
        }
        const exportData = { pages: whiteBoardStore.pages, productInfo: whiteBoardStore.productInfo }

        const dataStr = JSON.stringify(exportData, null, 2);
        const dataUri = 'data:application/json;charset=utf-8,' + encodeURIComponent(dataStr);

        const exportFileDefaultName = `${whiteBoardStore.productInfo.title || 'data'}.json`;

        const linkElement = document.createElement('a');
        linkElement.setAttribute('href', dataUri);
        linkElement.setAttribute('download', exportFileDefaultName);
        linkElement.click();
    };

    // Function to handle import
    const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                const content = e.target?.result;
                try {
                    if (typeof content === 'string') {
                        const importedData = JSON.parse(content);
                        whiteBoardStore.importProject(importedData)
                    }
                } catch (error) {
                    console.error('Error parsing imported JSON:', error);
                }
            };
            reader.readAsText(file);
        }
    };

    return (
        <div style={styles.exportAndImportCont}>
            <button style={styles.extraButton} onClick={handleReset}>Reset</button>
            <button style={styles.exportButton} onClick={handleExportJson}>Export as Json</button>
            <button style={styles.exportButton} onClick={() => handlePrintSelectedDivs(whiteBoardStore, setIsExporting)}>Export PDF</button>
            <button style={styles.extraButton} onClick={() => handlePagesToImage(whiteBoardStore, setIsExporting)}>Export as Images</button>
            <label style={styles.importButton}>
                Import
                <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
            </label>

        </div>
    );
};

const styles = {
    exportAndImportCont: {
        display: 'flex',
        position: 'relative',
        flexWrap: 'wrap',
        padding: '5px',
        borderRadius: '5px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        width: '200px',
        zIndex: 9999
    } as React.CSSProperties,
    exportButton: {
        backgroundColor: 'rgb(228, 228, 228)',
        color: 'black',
        border: '2px solid black',
        padding: '5px 10px',
        margin: '3px',
        borderRadius: '5px',
        cursor: 'pointer',
        flex: 1,
        textAlign: 'center',
        transition: 'background-color 0.3s, color 0.3s',
    } as React.CSSProperties,
    importButton: {
        backgroundColor: 'rgb(228, 228, 228)',
        color: 'black',
        border: '2px solid black',
        padding: '5px 10px',
        margin: '3px',
        borderRadius: '5px',
        cursor: 'pointer',
        flex: 1,
        textAlign: 'center',
        transition: 'background-color 0.3s, color 0.3s',
    } as React.CSSProperties,
    extraButton: {
        backgroundColor: 'rgb(228, 228, 228)',
        color: 'black',
        border: '2px solid black',
        padding: '10px 20px',
        margin: '3px',
        borderRadius: '5px',
        cursor: 'pointer',
        width: '100%',
        transition: 'background-color 0.3s, color 0.3s',
    } as React.CSSProperties,
};

export default observer(ExportAndImport);
