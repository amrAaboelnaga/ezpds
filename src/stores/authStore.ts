import { makeAutoObservable } from 'mobx';

class AuthStore {
  user: any = null;

  constructor() {
    makeAutoObservable(this);
  }

  login(userData: any) {
    this.user = userData;
  }

  logout() {
    this.user = null;
  }
}

export const authStore = new AuthStore();
