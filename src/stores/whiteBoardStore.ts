import { makeAutoObservable, runInAction } from 'mobx';
import { defualtPage, Guidelines, JsonSpecs, ProductInfo, SingleWBPageInterface } from '../types/whiteBoard';

class WhiteBoardStore {
  jsonSpecs: JsonSpecs = {};
  productInfo: ProductInfo = { id: 0, title: '', price: '', category: '' };
  textContent: any = null;
  textOnChange: any = null;
  containerEditor: any = null;
  pages: SingleWBPageInterface[] = [defualtPage(0)]; // Use empty array to start
  showPageNumber: boolean = true

  constructor() {
    makeAutoObservable(this);
  }

  setJsonSpecs(specs: JsonSpecs, pageId?: number) {

    runInAction(() => {
      const page = this.pages.find(page => page.id === pageId);
      if (page) {
        page.jsonSpecs = {
          ...page.jsonSpecs,
          ...specs,
        };
      } else {
        console.error(`Page with ID ${pageId} not found.`);
      }
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

  setGuidLines(object: Guidelines, pageId: number, shiftPressed?: boolean) {
    runInAction(() => {
      if (shiftPressed) {
        // Update guidelines for all pages
        this.pages.forEach(page => {
          page.guidLines = {
            ...page.guidLines,
            ...object,
          };
        });
      } else {
        // Update guidelines for the specific page
        const page = this.pages.find(page => page.id === pageId);
        if (page) {
          page.guidLines = {
            ...page.guidLines,
            ...object,
          };
        } else {
          console.error(`Page with ID ${pageId} not found.`);
        }
      }
    });
  }

  addPage() {
    runInAction(() => {
      const newId = this.pages.length ? this.pages[this.pages.length - 1].id + 1 : 0;
      this.pages.push(defualtPage(newId));
    });
  }

  deletePage(id: number) {
    runInAction(() => {
      this.pages = this.pages.filter(page => page.id !== id);
      this.pages = this.pages.map((page, index) => ({
        ...page,
        id: index
      }));
    });
  }

  setShowPageNumber() {
    runInAction(() => {
      this.showPageNumber = !this.showPageNumber
    });
  }

  addObjectToPage(pageId: number, newSpec: JsonSpecs) {
    runInAction(() => {
      const pageIndex = this.pages.findIndex(page => page.id === pageId);
      if (pageIndex > -1) {
        this.pages[pageIndex].jsonSpecs = {
          ...this.pages[pageIndex].jsonSpecs,
          ...newSpec,
        };
      }
    });
  }

  resetPages() {
    runInAction(() => {
      this.pages = [defualtPage(0)]
    });
  }

  importProject(obj: any) {
    runInAction(() => {
      this.pages = obj
    });
  }

}


export const whiteBoardStore = new WhiteBoardStore();
