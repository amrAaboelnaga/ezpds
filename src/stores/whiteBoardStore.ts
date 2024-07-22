import { makeAutoObservable, runInAction } from 'mobx';

export interface JsonSpecs {
  [key: string]: {
    type: string;
    content: string;
    location: { x: number; y: number };
    width: number;
    height: number;
    isEditing: boolean;
    imgData: string;
    rows?: number;
    columns?: number;
    tableData?: string[][];
    listData?: string[];
  };
}

export interface ProductInfo {
  id: number;
  title: string;
  price: string;
  category: string;
}

class WhiteBoardStore {
  jsonSpecs: JsonSpecs = {};
  productInfo: ProductInfo = { id: 0, title: '', price: '', category: '' };

  constructor() {
    makeAutoObservable(this);
  }

  setJsonSpecs(specs: JsonSpecs) {
    runInAction(() => {
      this.jsonSpecs = specs;
    });
  }

  setProductInfo(info: ProductInfo) {
    runInAction(() => {
      this.productInfo = info;
    });
  }
}

export const whiteBoardStore = new WhiteBoardStore();
