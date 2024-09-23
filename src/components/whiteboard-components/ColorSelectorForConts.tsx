import React, { useEffect, useRef } from 'react';
import { RgbaColorPicker } from 'react-colorful';
import { observer } from 'mobx-react-lite';
import { rootStore } from '../../stores/rootStore';

interface ColorSelectorForContsProps {
  color: string;
  onChange: (color: string) => void;
  setShow: any;
}

// Helper to convert RGBA to Hex
const rgbaToHex = (r: number, g: number, b: number) => {
  const toHex = (x: number) => {
    const hex = x.toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  };
  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
};

// Helper to convert Hex to RGBA (assuming fully opaque by default)
const hexToRgba = (hex: string) => {
  const parsedHex = hex.replace('#', '');
  const r = parseInt(parsedHex.substring(0, 2), 16);
  const g = parseInt(parsedHex.substring(2, 4), 16);
  const b = parseInt(parsedHex.substring(4, 6), 16);
  return { r, g, b, a: 1 };
};

const parseRgbaString = (rgbaString: string) => {
  const match = rgbaString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
  if (match) {
    const [_, r, g, b, a] = match;
    return { r: parseInt(r), g: parseInt(g), b: parseInt(b), a: parseFloat(a) };
  }
  return { r: 0, g: 0, b: 0, a: 1 };
};

export const ColorSelectorForConts: React.FC<ColorSelectorForContsProps> = observer(({ color, onChange, setShow }) => {
  const { whiteBoardStore } = rootStore;
  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    whiteBoardStore.updateProjectColors();
  }, [color]);

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
  }, [setShow]);

  const handleColorChange = (color: { r: number; g: number; b: number; a: number }) => {
    const { r, g, b, a } = color;
    onChange(`rgba(${r},${g},${b},${a})`);
  };

  const handleHexChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const hexValue = e.target.value;
    const rgba = hexToRgba(hexValue);
    onChange(`rgba(${rgba.r},${rgba.g},${rgba.b},${rgba.a})`);
  };

  const currentColor = parseRgbaString(color);
  const hexColor = rgbaToHex(currentColor.r, currentColor.g, currentColor.b);

  return (
    <div ref={componentRef} style={styles.ColorBoxCont}>
      <div style={styles.inputCont}>
        <input
          type="text"
          value={hexColor}
          onChange={handleHexChange}
          style={styles.input}
        />
        <input
          type="text"
          value={color}
          onChange={(e) => onChange(e.target.value)}
          style={styles.input}
        />
      </div>
      <RgbaColorPicker
        color={parseRgbaString(color)}
        onChange={(color) => handleColorChange(color)}
      />
      <div style={styles.palletsCont}>
        {whiteBoardStore.projectColors.map((color, index) => (
          <div
            onClick={() => onChange(color)}
            key={index}
            style={{
              ...styles.pallet,
              backgroundColor: color,
            }}
          />
        ))}
      </div>
    </div>
  );
});

const styles = {
  ColorBoxCont: {
    display: 'flex',
    position: 'relative',
    flexDirection: 'column',
  } as React.CSSProperties,
  palletsCont: {
    marginTop: '3px',
    display: 'flex',
    maxWidth: '200px',
    gap: '3px',
    flexWrap: 'wrap',
    justifyContent: 'center',
  } as React.CSSProperties,
  pallet: {
    width: '19px',
    height: '19px',
    borderRadius: '50%',
    border: '1px solid black',
  } as React.CSSProperties,
  inputCont: {
    display: 'grid',
    width: '100%',
    gridTemplateRows: '100%',
    gridTemplateColumns: '62px 133px',
    gap: '3px'
  } as React.CSSProperties,
  input: {
    marginBottom: '3px',
    paddingLeft: "2px",
    borderRadius: '4px',
    border: '1px solid #ccc',
  } as React.CSSProperties,
};
