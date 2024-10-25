import AsyncStorage from '@react-native-async-storage/async-storage';
import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { ZustandPersistModel } from './IZustandPersistModel';

// config store
type UseSave = <K extends keyof ZustandPersistModel, V extends ZustandPersistModel[K]>(key: K, value: V) => void;
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
      save: (key, value) => set({
        state: { ...get().state, [key]: value }
      }),
      get: (key) => get().state[key],
      clear: (key) => {
        set({
          state: { ...get().state, [key]: undefined }
        })
      },
    }),
    {
      name: 'Zustand-Persist', // The key used for storage
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);

export const useSavePersist = () => ZustandPersist((rootState) => rootState?.save);
export const useGetPersist = <K extends keyof ZustandPersistModel>(key: K) => ZustandPersist((rootState) => rootState?.state?.[key]);

export default ZustandPersist