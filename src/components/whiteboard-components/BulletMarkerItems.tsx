import React from "react";
const markers = [
    // Checks
    { class: "fa fa-check", label: "Check" },
    { class: "fa fa-check-circle", label: "Check Circle" },
    { class: "fa fa-check-square", label: "Check Square" },

    // Minuses
    { class: "fa fa-minus", label: "Minus" },
    { class: "fa fa-minus-circle", label: "Minus Circle" },
    { class: "fa fa-minus-square", label: "Minus Square" },

    // Arrows
    { class: "fa fa-arrow-left", label: "Arrow Left" },
    { class: "fa fa-arrow-right", label: "Arrow Right" },
    { class: "fa fa-arrow-circle-left", label: "Arrow Circle Left" },
    { class: "fa fa-arrow-circle-right", label: "Arrow Circle Right" },
    { class: "fa fa-long-arrow-alt-left", label: "Long Arrow Left" },
    { class: "fa fa-long-arrow-alt-right", label: "Long Arrow Right" },
    { class: "fa fa-caret-left", label: "Caret Left" },
    { class: "fa fa-caret-right", label: "Caret Right" },
    { class: "fa fa-caret-square-left", label: "Caret Square Left" },
    { class: "fa fa-caret-square-right", label: "Caret Square Right" },
    { class: "fa fa-angle-left", label: "Angle Left" },
    { class: "fa fa-angle-right", label: "Angle Right" },
    { class: "fa fa-angle-double-left", label: "Angle Double Left" },
    { class: "fa fa-angle-double-right", label: "Angle Double Right" },

    // Circles
    { class: "fa fa-circle", label: "Circle" },
    { class: "fa fa-circle-notch", label: "Circle Notch" },
    { class: "fa fa-dot-circle", label: "Dot Circle" },
    { class: "fa fa-stop-circle", label: "Stop Circle" },

    // Squares
    { class: "fa fa-square", label: "Square" },
    { class: "fa fa-square-full", label: "Square Full" },
    { class: "fa fa-caret-square-down", label: "Caret Square Down" },

    // Stars
    { class: "fa fa-star", label: "Star" },
    { class: "fa fa-star-half-alt", label: "Star Half" },

    // Diamonds
    { class: "fa fa-diamond", label: "Diamond" },

    // Miscellaneous
    { class: "fa fa-asterisk", label: "Asterisk" },
    { class: "fa fa-certificate", label: "Certificate" },
    { class: "fa fa-leaf", label: "Leaf" },
    { class: "fa fa-cube", label: "Cube" },
    { class: "fa fa-shield-alt", label: "Shield" },
    { class: "fa fa-hand-point-left", label: "Hand Point Left" },
    { class: "fa fa-hand-point-right", label: "Hand Point Right" },
    { class: "fa fa-bolt", label: "Bolt" },
    { class: "fa fa-bell", label: "Bell" },
    { class: "fa fa-play", label: "Play" },
];


interface BulletMarkerItemsProps {
    onMarkerSelect?: (markerClass: string) => void; // Callback for selecting a marker
}

export const BulletMarkerItems: React.FC<BulletMarkerItemsProps> = ({ onMarkerSelect }) => {
    return (
        <div style={styles.container}>
            {markers.map((marker) => (
                <div
                    key={marker.class}
                    style={styles.markerItem}
                    onClick={() => onMarkerSelect && onMarkerSelect(marker.class)} // When an icon is clicked, callback is triggered
                >
                    <i className={marker.class} style={styles.icon}></i>
                </div>
            ))}
            <br />
            <button onClick={() => onMarkerSelect && onMarkerSelect("")} style={{ margin: 'auto' }}>Remove</button>
        </div>
    );
};

const styles = {
    container: {
        display: "flex",
        flexWrap: "wrap",
        gap: "10px",
        backgroundColor: 'rgb(245, 245, 245)',

        zIndex: 500,
        padding: '10px',
        borderRadius: '8px',
        border: '1px solid grey'
    } as React.CSSProperties,
    markerItem: {
        justifyContent: 'center',
        width: '18px',
        display: "flex",
        alignItems: "center",
        cursor: "pointer",
        padding: "2px",
        borderRadius: "5px",
        border: "1px solid #ddd",
        backgroundColor: "#f9f9f9",
        transition: "background-color 0.3s",
    } as React.CSSProperties,
    icon: {
        fontSize: "12px",
    } as React.CSSProperties,

};
