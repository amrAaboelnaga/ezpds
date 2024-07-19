import { makeAutoObservable } from 'mobx';

export interface Product {
  id: number;
  title: string;
  price: string;
  category: string;
  prevPic: string;
}

export interface ProductPages {
  pages: Product[][];
}

class MarketStore {
  products: ProductPages = { pages: [] };
  loadingState: string = 'idle';
  itemsCount: number = 0;
  currentPage: number = 1;

  constructor() {
    makeAutoObservable(this);
  }

  setMarketStoreData(key: keyof this, value: any) {
    this[key] = value;
  }

  clearProducts() {
    this.products = { pages: [] };
    this.loadingState = 'loading';
    this.itemsCount = 0;
    this.currentPage = 1;
  }
}

export const marketStore = new MarketStore();
