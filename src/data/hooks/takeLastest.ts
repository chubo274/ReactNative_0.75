import { ResponseModel } from 'src/models/common';

interface IPromiseCancel<T> {
  promise: Promise<T>;
  canceled: (reason?: any) => void;
}

const promiseCancelable = <T,>(promise: Promise<T>) => {
  let rejectRoot: (reason?: any) => void = () => null;

  const promiseResult: Promise<T> = new Promise((resolve, reject) => {
    rejectRoot = reject;
    promise.then((res) => resolve(res)).catch(error => {
      reject(error);
    })
  })

  return {
    promise: promiseResult,
    canceled: rejectRoot,
  }
}

export class PromiseHandler {
  excutor: null | IPromiseCancel<ResponseModel<any>>
  constructor() {
    this.excutor = null;
  }

  takeLatest(promise: Promise<any>) {
    !!this?.excutor?.canceled && this.excutor.canceled();
    this.excutor = promiseCancelable(promise);

    return this.excutor.promise;
  }
}
