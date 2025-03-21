import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { ZustandPersistModel } from './IZustandPersistModel';

// config store
interface IRootState extends ZustandPersistModel {
  save<K extends keyof ZustandPersistModel, V extends ZustandPersistModel[K]>(key: K, value: V, mode?: 'update'): void;
  hydrated: boolean | undefined
  changeHydrated(zustandReady: boolean): void
}

const ZustandPersist = create<IRootState>()(persist(
  (set, get) => ({
    hydrated: undefined,
    save: (key, value, mode) => {
      const prevState = get()?.[key];
      if (mode && Boolean(prevState)) {

        if (typeof prevState === 'object' && !Array.isArray(prevState)) {
          return set({
            // @ts-ignore
            [key]: { ...prevState, ...value },
          });
        }

        console.error(`typeof ${key} maybe not is object or undefined`);
        return;
      }

      return set({ [key]: value });
    },
    changeHydrated: (nextState: boolean) => set({ hydrated: nextState })
  }),
  {
    name: 'Zustand-Persist',
    storage: createJSONStorage(() => AsyncStorage),

    onRehydrateStorage: () => (state) => {
      console.info('🚀 Rehydration started', state);
      state?.changeHydrated(true)
    },
  })
);

export default ZustandPersist
