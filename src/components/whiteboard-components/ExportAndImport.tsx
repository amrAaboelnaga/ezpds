import React from 'react';
import { observer } from "mobx-react-lite";
import { rootStore } from '../../stores/rootStore';
import html2canvas from 'html2canvas';

interface ExportAndImportProps {
    page: React.RefObject<HTMLElement>;
}

const ExportAndImport: React.FC<ExportAndImportProps> = ({ page }) => {
    const { whiteBoardStore } = rootStore;

    // Function to handle reset
    const handleReset = () => {
        whiteBoardStore.setJsonSpecs({});
        whiteBoardStore.setProductInfo({ id: 0, title: '', price: '', category: '' });
    };

    // Function to handle export
    const handleExport = () => {
        if (!whiteBoardStore.productInfo.title || !whiteBoardStore.productInfo.price) {
            alert('Make shure you add title and price')
            return
        }
        const exportData = {
            productInfo: whiteBoardStore.productInfo,
            jsonSpecs: whiteBoardStore.jsonSpecs
        };
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
                        whiteBoardStore.setJsonSpecs(importedData.jsonSpecs);
                        whiteBoardStore.setProductInfo(importedData.productInfo);
                    }
                } catch (error) {
                    console.error('Error parsing imported JSON:', error);
                }
            };
            reader.readAsText(file);
        }
    };

    // Function to convert page to image and download
    const handlePageToImage = () => {
        if (page.current) {
            html2canvas(page.current, {
                scale: 1, // Increase scale for higher resolution
            }).then(canvas => {
                const link = document.createElement('a');
                link.href = canvas.toDataURL('image/png');
                link.download = `${whiteBoardStore.productInfo.title}.png`;
                link.click();
            }).catch(error => {
                console.error('Failed to capture page as image:', error);
            });
        }
    };

    return (
        <div style={styles.exportAndImportCont}>
            <button style={styles.extraButton} onClick={handleReset}>Reset</button>
            <button style={styles.exportButton} onClick={handleExport}>Export</button>
            <label style={styles.importButton}>
                Import
                <input type="file" accept=".json" onChange={handleImport} style={{ display: 'none' }} />
            </label>
            <button style={styles.extraButton} onClick={handlePageToImage}>Page to Image</button>
        </div>
    );
};

const styles = {
    exportAndImportCont: {
        display: 'flex',
        position: 'fixed',
        bottom: '100px',
        right: '50px',
        flexWrap: 'wrap',
        padding: '5px',
        borderRadius: '5px',
        backgroundColor: 'rgba(255, 255, 255, 0.9)',
        boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)',
        width: '200px',
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
