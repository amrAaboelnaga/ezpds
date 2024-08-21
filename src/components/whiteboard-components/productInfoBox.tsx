import React from 'react';
import { observer } from "mobx-react-lite";
import { rootStore } from '../../stores/rootStore';
import { categories } from '../../handlers/marketHandlers';


const ProductInfoBox: React.FC = () => {
    const { whiteBoardStore } = rootStore;

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
        const { name, value } = e.target;
        whiteBoardStore.setProductInfo({
            ...whiteBoardStore.productInfo,
            [name]: value
        });
    };

    return (
        <div style={styles.productInfoInputCont}>
            <p style={styles.productLabel}>Product Title:</p>
            <input
                type="text"
                name="title"
                value={whiteBoardStore.productInfo.title}
                onChange={handleInputChange}
                placeholder="Title"
                style={styles.input}
            />
            <p style={styles.productLabel}>Price:</p>
            <input
                type="text"
                name="price"
                value={whiteBoardStore.productInfo.price}
                onChange={handleInputChange}
                placeholder="Price"
                style={styles.input}
            />
            <p style={styles.productLabel}>Category:</p>
            <select
                name="category"
                value={whiteBoardStore.productInfo.category}
                onChange={handleInputChange}
                style={styles.select}
            >
                {categories.map((cat) => (
                    <option key={cat.value} value={cat.value}>
                        {cat.label}
                    </option>
                ))}
            </select>
        </div>
    );
};

const styles = {
    productInfoInputCont: {
        display: 'flex',
        position: 'relative',
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

export default observer(ProductInfoBox);
