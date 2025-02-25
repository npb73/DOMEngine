import { create } from 'zustand';

interface KeyStore {
  pressedKeys: Set<string>;
  addKey: (key: string) => void;
  removeKey: (key: string) => void;
  clearKeys: () => void;
}

const useKeyStore = create<KeyStore>((set) => ({
  pressedKeys: new Set(), 

  addKey: (key: string) => set((state) => {
    const newPressedKeys = new Set(state.pressedKeys);
    newPressedKeys.add(key); 
    return { pressedKeys: newPressedKeys };
  }),

  removeKey: (key: string) => set((state) => {
    const newPressedKeys = new Set(state.pressedKeys);
    newPressedKeys.delete(key);
    return { pressedKeys: newPressedKeys };
  }),

  clearKeys: () => set({ pressedKeys: new Set() }),
}));

export default useKeyStore;
