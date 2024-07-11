import { makeAutoObservable } from 'mobx';
import { runInAction } from 'mobx';

class WhiteBoardStore {
  jsonSpecs: any = {};

  constructor() {
    makeAutoObservable(this);
  }


  setJsonSpecs(specs: any) {
    runInAction(() => {
      this.jsonSpecs = specs;
    })

  }

}

export const whiteBoardStore = new WhiteBoardStore();
