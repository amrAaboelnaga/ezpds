import { authStore } from './authStore';

class RootStore {
  authStore = authStore;
}

export const rootStore = new RootStore();
