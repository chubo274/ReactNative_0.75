import { create } from 'zustand';
import { ZustandSessionModel } from './IZustandSessionModel';

// Config store
interface IRootState extends ZustandSessionModel {
  save<K extends keyof ZustandSessionModel, V extends ZustandSessionModel[K]>(key: K, value: V, mode?: 'update'): void;
  hydrated: boolean | undefined
  changeHydrated(zustandReady: boolean): void
}

const ZustandSession = create<IRootState>()(
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
);

export default ZustandSession;
