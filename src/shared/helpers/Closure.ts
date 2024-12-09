export default class Closure {
  timer: NodeJS.Timeout | null

  constructor() {
    this.timer = null;
  }

  debounce = (fn: () => void, ms: number) => {
    if (this.timer) {
      clearTimeout(this.timer);
    }

    this.timer = setTimeout(fn, ms);
    // let timeoutId: ReturnType<typeof setTimeout>;
    // return function (this: any, ...args: any[]) {
    //     clearTimeout(timeoutId);
    //     timeoutId = setTimeout(() => fn.apply(this), ms);
    // };
  };
}
