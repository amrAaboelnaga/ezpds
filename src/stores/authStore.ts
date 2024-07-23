import { makeAutoObservable } from 'mobx';

class AuthStore {
  user: any = null;
  sessionData: any = null

  constructor() {
    makeAutoObservable(this);
  }

  login(userData: any, sessionData: any) {
    this.user = userData;
    this.sessionData = sessionData
  }

  logout() {
    this.user = null;
    this.sessionData = null
  }
}

export const authStore = new AuthStore();
