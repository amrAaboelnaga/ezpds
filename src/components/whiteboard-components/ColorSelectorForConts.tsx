import React, { useEffect, useState } from 'react';
import { RgbaColorPicker } from 'react-colorful';
import { observer } from 'mobx-react-lite';

interface ColorSelectorForContsProps {
  color: string;
  onChange: (color: string) => void;
}

const parseRgbaString = (rgbaString: string) => {
  const match = rgbaString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+),\s*([\d.]+)\)/);
  if (match) {
    const [_, r, g, b, a] = match;
    return { r: parseInt(r), g: parseInt(g), b: parseInt(b), a: parseFloat(a) };
  }
  return { r: 0, g: 0, b: 0, a: 1 };
};

export const ColorSelectorForConts: React.FC<ColorSelectorForContsProps> = observer(({ color, onChange }) => {
  const [selectedColor, setSelectedColor] = useState(parseRgbaString(color));

  const handleColorChange = (color: { r: number; g: number; b: number; a: number }) => {
    const { r, g, b, a } = color;
    onChange(`rgba(${r},${g},${b},${a})`);
  };

  useEffect(() => {
    handleColorChange(selectedColor);
  }, [selectedColor]);

  return (
    <div style={styles.ColorBoxCont}>
      <RgbaColorPicker
        color={selectedColor}
        onChange={setSelectedColor}
      />
    </div>
  );
});

const styles = {
  ColorBoxCont: {
    display: 'flex',
    position: 'relative',
  } as React.CSSProperties,
};
