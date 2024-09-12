import React, { useEffect, useRef, useState } from 'react';
import { RgbaColorPicker } from 'react-colorful';
import { observer } from 'mobx-react-lite';
import { rootStore } from '../../stores/rootStore';

interface ColorSelectorForContsProps {
  color: string;
  onChange: (color: string) => void;
  setShow: any
}

const parseRgbaString = (rgbaString: string) => {
  const match = rgbaString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
  if (match) {
    const [_, r, g, b, a] = match;
    return { r: parseInt(r), g: parseInt(g), b: parseInt(b), a: parseFloat(a) };
  }
  return { r: 0, g: 0, b: 0, a: 1 };
};

export const ColorSelectorForConts: React.FC<ColorSelectorForContsProps> = observer(({ color, onChange, setShow }) => {
  const { whiteBoardStore } = rootStore
  const componentRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    whiteBoardStore.updateProjectColors()
    console.log(whiteBoardStore.projectColors)
  }, [color])

  useEffect(() => {
    try {
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
    } catch (e) {
      console.error(e);
    }
  }, []);

  const handleColorChange = (color: { r: number; g: number; b: number; a: number }) => {
    const { r, g, b, a } = color;
    onChange(`rgba(${r},${g},${b},${a})`);
  };

  return (
    <div ref={componentRef} style={styles.ColorBoxCont}>
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
    flexDirection: 'column'

  } as React.CSSProperties,
  palletsCont: {
    marginTop: '3px',
    display: 'flex',
    maxWidth: '200px',
    gap: '3px',
    flexWrap: 'wrap',
    justifyContent: 'center'
  } as React.CSSProperties,
  pallet: {
    width: '19px',
    height: '19px',
    borderRadius: '50%',
    border: '1px solid black'
  } as React.CSSProperties,
};
