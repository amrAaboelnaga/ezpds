import { makeAutoObservable } from 'mobx';

class DemoStore {
  jsonSpecs: object = {};

  constructor() {
    makeAutoObservable(this);
  }

  setJsonSpecs(specs: object) {
    this.jsonSpecs = specs;
  }

}

export const demoStore = new DemoStore();
