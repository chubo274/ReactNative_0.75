import BottomSheet from '@gorhom/bottom-sheet';
import { useIsFocused } from '@react-navigation/native';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { AppState, StyleSheet, View } from 'react-native';
import {
  cancelAnimation,
  Easing,
  runOnJS,
  useDerivedValue,
  useSharedValue,
  withSequence,
  withTiming
} from 'react-native-reanimated';
import SoundPlayer from 'react-native-sound-player';
import SoundSource from 'src/assets/sounds';
import { useLuckyWheel } from 'src/data/hooks/luckeyWheel/useLuckyWheel';
import { emitShowToast } from 'src/shared/helpers/function';
import { AppButton } from '../button/AppButton';
import { ModalCongratulation } from './ModalCongratulation';
import { ICircleSegment, SpinCircle } from './SpinCircle';

const listWaitForApi: ICircleSegment[] = [
  { id: '1', name: '', color: '#1b4534' },
  { id: '2', name: '', color: '#62d6b4' },
  { id: '3', name: '', color: '#1b4534' },
  { id: '4', name: '', color: '#62d6b4' },
  { id: '5', name: '', color: '#1b4534' },
  { id: '6', name: '', color: '#62d6b4' },
  { id: '7', name: '', color: '#1b4534' },
  { id: '8', name: '', color: '#62d6b4' },
  { id: '9', name: '', color: '#1b4534' },
  { id: '10', name: '', color: '#62d6b4' },
]
interface IProps {
  turns: number;
  radius: number;
  segments?: ICircleSegment[]; // max length is 72 because spred stop = 5
  pipeColor?: string;
  borderCircle?: number;
  borderCircleColor?: string;
}

