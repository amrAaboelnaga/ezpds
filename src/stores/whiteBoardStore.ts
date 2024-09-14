import { action, makeAutoObservable, observable, toJS } from 'mobx';
import { copiedDefaultPage, defaultPage, Guidelines, JsonSpecs, ProductInfo, SingleWBPageInterface } from '../types/whiteBoard';
import { extractColorsFromPages } from '../handlers/whiteBoardHandlers';

class WhiteBoardStore {
  jsonSpecs: JsonSpecs = {};
  productInfo: ProductInfo = { id: 0, title: '', price: '', category: '' };
  textContent: any = null;
  textOnChange: any = null;
  containerEditor: any = null;

  @observable pages: SingleWBPageInterface[] = [defaultPage(0)];
  previousStates: any[] = [];
  redoStates: any[] = [];
  isInitialStateSaved: boolean = false;
  showPageNumber: boolean = true;
  currentPage: number = 0;
  projectColors: string[] = [];

  constructor() {
    makeAutoObservable(this);
    this.saveInitialState();
  }

  saveInitialState() {
    if (!this.isInitialStateSaved) {
      this.previousStates.push(toJS(this.pages));
      this.isInitialStateSaved = true;
    }
  }

  @action
  saveCurrentState() {
    const currentState = toJS(this.pages);

    if (
      this.previousStates.length === 0 ||
      JSON.stringify(currentState) !== JSON.stringify(this.previousStates[this.previousStates.length - 1])
    ) {
      console.log('Saving current state');
      this.previousStates.push(currentState);
      this.redoStates = []; // Clear redo stack
    } else {
      console.log('State is identical, not saving');
    }
  }

  @action
  undo() {
    if (this.previousStates.length > 1) {
      const currentState = toJS(this.pages);
      this.redoStates.push(currentState);

      this.previousStates.pop();
      this.pages = toJS(this.previousStates[this.previousStates.length - 1]);
      console.log('Undo performed');
    } else {
      console.log('No more previous states available to undo');
    }
  }

  @action
  redo() {
    if (this.redoStates.length > 0) {
      const currentState = toJS(this.pages);
      this.previousStates.push(currentState);

      this.pages = toJS(this.redoStates.pop());
      console.log('Redo performed');
    } else {
      console.log('No redo states available');
    }
  }

  @action
  updateProjectColors() {
    this.projectColors = extractColorsFromPages(this.pages);
  }

  @action
  setJsonSpecs(specs: JsonSpecs, pageId?: number) {
    const page = this.pages.find(page => page.id === pageId);
    if (page) {
      page.jsonSpecs = {
        ...page.jsonSpecs,
        ...specs,
      };
    } else {
      console.error(`Page with ID ${pageId} not found.`);
    }
  }

  @action
  setProductInfo(info: ProductInfo) {
    this.productInfo = info;
  }

  @action
  setTextEditor(textContent: any, textOnChange: any) {
    this.textContent = textContent;
    this.textOnChange = textOnChange;
  }

  @action
  setContainerEditor(object: any) {
    this.containerEditor = object;
  }

  @action
  setGuidLines(object: Guidelines, pageId: number, shiftPressed?: boolean) {
    if (shiftPressed) {
      this.pages.forEach(page => {
        page.guidLines = {
          ...page.guidLines,
          ...object,
        };
      });
    } else {
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
  }

  @action
  setCurrentPage(currentPage: number) {
    this.currentPage = currentPage;
    console.log(`Looking at pageId: ${currentPage}`);
  }

  @action
  addPage() {
    const newId = this.pages.length ? this.pages[this.pages.length - 1].id + 1 : 0;
    this.pages.push(defaultPage(newId));
    this.saveCurrentState();
  }

  @action
  addPageAfter(currentPageId: number) {
    if (currentPageId < 0 || currentPageId >= this.pages.length) {
      console.error(`Page with ID ${currentPageId} not found.`);
      return;
    }

    this.pages.splice(currentPageId + 1, 0, defaultPage(currentPageId + 1));
    this.pages.forEach((page, index) => (page.id = index));
  }

  @action
  copyPageAfter(currentPageId: number) {
    if (currentPageId < 0 || currentPageId >= this.pages.length) {
      console.error(`Page with ID ${currentPageId} not found.`);
      return;
    }

    const newPageId = currentPageId + 1;
    const copiedSpecs = this.pages[currentPageId].jsonSpecs;
    const newPage = copiedDefaultPage(newPageId, copiedSpecs);

    this.pages.splice(newPageId, 0, newPage);
    this.pages.forEach((page, index) => (page.id = index));
    this.saveCurrentState();
  }

  @action
  addPageBefore(currentPageId: number) {
    if (currentPageId < 0 || currentPageId >= this.pages.length) {
      console.error(`Page with ID ${currentPageId} not found.`);
      return;
    }

    this.pages.splice(currentPageId, 0, defaultPage(currentPageId));
    this.pages.forEach((page, index) => (page.id = index));
    this.saveCurrentState();
  }

  @action
  copyPageBefore(currentPageId: number) {
    if (currentPageId < 0 || currentPageId >= this.pages.length) {
      console.error(`Page with ID ${currentPageId} not found.`);
      return;
    }

    const newPageId = currentPageId;
    const copiedSpecs = this.pages[currentPageId].jsonSpecs;
    const newPage = copiedDefaultPage(newPageId, copiedSpecs);

    this.pages.splice(newPageId, 0, newPage);
    this.pages.forEach((page, index) => (page.id = index));
    this.saveCurrentState();
  }

  @action
  handleOnDragEnd(result: any) {
    const { destination, source } = result;

    if (!destination || source.index === destination.index) return;

    const [removed] = this.pages.splice(source.index, 1);
    this.pages.splice(destination.index, 0, removed);

    this.pages.forEach((page, index) => (page.id = index));
    this.saveCurrentState();
  }

  @action
  deletePage(id: number) {
    this.pages = this.pages.filter(page => page.id !== id);
    this.pages.forEach((page, index) => (page.id = index));
    this.saveCurrentState();
  }

  @action
  setShowPageNumber() {
    this.showPageNumber = !this.showPageNumber;
    this.saveCurrentState();
  }

  @action
  addObjectToPage(pageId: number, newSpec: JsonSpecs) {
    const pageIndex = this.pages.findIndex(page => page.id === pageId);
    if (pageIndex > -1) {
      this.pages[pageIndex].jsonSpecs = {
        ...this.pages[pageIndex].jsonSpecs,
        ...newSpec,
      };
    }
    this.saveCurrentState();
  }

  @action
  resetPages() {
    this.pages = [defaultPage(0)];
    this.saveCurrentState();
  }

  @action
  importProject(obj: any) {
    this.pages = obj.pages;
    this.productInfo = obj.productInfo;
  }
}

export const whiteBoardStore = new WhiteBoardStore();
