import { create, StoreApi, UseBoundStore } from 'zustand';
import { ZustandSessionModel } from './IZustandSessionModel';

// Config store
type UseSave = <K extends keyof ZustandSessionModel, V extends ZustandSessionModel[K]>(key: K, value: V, mode?: 'update') => void;
type UseGet = <K extends keyof ZustandSessionModel>(key: K) => ZustandSessionModel[K];

interface IRootState {
  state: ZustandSessionModel;
  save: UseSave;
  get: UseGet;
}

const ZustandSession: UseBoundStore<StoreApi<IRootState>> = create((set, get) => ({
  state: {},
  save: (key, value, mode) => {
    return set((rootState) => {
      const prevState = rootState.state[key];
      if (mode && Boolean(prevState)) {

        if (typeof prevState === 'object' && !Array.isArray(prevState)) {
          return {
            state: {
              ...rootState.state,
              // @ts-ignore
              [key]: { ...prevState, ...value },
            },
          };
        }

        console.error(`typeof ${key} may not be an object or undefined`);
        return rootState;
      }

      return {
        state: {
          ...rootState.state,
          [key]: value,
        },
      };
    });
  },
  get: (key) => get().state[key],
}));

export const useSaveSession = () => ZustandSession((rootState) => rootState.save);
export const useGetSession = <K extends keyof ZustandSessionModel>(key: K) => ZustandSession((rootState) => rootState.state[key]);
export default ZustandSession;
