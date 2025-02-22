import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppState, FlatList, RefreshControl, View } from 'react-native';
import { OnVideoErrorData, SelectedTrackType, VideoRef } from 'react-native-video';
import { IListStream } from 'src/models/aiStream/IListStream';
import { AppVideo } from 'src/modules/components/video';
import { emitShowToast } from 'src/shared/helpers/function';
import { useAppTheme } from 'src/shared/theme';
import { useGetPersist } from 'src/zustand/persist';
import { ItemVideo } from './component/ItemVideo';
import { useAddTurnFromAiStream } from './hook/addTurnFromAiStream';
import { useIsFocused } from '@react-navigation/native';
import { useUserLikeStream } from 'src/data/hooks/aiStream/useUserLikeStream';
import { Heart } from './hook/Heart';

interface IProps {
  heightVideo?: number
  data?: IListStream[],
  currentIndex: number,
  onChangeIndex: (index: number) => void
  fetch: () => void
  fetchMore: () => void
  isLoading: boolean
}

export const listVideoCommon = React.memo((props: IProps) => {
  const { heightVideo, currentIndex, data, fetch, fetchMore, isLoading, onChangeIndex } = props
  const theme = useAppTheme();
  const _heightVideo = useMemo(() => Number(heightVideo || theme.dimensions.deviceHeight), [heightVideo, theme.dimensions])
  const listRef = useRef<FlatList>(null)

  // render
  const _renderItem = useCallback(({ item, index }: { item: IListStream, index: number }) => {
    return <RenderVideo
      index={index}
      item={item}
      heightVideo={_heightVideo}
      currentIndex={currentIndex}
    />
  }, [_heightVideo, currentIndex]);

  if (!data) return null
  // main render
  return <FlatList
    initialScrollIndex={currentIndex}
    ref={listRef}
    data={data}
    showsVerticalScrollIndicator={false}
    snapToInterval={_heightVideo}
    keyExtractor={(item, index) => `${item?.id}_${index}`}
    renderItem={_renderItem}
    onScrollToIndexFailed={info => {
      const wait = new Promise(resolve => setTimeout(resolve, 500));
      wait.then(() => {
        listRef.current?.scrollToIndex({ index: info.index, animated: true });
      });
    }}
    refreshControl={
      <RefreshControl
        tintColor='transparent'
        colors={['transparent']}
        progressBackgroundColor='transparent'
        onRefresh={fetch}
        refreshing={false}
      />
    }
    // onEndReached={moreStream}
    scrollEventThrottle={16}
    decelerationRate="fast" // Ensures smooth snapping
    snapToAlignment="start" // Keeps alignment correct
    disableIntervalMomentum={true} // the scroll view stops on the next index. It mean scroll one by one!
    pagingEnabled={true} // Forces snap behavior
    initialNumToRender={3} // x items first is ready, after that list render next, (x-1)/2 item above,1 item center, (x-1)/2 item below
    windowSize={3}
    removeClippedSubviews={true} // Ensure videos outside of the viewport are removed
    viewabilityConfig={{ itemVisiblePercentThreshold: 70 }} // when visible x% will change index
    onViewableItemsChanged={(info) => {
      const viewableItem = info?.viewableItems?.[0]
      // const viewableItemId = info?.viewableItems?.[0]?.item?.id
      const viewableIndex = viewableItem?.index ?? -1

      if (viewableIndex >= 0 && viewableIndex != currentIndex) {
        // update state current
        onChangeIndex(viewableIndex)
        // fetchMore
        const indexOverNeedLoad = ((data?.length || 0) - 5)
        if (viewableIndex == indexOverNeedLoad && !isLoading) {
          fetchMore()
        }
      }
    }}
    getItemLayout={(data, index) => {
      return {
        index,
        length: _heightVideo,
        offset: _heightVideo * index,
      }
    }}
    maxToRenderPerBatch={3}
    updateCellsBatchingPeriod={15}
  />
})

interface IRenderVideo {
  item: IListStream,
  index: number,
  heightVideo: number
  currentIndex: number
}

