import React, { useState } from "react";

interface TextEditButtonProps {
  option: string;
  value: string;
  currentValue: string;
  toggleValue?: string;
  description?: string;
  iconClass?: string;
  onClick: (option: string, value: string) => void;
  text?: string;
  otherFunc?: any;
}

const TextEditButton: React.FC<TextEditButtonProps> = ({ option, value, currentValue, toggleValue, description, iconClass, onClick, text, otherFunc }) => {
  const [showDescription, setShowDescription] = useState(false);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    if (otherFunc) {
      e.preventDefault();
      otherFunc();
      return;
    }
    if (toggleValue) {
      onClick(option, currentValue === value ? toggleValue : value);
    } else {
      onClick(option, value);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    setMousePosition({
      x: e.clientX,
      y: e.clientY,
    });
  };

  return (
    <div onMouseDown={(e) => e.preventDefault()} onMouseOver={() => setShowDescription(true)} onMouseOut={() => setShowDescription(false)} onMouseMove={handleMouseMove}>
      {showDescription && description && (
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
      <div style={currentValue === value ? { ...styles.box, ...styles.inEffect } : styles.box} onClick={(e) => handleClick(e)} className="textEditButton">
        {text && text}
        {iconClass && <i className={iconClass}></i>}
      </div>
    </div>
  );
};

const styles = {
  box: {
    width: "25px",
    height: "25px",
    padding: "5px",
    borderRadius: "4px",
    boxShadow: "0 0px 2px rgba(0, 0, 0, 0.2)",
    cursor: "pointer",
    transition: "background-color 0.3s",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  } as React.CSSProperties,
  inEffect: {
    transform: "scale(0.95)",
    backgroundColor: "#dadada",
  } as React.CSSProperties,
  descriptionContainer: {
    position: "fixed", // Fixed positioning for the description
    backgroundColor: "#f0f0f0",
    border: "1px solid #ccc",
    borderRadius: "4px",
    padding: "2px 5px",
    boxShadow: "0 0px 2px rgba(0, 0, 0, 0.2)",
    whiteSpace: "nowrap",
    userSelect: "none",
    pointerEvents: "none", // Prevents interaction with the tooltip
    zIndex: 999,
  } as React.CSSProperties,
  description: {
    fontSize: "12px",
    margin: 0,
  } as React.CSSProperties,
};

export default TextEditButton;
