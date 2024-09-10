import React from "react";
import { ranges } from "../../types/market";

interface CategoriesAlphabetizedProps {
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
  handleSearch: any;
}

const categoryRanges = ["A-C", "D-F", "G-I", "J-L", "M-O", "P-R", "S-U", "V-Z"];

const CategoriesAlphabetized: React.FC<CategoriesAlphabetizedProps> = ({ selectedCategories, setSelectedCategories, handleSearch }) => {
  const handleCheckboxChange = (range: string) => {
    setSelectedCategories((prevSelected) => {
      // Ensure the range exists
      const allLettersInRange = ranges[range] || [];
      const isRangeSelected = prevSelected.some((item) => allLettersInRange.includes(item));

      if (isRangeSelected) {
        // Unselecting the range: remove all letters in the range from selected categories
        return prevSelected.filter((item) => !allLettersInRange.includes(item));
      } else {
        // Selecting the range: add all letters in the range to selected categories
        return [...prevSelected, ...allLettersInRange];
      }
    });
  };

  // Determine if any letter in the range is selected
  const isRangeChecked = (range: string) => {
    const letters = ranges[range];
    return letters ? letters.some((letter) => selectedCategories.includes(letter)) : false;
  };

  return (
    <div style={styles.container}>
      <h3 style={styles.title}>Categories Alphabetized</h3>
      <div style={styles.checkboxContainer}>
        {categoryRanges.map((range) => (
          <div key={range} style={styles.checkboxItem}>
            <input type="checkbox" id={range} checked={isRangeChecked(range)} onChange={() => handleCheckboxChange(range)} style={styles.checkbox} />
            <label htmlFor={range} style={styles.label}>
              {range}
            </label>
          </div>
        ))}
      </div>
    </div>
  );
};

const styles = {
  container: {
    marginBottom: "20px",
  } as React.CSSProperties,
  title: {
    fontSize: "18px",
    fontWeight: "bold",
    marginBottom: "10px",
  } as React.CSSProperties,
  checkboxContainer: {
    display: "flex",
    flexDirection: "column",
    gap: "10px",
  } as React.CSSProperties,
  checkboxItem: {
    display: "flex",
    alignItems: "center",
    gap: "5px",
  } as React.CSSProperties,
  checkbox: {
    cursor: "pointer",
  } as React.CSSProperties,
  label: {
    cursor: "pointer",
  } as React.CSSProperties,
};

export default CategoriesAlphabetized;
