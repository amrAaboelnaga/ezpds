import { makeAutoObservable, runInAction } from 'mobx';
import { copiedDefaultPage, defaultPage, Guidelines, JsonSpecs, ProductInfo, SingleWBPageInterface } from '../types/whiteBoard';
import { extractColorsFromPages } from '../handlers/whiteBoardHandlers';

class WhiteBoardStore {
  jsonSpecs: JsonSpecs = {};
  productInfo: ProductInfo = { id: 0, title: '', price: '', category: '' };
  textContent: any = null;
  textOnChange: any = null;
  containerEditor: any = null;
  pages: SingleWBPageInterface[] = [defaultPage(0)]; // Use empty array to start
  showPageNumber: boolean = true
  currentPage: number = 0
  projectColors: string[] = []

  updateProjectColors() {
    runInAction(() => {
      this.projectColors = extractColorsFromPages(this.pages);
    });
  }

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

  setCurrentPage(currentPage: number) {
    runInAction(() => {
      this.currentPage = currentPage
      console.log(`Looking at pageId: ${currentPage}`)
    });
  }

  addPage() {
    runInAction(() => {
      const newId = this.pages.length ? this.pages[this.pages.length - 1].id + 1 : 0;
      this.pages.push(defaultPage(newId));
    });
  }
  addPageAfter(currentPageId: number) {
    runInAction(() => {
      // Ensure the currentPageId corresponds to an existing index
      if (currentPageId < 0 || currentPageId >= this.pages.length) {
        console.error(`Page with ID ${currentPageId} not found.`);
        return;
      }

      // Insert a new page after the current page
      this.pages.splice(currentPageId + 1, 0, defaultPage(currentPageId + 1));

      // Update IDs of all pages to match their new indices
      this.pages.forEach((page, index) => {
        page.id = index;
      });
    });
  }

  copyPageAfter(currentPageId: number) {
    runInAction(() => {
      // Ensure the currentPageId corresponds to an existing index
      if (currentPageId < 0 || currentPageId >= this.pages.length) {
        console.error(`Page with ID ${currentPageId} not found.`);
        return;
      }

      // Insert a new page after the current page
      const newPageId = currentPageId + 1;
      const copiedSpecs = this.pages[currentPageId].jsonSpecs;
      const newPage = copiedDefaultPage(newPageId, copiedSpecs);

      this.pages.splice(newPageId, 0, newPage);

      // Update IDs of all pages to match their new indices
      this.pages.forEach((page, index) => {
        page.id = index;
      });
    });
  }

  addPageBefore(currentPageId: number) {
    runInAction(() => {
      // Ensure the currentPageId corresponds to an existing index
      if (currentPageId < 0 || currentPageId >= this.pages.length) {
        console.error(`Page with ID ${currentPageId} not found.`);
        return;
      }

      // Insert a new page before the current page
      this.pages.splice(currentPageId, 0, defaultPage(currentPageId));

      // Update IDs of all pages to match their new indices
      this.pages.forEach((page, index) => {
        page.id = index;
      });
    });
  }

  copyPageBefore(currentPageId: number) {
    runInAction(() => {
      // Ensure the currentPageId corresponds to an existing index
      if (currentPageId < 0 || currentPageId >= this.pages.length) {
        console.error(`Page with ID ${currentPageId} not found.`);
        return;
      }

      // Insert a new page before the current page
      const newPageId = currentPageId;
      const copiedSpecs = this.pages[currentPageId].jsonSpecs;
      const newPage = copiedDefaultPage(newPageId, copiedSpecs);

      this.pages.splice(newPageId, 0, newPage);

      // Update IDs of all pages to match their new indices
      this.pages.forEach((page, index) => {
        page.id = index;
      });
    });
  }


  handleOnDragEnd(result: any) {
    const { destination, source } = result;

    if (!destination) {
      // If dropped outside the list
      return;
    }

    // Ensure the source and destination are different
    if (source.index === destination.index) {
      return;
    }

    runInAction(() => {
      // Reorder the pages array
      const [removed] = this.pages.splice(source.index, 1);
      this.pages.splice(destination.index, 0, removed);

      // Update IDs of all pages to match their new indices
      this.pages.forEach((page, index) => {
        page.id = index;
      });
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
      this.pages = [defaultPage(0)]
    });
  }

  importProject(obj: any) {
    runInAction(() => {
      this.pages = obj.pages
      this.productInfo = obj.productInfo
    });
  }



}


export const whiteBoardStore = new WhiteBoardStore();
