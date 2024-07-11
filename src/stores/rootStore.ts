import { authStore } from './authStore';
import { demoStore } from './demoStore';

class RootStore {
  authStore = authStore;
  demoStore = demoStore
}

export const rootStore = new RootStore();
