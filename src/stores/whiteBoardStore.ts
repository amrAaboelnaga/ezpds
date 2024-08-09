import { makeAutoObservable, runInAction } from 'mobx';
import { Guidelines, JsonSpecs, ProductInfo } from '../types/whiteBoard';



class WhiteBoardStore {
  jsonSpecs: JsonSpecs = {};
  productInfo: ProductInfo = { id: 0, title: '', price: '', category: '' };
  textContent: any = null;
  textOnChange: any = null;
  containerEditor: any = null;
  guidLines: Guidelines = {
    left: 50,
    leftVisb: false,
    top: 50,
    topVisb: false,
    right: 50,
    rightVisb: false,
    bottom: 50,
    bottomVisb: false,
    centerVisb: false
  }

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

  setGuidLines(object: any) {
    runInAction(() => {
      this.guidLines = object;
    });
  }

}

export const whiteBoardStore = new WhiteBoardStore();
