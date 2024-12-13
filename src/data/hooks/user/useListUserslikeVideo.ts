import { useCallback, useState } from 'react';
import { getListStreamRepo } from 'src/data/repositories/aiStream/getListStreamRepo';
import { userslikeVideo } from 'src/data/repositories/aiStream/userslikeVideo';
import { PromiseHandler } from '../takeLastest';

interface IOptions {
  withoutLoading?: boolean,
  onSuccess?: (data?: any) => void,
  onFailed?: (error?: any) => void,
}

interface IParamApi {
  postId: string
}

// =====
export const useListUserslikeVideo = () => {
  // const save = useSave()
  const [data, setData] = useState<any[]>()
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [canLoadMore, setCanLoadMore] = useState(true);

  const fetch = useCallback(async (params?: IParamApi, options?: IOptions) => {
    !options?.withoutLoading && setIsLoading(true)
    try {
      const response = await handlerFrist.takeLatest(userslikeVideo({ postId: params?.postId || '', limit: 10, page: 1 }))
      setData(response?.data)
      setPage(1)
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

  const fetchMore = useCallback(async (params?: IParamApi, options?: IOptions) => {
    if (!canLoadMore) return
    !options?.withoutLoading && setIsLoading(true)
    try {
      const nextPage = page + 1
      const response = await handlerFrist.takeLatest(getListStreamRepo({ limit: 10, page: nextPage }))
      setData((prev) => {
        // @ts-ignore
        return [...prev, ...response?.data]
      })
      setPage(page + 1)
      if (response?.data?.length < 10) setCanLoadMore(false)
      options?.onSuccess?.(response?.data)
    } catch (error: any) {
      if (!error?.canceled) {
        setError(error?.message)
        options?.onFailed?.(error?.message)
      }
    } finally {
      !options?.withoutLoading && setIsLoading(false)
    }
  }, [page, canLoadMore])

  return {
    fetch,
    fetchMore,
    data,
    isLoading,
    error,
    canLoadMore
  }
}

// =====
const handlerFrist = new PromiseHandler();
