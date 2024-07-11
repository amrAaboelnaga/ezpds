import { authStore } from './authStore';
import { whiteBoardStore } from './whiteBoardStore';

class RootStore {
  authStore = authStore;
  whiteBoardStore = whiteBoardStore
}

export const rootStore = new RootStore();
