import { UserRepository } from 'src/data/repositories/user';
import { ResponseModel } from 'src/models/common';
import { UserModel } from 'src/models/user/UserModel';
import { useCallback, useState } from 'react';
interface IOptions {
  withoutLoading?: boolean,
  onSuccess?: (data?: any) => void,
  onFailed?: (error?: any) => void,
}

interface IParamApi {
  email: string,
  password: string
}

// =====
export const useLogin = () => {
  // const save = useSave()
  const [data, setData] = useState<UserModel>()
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetch = useCallback(async (params: IParamApi, options?: IOptions) => {
    !options?.withoutLoading && setIsLoading(true)
    try {
      const response = await handlerFrist.takeLatest(UserRepository.loginRepo(params))
      setData(response?.data)
      // save('',response?.data)
      options?.onSuccess?.()
    } catch (error: any) {
      if (!error?.canceled) {
        setError(error?.message)
        options?.onFailed?.(error)
      }
    } finally {
      !options?.withoutLoading && setIsLoading(false)
    }
  }, [])

  return {
    fetch,
    data,
    isLoading,
    error,
  }
}

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

class PromiseHandler {
  excutor: null | IPromiseCancel<ResponseModel<UserModel>>
  constructor() {
    this.excutor = null;
  }

  takeLatest(promise: Promise<any>) {
    !!this?.excutor?.canceled && this.excutor.canceled();
    this.excutor = promiseCancelable(promise);

    return this.excutor.promise;
  }
}

// =====
const handlerFrist = new PromiseHandler();