const RenderVideo = React.memo((props: IRenderVideo) => {
  const { t } = useTranslation()
  const theme = useAppTheme();
  const { index, item, heightVideo, currentIndex } = props
  const isCurrent = useMemo(() => index == currentIndex, [index, currentIndex])
  const { check } = useAddTurnFromAiStream()
  const refVideo = useRef<VideoRef>(null)
  const isFocus = useIsFocused()
  const [appActive, setAppActive] = useState(true)
  const [doubleTapped, setDoubleTapped] = useState<boolean | undefined>()

  const currentError = useRef<OnVideoErrorData>(null)
  const source = useMemo(() => item?.postChildren?.[0]?.file?.fileUrl, [item?.postChildren])
  const [textTrack, setTextTrack] = useState('')
  const { token } = useGetPersist('Token') ?? {}

  const { fetchDoubleTap: fetchDoubleTap } = useUserLikeStream(Boolean(item?.extensions?.stats?.liked))

  const _isPaused = useMemo(() => !isCurrent || !isFocus || !appActive, [isCurrent, isFocus, appActive])

  const doubleTap = useCallback(() => {
    fetchDoubleTap(item?.id)
    token && setDoubleTapped((prev) => !Boolean(prev))
  }, [fetchDoubleTap, token, item?.id])

  useEffect(() => {
    if (isCurrent) {
      if (currentError.current) {
        console.info('video error: ', source, currentError.current);
        emitShowToast({ type: 'Error', toastMessage: t('loadingStreamError') })
      }
    } else {
      refVideo.current?.seek(0)
    }
  }, [refVideo, isCurrent, t, source, currentError])


  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      setAppActive(nextAppState == 'active')
    });

    return () => subscription.remove();
  }, []);

  return <View>
    <AppVideo
      ref={refVideo}
      key={item?.id}
      paused={_isPaused}
      doubleTap={doubleTap}
      // thumbnail={'https://image.api.playstation.com/vulcan/ap/rnd/202408/2010/6e7d87fef87405e9925e810a1620df04c3b98c2086711336.png'}
      source={{
        uri: source,
        bufferConfig: {
          minBufferMs: 2000, // Buffer tối thiểu x giây trước khi bắt đầu
          maxBufferMs: 5000, // Giữ tối đa x giây buffer để tránh giật
          bufferForPlaybackMs: 1000, // Chỉ cần x giây buffer để phát ngay
          bufferForPlaybackAfterRebufferMs: 2000, // Nếu gián đoạn, cần x giây buffer để tiếp tục phát
          backBufferDurationMs: 5000, // Giữ x giây video đã xem để tua lại nhanh
          maxHeapAllocationPercent: 0.33, // Chỉ dùng tối đa x% bộ nhớ heap
          minBackBufferMemoryReservePercent: 0.05, // Dành x% RAM để lưu video đã xem
          minBufferMemoryReservePercent: 0.15, // Dành x% RAM cho buffer
          cacheSizeMB: 20, // Cache xMB video để phát lại mượt
        },
        shouldCache: true
        // textTracks: [
        //   {
        //     title: 'en',
        //     language: 'en',
        //     type: TextTrackType.VTT,
        //     uri: 'https://brenopolanski.github.io/html5-video-webvtt-example/MIB2-subtitles-pt-BR.vtt',
        //   },
        // ]
      }}
      onProgress={(e) => {
        if (!!token && e.currentTime > 10) {
          check(item?.postId, 'watched')
        }
      }}
      containerStyle={{ height: heightVideo }}
      layerContent={<ItemVideo data={item} textTracks={textTrack} fullScreen={heightVideo == theme.dimensions.deviceHeight} />}
      repeat={true}
      onError={(e) => {
        // @ts-ignore
        currentError.current = e
      }}
      selectedTextTrack={{
        type: SelectedTrackType.LANGUAGE,
        value: 'en',
      }}
      onTextTrackDataChanged={(e) => {
        setTextTrack(e.subtitleTracks)
      }}
    />
    <Heart doubleTapped={doubleTapped} />
  </View>
})
