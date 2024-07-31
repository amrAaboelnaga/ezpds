import { makeAutoObservable, runInAction } from 'mobx';
import { JsonSpecs, ProductInfo } from '../types/whiteBoard';



class WhiteBoardStore {
  jsonSpecs: JsonSpecs = {};
  productInfo: ProductInfo = { id: 0, title: '', price: '', category: '' };
  textContent: any = null;
  textOnChange: any = null;
  containerEditor: any = null;;

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

  setTextEditor(textContent: any, textOnChange: any) {
    runInAction(() => {
      this.textContent = textContent;
      this.textOnChange = textOnChange;
    });
  }

  setContainerEditor(object: any) {
    runInAction(() => {
      this.containerEditor = object;
    });
  }

}

export const whiteBoardStore = new WhiteBoardStore();
