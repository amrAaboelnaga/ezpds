import { makeAutoObservable, runInAction } from 'mobx';
import { fetchProductsData } from '../handlers/marketHandlers';

export interface Product {
  id: number;
  title: string;
  price: string;
  category: string;
  prevPic: string
}

class MarketStore {
  products: Product[] = [];
  loadingState: string = 'idle';

  constructor() {
    makeAutoObservable(this);
  }

  // Method to fetch products asynchronously with a delay
  fetchProducts = async (searchTerm: string = '', category: string = '', minPrice: string = '', maxPrice: string = '', latest: boolean = false) => {
    this.loadingState = 'loading';
    try {
      // Simulate async fetch with a delay using setTimeout
      const data = await fetchProductsData(searchTerm, category, minPrice, maxPrice, latest);

      // Update state using MobX runInAction
      runInAction(() => {
        this.products = data;
        this.loadingState = 'done';
      });
    } catch (error) {
      console.error('Error fetching products:', error);
      runInAction(() => {
        this.loadingState = 'error';
      });
    }
  };
}

export const marketStore = new MarketStore();
