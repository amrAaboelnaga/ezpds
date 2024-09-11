import React, { useEffect, useRef, useState } from "react";
import { observer } from "mobx-react-lite";
import { rootStore } from "../../stores/rootStore";
import { categories, useMarketHandlers } from "../../handlers/marketHandlers";
import CategoriesAlphabetized from "./CategoriesAlphabetized";

interface MarketFilterProps {
  includeImage: boolean;
  setIncludeImage: React.Dispatch<React.SetStateAction<boolean>>;
  searchTerm: string;
  setSearchTerm: React.Dispatch<React.SetStateAction<string>>;
  category: string;
  setCategory: React.Dispatch<React.SetStateAction<string>>;
  minPrice: string;
  setMinPrice: React.Dispatch<React.SetStateAction<string>>;
  maxPrice: string;
  setMaxPrice: React.Dispatch<React.SetStateAction<string>>;
  latest: boolean;
  setLatest: React.Dispatch<React.SetStateAction<boolean>>;
  maxProductsPerPage: number;
  selectedCategories: string[];
  setSelectedCategories: React.Dispatch<React.SetStateAction<string[]>>;
}

export const MarketFilter: React.FC<MarketFilterProps> = observer(
  ({
    includeImage,
    setIncludeImage,
    searchTerm,
    setSearchTerm,
    category,
    setCategory,
    minPrice,
    setMinPrice,
    maxPrice,
    setMaxPrice,
    latest,
    setLatest,
    maxProductsPerPage,
    selectedCategories,
    setSelectedCategories,
  }) => {
    const { fetchFirstProductsPage } = useMarketHandlers();
    const { marketStore } = rootStore;
    const componentRef = useRef<HTMLDivElement>(null);
    const [showObject, setshowObject] = useState(false);

    useEffect(() => {
      try {
        const handleOutsideClick = (event: MouseEvent | TouchEvent) => {
          if (componentRef.current && !componentRef.current.contains(event.target as Node)) {
            setshowObject(false);
          }
        };

        const isTouchDevice = "ontouchstart" in window || navigator.maxTouchPoints > 0;
        const clickEvent = isTouchDevice ? "touchstart" : "mousedown";

        document.addEventListener(clickEvent, handleOutsideClick);

        return () => {
          document.removeEventListener(clickEvent, handleOutsideClick);
        };
      } catch (e) {
        console.error(e);
      }
    }, []);

    const handleSearch = async () => {
      console.log(selectedCategories);
      marketStore.clearProducts(); // Clear existing products in the store
      await fetchFirstProductsPage(searchTerm, category, minPrice, maxPrice, latest, maxProductsPerPage, selectedCategories); // Fetch products for the first page
    };

    return (
      <div ref={componentRef} style={{ ...styles.filterContainer, left: showObject ? "0px" : "-250px" }}>
        <i onClick={() => setshowObject(true)} style={{ ...styles.filterOpener }} className="fa fa-filter"></i>
        <input type="text" placeholder="Category" value={category} onChange={(e) => setCategory(e.target.value)} style={styles.input} />
        <CategoriesAlphabetized selectedCategories={selectedCategories} setSelectedCategories={setSelectedCategories} handleSearch={handleSearch} />
        <input type="number" placeholder="Min Price" value={minPrice} onChange={(e) => setMinPrice(e.target.value)} style={styles.input} />
        <input type="number" placeholder="Max Price" value={maxPrice} onChange={(e) => setMaxPrice(e.target.value)} style={styles.input} />

        <div style={styles.multiButtonCont}>
          <i onClick={() => setIncludeImage(!includeImage)} className="fa fa-image"></i>
          <label>
            <input type="checkbox" checked={latest} onChange={(e) => setLatest(e.target.checked)} />
            Latest
          </label>
        </div>
        <button onClick={handleSearch} style={styles.button}>
          Apply filter
        </button>
      </div>
    );
  }
);

const styles = {
  filterContainer: {
    position: "fixed",
    display: "flex",
    flexDirection: "column",
    left: "0px",
    top: "50px",
    gap: "10px",
    height: "100%",
    marginBottom: "20px",
    flexWrap: "wrap",
    alignItems: "center",
    backgroundColor: "#fff",
    padding: "20px",
    borderRadius: "10px",
    boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
  } as React.CSSProperties,
  multiButtonCont: {
    display: "flex",
    gap: "10px",
    alignItems: "center",
  } as React.CSSProperties,
  input: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    outline: "none",
    transition: "border-color 0.3s",
    width: "100%",
  } as React.CSSProperties,
  select: {
    padding: "10px",
    borderRadius: "5px",
    border: "1px solid #ccc",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    outline: "none",
    transition: "border-color 0.3s",
  } as React.CSSProperties,
  button: {
    padding: "10px 20px",
    borderRadius: "5px",
    border: "none",
    backgroundColor: "#007BFF",
    color: "#fff",
    cursor: "pointer",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
    transition: "background-color 0.3s",
    width: "140px",
  } as React.CSSProperties,
  filterOpener: {
    position: "absolute",
    backgroundColor: "#fff",
    right: "-30px",
    top: "6px",
    transform: "scale(1.5)",
    padding: "4px",
    borderRadius: "5px",
    borderTopRightRadius: "0px",
    borderBottomRightRadius: "0px",
  } as React.CSSProperties,
};

export default MarketFilter;
