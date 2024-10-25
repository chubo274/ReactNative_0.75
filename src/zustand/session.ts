import { create, StoreApi, UseBoundStore } from 'zustand';
import { ZustandSessionModel } from './IZustandSessionModel';

// config store
type UseSave = <K extends keyof ZustandSessionModel, V extends ZustandSessionModel[K]>(key: K, value: V) => void;
type UseGet = <K extends keyof ZustandSessionModel>(key: K) => ZustandSessionModel[K];

interface IRootState {
	state: ZustandSessionModel;
	save: UseSave;
	get: UseGet;
}

const ZustandSession: UseBoundStore<StoreApi<IRootState>> = create((set, get) => ({
  state: {},
  save: (key, value) => {
    return set((rootState: any) => {
      return {
        state: {
          ...rootState?.state,
          [key]: value,
        },
      };
    });
  },
  get: (key) => get()?.state?.[key],
}),
);

export const useSaveSession = () => ZustandSession((rootState) => rootState?.save);
export const useGetSession = <K extends keyof ZustandSessionModel>(key: K) => ZustandSession((rootState) => rootState?.state?.[key]);
export default ZustandSession
