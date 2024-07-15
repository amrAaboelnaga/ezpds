import { authStore } from './authStore';
import { marketStore } from './marketStore';
import { whiteBoardStore } from './whiteBoardStore';

class RootStore {
  authStore = authStore;
  whiteBoardStore = whiteBoardStore;
  marketStore = marketStore
}

export const rootStore = new RootStore();
