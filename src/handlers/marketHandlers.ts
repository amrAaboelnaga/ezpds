import { productInfosOnly, products } from '../assets/Examples/backEnd';
import { Product, ProductPages } from '../stores/marketStore';
import { rootStore } from '../stores/rootStore';
import { JsonSpecs, ProductInfo } from '../stores/whiteBoardStore';

export const maxProducts = 10

export const categories = [
  { value: "", label: "All Categories" },
  { value: "Electronics", label: "Electronics" },
  { value: "Furniture", label: "Furniture" },
  { value: "Clothing", label: "Clothing" },
  { value: "Books", label: "Books" },
  { value: "Toys", label: "Toys" },
  { value: "Groceries", label: "Groceries" },
  { value: "Health & Beauty", label: "Health & Beauty" },
  { value: "Sports & Outdoors", label: "Sports & Outdoors" },
  { value: "Home & Kitchen", label: "Home & Kitchen" },
  { value: "Automotive", label: "Automotive" },
  { value: "Jewelry", label: "Jewelry" },
  { value: "Musical Instruments", label: "Musical Instruments" },
  { value: "Office Supplies", label: "Office Supplies" },
  { value: "Pet Supplies", label: "Pet Supplies" },
  { value: "Video Games", label: "Video Games" },
];



export const useMarketHandlers = () => {
  const { marketStore } = rootStore;

  const fetchFirstProductsPage = async (
    searchTerm: string,
    category: string,
    minPrice: string,
    maxPrice: string,
    latest: boolean,
    pageSize: number,
  ): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      marketStore.setMarketStoreData('loadingState', 'loading');

      setTimeout(() => {
        try {
          // Initial data and filtering
          let data = productInfosOnly;

          // Apply filters based on search criteria
          if (searchTerm) {
            data = data.filter(product =>
              product.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
          }
          if (category) {
            data = data.filter(product => product.category === category);
          }
          if (minPrice) {
            data = data.filter(product => parseFloat(product.price) >= parseFloat(minPrice));
          }
          if (maxPrice) {
            data = data.filter(product => parseFloat(product.price) <= parseFloat(maxPrice));
          }
          if (latest) {
            data = data.sort((a, b) => b.id - a.id);
          }

          // Calculate items count based on filtered data
          const itemsCount = data.length;

          // Calculate the number of pages
          const numberOfPages = Math.ceil(itemsCount / pageSize);

          // Get the first page of products
          const firstPageProducts = data.slice(0, pageSize);

          // Initialize the product structure with correct number of pages
          const firstPageStructure: ProductPages = {
            pages: Array(numberOfPages).fill([]) // Initialize with empty arrays
          };

          // Add the first page's products to the structure
          firstPageStructure.pages[0] = firstPageProducts;

          // Update the market store with the new data
          marketStore.setMarketStoreData('products', firstPageStructure);
          marketStore.setMarketStoreData('itemsCount', itemsCount);
          marketStore.setMarketStoreData('loadingState', 'done');

          resolve();
        } catch (error) {
          marketStore.setMarketStoreData('loadingState', 'error');
          reject(error);
        }
      }, 500); // Simulated delay for demonstration
    });
  };

  const fetchProductsByPage = async (
    searchTerm: string,
    category: string,
    minPrice: string,
    maxPrice: string,
    latest: boolean,
    pageSize: number,
    pageNumber: number,
  ): Promise<void> => {
    return new Promise<void>((resolve, reject) => {
      // Check if the page has already been loaded
      if (marketStore.products.pages[pageNumber - 1] && marketStore.products.pages[pageNumber - 1].length > 0) {
        // Set the current page in store and return
        marketStore.setMarketStoreData('currentPage', pageNumber);
        resolve();
        return;
      }

      marketStore.setMarketStoreData('loadingState', 'loading');

      setTimeout(() => {
        try {
          // Initial data and filtering
          let data = productInfosOnly;

          // Apply filters based on search criteria
          if (searchTerm) {
            data = data.filter(product =>
              product.title.toLowerCase().includes(searchTerm.toLowerCase())
            );
          }
          if (category) {
            data = data.filter(product => product.category === category);
          }
          if (minPrice) {
            data = data.filter(product => parseFloat(product.price) >= parseFloat(minPrice));
          }
          if (maxPrice) {
            data = data.filter(product => parseFloat(product.price) <= parseFloat(maxPrice));
          }
          if (latest) {
            data = data.sort((a, b) => b.id - a.id);
          }

          // Calculate items count based on filtered data
          const itemsCount = data.length;

          // Calculate the start and end index for the current page
          const startIndex = (pageNumber - 1) * pageSize;
          const endIndex = startIndex + pageSize;

          // Get the products for the current page
          const currentPageProducts = data.slice(startIndex, endIndex);

          // Calculate the number of pages
          const numberOfPages = Math.ceil(itemsCount / pageSize);

          // Get the current page structure from the store
          const existingPages = marketStore.products.pages;

          // Initialize the product structure with existing pages
          const updatedProducts: ProductPages = {
            pages: [...existingPages] // Copy existing pages
          };

          // Update the specific page
          if (pageNumber <= numberOfPages) {
            updatedProducts.pages[pageNumber - 1] = currentPageProducts;
          }

          // Update the market store with the new data
          marketStore.setMarketStoreData('products', updatedProducts);
          marketStore.setMarketStoreData('itemsCount', itemsCount);
          marketStore.setMarketStoreData('loadingState', 'done');

          resolve();
        } catch (error) {
          marketStore.setMarketStoreData('loadingState', 'error');
          reject(error);
        }
      }, 500); // Simulated delay for demonstration
    });
  };

  const fetchProductDetails = (productId: number, setProductInfoOnly: any, setProductJsonSpec: any) => {
    // Find productInfoOnly based on productId
    const productInfo = productInfosOnly.find(product => product.id === productId);
    if (productInfo) {
      setProductInfoOnly(productInfo);

      // Find corresponding productJsonSpec from products
      const productSpec = products.find(product => product.productInfo.id === productId);
      if (productSpec) {
        setProductJsonSpec(productSpec.jsonSpecs);
      } else {
        console.error(`Product with id ${productId} not found in products array.`);
      }
    } else {
      console.error(`Product with id ${productId} not found in productInfosOnly array.`);
    }
  };

  const copyThisTemplate = (productInfoOnly: ProductInfo, productJsonSpec: JsonSpecs, whiteBoardStore: any, navigate: any) => {
    if (productInfoOnly && productJsonSpec) {
      whiteBoardStore.setProductInfo(productInfoOnly);
      whiteBoardStore.setJsonSpecs(productJsonSpec);
      navigate('/demo');
    }
  };


  return {
    fetchFirstProductsPage, fetchProductsByPage, fetchProductDetails, copyThisTemplate
  };
};
