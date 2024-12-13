import { useCallback, useEffect, useState } from 'react';
import { followUserRepo } from 'src/data/repositories/aiStream/followUserRepo';
import { PromiseHandler } from '../takeLastest';
import Closure from 'src/shared/helpers/Closure';
import { needAskLogin } from 'src/shared/helpers/function';
interface IOptions {
  withoutLoading?: boolean,
  onSuccess?: (data?: any) => void,
  onFailed?: (error?: any) => void,
}

interface IParamApi {
  isFollow: boolean
}

const closure = new Closure()
// =====
export const useFollowUser = (defaultState: boolean) => {
  // const save = useSave()
  const [data, setData] = useState<boolean>(defaultState)
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNormal = useCallback(async (params: IParamApi, options?: IOptions) => {
    !options?.withoutLoading && setIsLoading(true)
    try {
      const response = await handlerFrist.takeLatest(followUserRepo(params))
      setData(response?.data)
      // save('',response?.data)
      options?.onSuccess?.(response?.data)
    } catch (error: any) {
      if (!error?.canceled) {
        setError(error?.message)
        options?.onFailed?.(error?.message)
      }
    } finally {
      !options?.withoutLoading && setIsLoading(false)
    }
  }, [])

  // fecth closure
  const fetch = useCallback(() => {
    if (needAskLogin()) return;
    setData(!data)
    closure.debounce(() => fetchNormal({ isFollow: !data }), 500)
  }, [data, fetchNormal])

  useEffect(() => {
    setData((prev) => {
      if (defaultState != prev) return defaultState
      return prev
    })
  }, [defaultState])

  return {
    fetch,
    data,
    isLoading,
    error,
  }
}

// =====
const handlerFrist = new PromiseHandler();
