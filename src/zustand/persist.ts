import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { ZustandPersistModel } from './IZustandPersistModel';

// config store
type UseSave = <K extends keyof ZustandPersistModel, V extends ZustandPersistModel[K]>(key: K, value: V, mode?: 'update') => void;
type UseGet = <K extends keyof ZustandPersistModel>(key: K) => ZustandPersistModel[K];
type UseClear = <K extends keyof ZustandPersistModel>(key: K) => void;

interface IRootState {
  state: ZustandPersistModel;
  save: UseSave;
  get: UseGet;
  clear: UseClear;
}

const ZustandPersist = create<IRootState>()(
  persist(
    (set, get) => ({
      state: {},
      save: (key, value, mode) => {
        const rootState = get().state;
        const prevState = rootState[key];
        if (mode && Boolean(prevState)) {

          if (typeof prevState === 'object' && !Array.isArray(prevState)) {
            return set({
              state: {
                ...rootState,
                // @ts-ignore
                [key]: { ...prevState, ...value },
              },
            });
          }

          console.error(`typeof ${key} maybe not is object or undefined`);
          return rootState;
        }

        return set({
          state: { ...rootState, [key]: value },
        });
      },
      get: (key) => get().state[key],
      clear: (key) => {
        const rootState = { ...get().state };
        delete rootState[key]; // 🔥 Xóa đúng key thay vì set `undefined`
        set({ state: rootState });
      },
    }),
    {
      name: 'Zustand-Persist',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export const useSavePersist = () => ZustandPersist((rootState) => rootState?.save);
export const useGetPersist = <K extends keyof ZustandPersistModel>(key: K) => ZustandPersist((rootState) => rootState?.state?.[key]);

export default ZustandPersist