export const LuckyWheel = (props: IProps) => {
  const { turns, radius, segments, borderCircle, borderCircleColor, pipeColor } = props
  const { t } = useTranslation()
  const totalSegments = segments?.length || listWaitForApi.length; // fallback
  const angleStep = 360 / totalSegments;

  const isFocus = useIsFocused()
  const refModal = useRef<BottomSheet>(null)
  const [currentIndex, setCurrentIndex] = useState<number>();
  const [isSpining, setIsSpining] = useState<boolean>(false); // when turn = 0, or spining
  const [nextAngleState, setNextAngleState] = useState<number>(0); // rotation coordinates of next position - state // not reset for each turn
  const [needShowCongratulation, setNeedShowCongratulation] = useState<boolean>(false); // show modal when spining done, no err, focused at lucky wheel
  const [playingSoundCongratulation, setplayingSoundCongratulation] = useState<boolean>(false);

  const rotation = useSharedValue(0); // total number of degrees the wheel rotated
  const nextAngle = useSharedValue(0); // rotation coordinates of next position - animated // reset for each turn
  const isStoping = useSharedValue(false); // flag check animation stoping

  const { fetch: postSpinned } = useLuckyWheel()

  const soundonCongratulation = useCallback(() => {
    if (isFocus) {
      SoundPlayer.playAsset(SoundSource.congratulation_wheel)
      setplayingSoundCongratulation(true)
    }
  }, [isFocus])

  const openModalCongratulation = useCallback(() => {
    setTimeout(() => {
      refModal.current?.snapToIndex(0)
    }, 10);
  }, [])

  // Update the current segment based on rotation
  useDerivedValue(() => {
    if (rotation.value != 0) {
      const angleRotated = rotation.value % 360
      const index = Math.floor((360 - angleRotated) / angleStep) // index change follow the spin

      // when caculated the next value, spread angle is 3
      const isCurrentNearNext = nextAngle.value > 0 && ((nextAngle.value - 2) < rotation.value % 360 && rotation.value % 360 < (nextAngle.value + 2))
      const leastRotation = 360 * 3
      if (rotation.value >= leastRotation && isCurrentNearNext && !isStoping.value) {
        isStoping.value = true
        runOnJS(SoundPlayer.stop)()
        const currentRotation = rotation.value
        cancelAnimation(rotation);

        runOnJS(soundonCongratulation)();
        rotation.value = withSequence(
          withTiming(currentRotation, { duration: 0 }), // No abrupt jump
          withTiming(currentRotation + 360, {
            duration: 2000,
            easing: Easing.out(Easing.quad), // Smooth deceleration
          }, (finished, current) => {
            if (finished) {
              runOnJS(setNeedShowCongratulation)(true);
              runOnJS(setNextAngleState)(rotation.value % 360);
            }
          }),
        );
      }
      runOnJS(setCurrentIndex)(index);
    }
  });

  // Reset the wheel
  const resetSpin = useCallback(() => {
    SoundPlayer.stop()
    nextAngle.value = 0
    isStoping.value = false
    rotation.value = nextAngleState
    setCurrentIndex(undefined)
    setIsSpining(false)
    setNeedShowCongratulation(false)
    setplayingSoundCongratulation(false)
  }, [nextAngle, isStoping, nextAngleState, rotation])

  // random next index
  const caculateNextAngle = useCallback(() => {
    // // Math.random value: [0, 1). is mean 0% -> 99%
    // // Random result is index: 0 -> (totalSegments -1)
    // const index = Math.floor(Math.random() * (totalSegments))
    // if (index >= 0) {
    //   // it mean, pointer will not stop at any stroke
    //   const nextPosition = Math.floor(Math.random() * (angleStep - 1)) + 1
    //   const _nextAngle = 360 - (index * angleStep) + nextPosition
    //   setTimeout(() => {
    //     nextAngle.value = _nextAngle
    //   }, 2000);
    // }

    // index by api
    postSpinned({
      onSuccess: (data) => {
        const index = segments?.findIndex((segment) => segment?.id == data?.id)
        if (index && index >= 0) {
          const nextPosition = Math.floor(Math.random() * (angleStep - 1)) + 1
          const _nextAngle = 360 - (index * angleStep) + nextPosition
          nextAngle.value = _nextAngle
        }
      },
      onFailed: () => {
        resetSpin()
        emitShowToast({
          type: 'Error',
          toastMessage: t('connectToServerErr')
        })
      }
    })
  }, [t, nextAngle, angleStep, postSpinned, segments, resetSpin])

  // Spin the wheel
  const startSpin = useCallback(() => {
    setIsSpining(true)
    SoundPlayer.playAsset(SoundSource.spinning_wheel)
    rotation.value = withSequence(
      withTiming(360, { duration: 1000, easing: Easing.in(Easing.sin) }),
      withTiming(360 * 40, { duration: 30000, easing: Easing.linear }),
    )
    caculateNextAngle()
  }, [rotation, caculateNextAngle])

  // handle sound
  useEffect(() => {
    const subscription = AppState.addEventListener('change', nextAppState => {
      if (nextAppState != 'active') SoundPlayer.pause()
      if (nextAppState == 'active') SoundPlayer.resume()
    });

    return () => subscription.remove();
  }, []);

  useEffect(() => {
    if (isFocus) {
      SoundPlayer.resume()
      if (needShowCongratulation) {
        if (!playingSoundCongratulation) {
          SoundPlayer.playAsset(SoundSource.congratulation_wheel)
          SoundPlayer.seek(1)
        }
        openModalCongratulation()
      }
    } else {
      SoundPlayer.pause()
    }
  }, [isFocus, needShowCongratulation, playingSoundCongratulation, openModalCongratulation])

  return <View style={styles.container}>
    <SpinCircle
      radius={radius}
      rotation={rotation}
      segments={segments?.length ? segments : listWaitForApi} // fallback for circle with element ''
      borderCircle={borderCircle}
      borderCircleColor={borderCircleColor}
      pipeColor={pipeColor}
    />
    <View style={{ justifyContent: 'center' }}>
      <AppButton
        title={t('spin')}
        onPress={startSpin}
        style={{ marginLeft: 16, paddingVertical: 24, paddingHorizontal: 24 }}
        textStyle={{ fontSize: 32, fontWeight: 700, lineHeight: undefined }}
        disabled={!Boolean(turns) || !Boolean(segments?.length) || isSpining}
      />
      {/* <Button title="caculateNextAngle" onPress={caculateNextAngle} />
      <Button title="Reset" onPress={resetSpin} /> */}
      {/* <Text style={styles.text}>
        {(currentIndex != undefined) ? `Prize: ${segments?.[(currentIndex)]?.name}` : 'None'}
      </Text> */}
    </View>
    <ModalCongratulation
      ref={refModal}
      onClose={resetSpin}
      // @ts-ignore
      prizeName={segments?.[currentIndex]?.name} />
  </View>
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  text: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
  },
});
