import BottomSheet from '@gorhom/bottom-sheet';
import React, { useCallback, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
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
import { AppButton } from '../button/AppButton';
import { ModalCongratulation } from './ModalCongratulation';
import { ICircleSegment, SpinCircle } from './SpinCircle';
import { emitShowToast } from 'src/shared/helpers/function';

interface IProps {
  turns: number;
  radius: number;
  segments: ICircleSegment[]; // max length is 72
  pipeColor?: string;
  borderCircle?: number;
  borderCircleColor?: string;
}

export const LuckyWheel = (props: IProps) => {
  const { turns, radius, segments, borderCircle, borderCircleColor, pipeColor } = props
  const { t } = useTranslation()
  const [currentIndex, setCurrentIndex] = useState<number>();
  const [disabledSpin, setdisabledSpin] = useState<boolean>(false);
  const [nextAngleState, setNextAngleState] = useState<number>(0);
  const totalSegments = segments.length;
  const angleStep = 360 / totalSegments;
  const refModal = useRef<BottomSheet>(null)

  const rotation = useSharedValue(0); // Shared value for rotation
  const nextAngle = useSharedValue(0);

  const { fetch: postSpinned } = useLuckyWheel()

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

      // when caculated the next value, spread angle is 5
      const isCurrentNearNext = nextAngle.value > 0 && ((nextAngle.value - 2) <= rotation.value % 360 && rotation.value % 360 <= (nextAngle.value + 2))
      const leastRotation = 360 * 3
      if (rotation.value >= leastRotation && isCurrentNearNext) {
        runOnJS(SoundPlayer.stop)()
        const currentRotation = rotation.value
        cancelAnimation(rotation);

        runOnJS(SoundPlayer.playAsset)(SoundSource.congratulation_wheel);
        rotation.value = withSequence(
          withTiming(currentRotation, { duration: 0 }), // No abrupt jump
          withTiming(currentRotation + 360, {
            duration: 1500,
            easing: Easing.out(Easing.quad), // Smooth deceleration
          }, (finished, current) => {
            // Trigger callback after the sequence ends
            if (finished) {
              runOnJS(openModalCongratulation)();
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
    rotation.value = nextAngleState
    setCurrentIndex(undefined)
    setdisabledSpin(false)
  }, [nextAngleState, rotation])

  // random next index
  const caculateNextAngle = useCallback(() => {
    // setTimeout(() => { // demo local without api
    //   const prizeAngle = Math.floor(Math.random() * (totalSegments - 0)) + 0
    //   nextAngle.value = prizeAngle
    // }, 2000);

    postSpinned({
      onSuccess: (data) => {
        const index = segments?.findIndex((segment) => segment?.id == data?.id)
        if (index >= 0) {
          const _nextAngle = 360 - (index * angleStep + (angleStep / 2))
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
  }, [nextAngle, angleStep, totalSegments, postSpinned, segments, resetSpin])

  // Spin the wheel
  const startSpin = useCallback(() => {
    setdisabledSpin(true)
    SoundPlayer.playAsset(SoundSource.spinning_wheel)
    rotation.value = withSequence(
      withTiming(360, { duration: 1000, easing: Easing.in(Easing.sin) }),
      withTiming(360 * 40, { duration: 30000, easing: Easing.linear }),
    )
    caculateNextAngle()
  }, [rotation, caculateNextAngle])

  return <View style={styles.container}>
    <SpinCircle
      radius={radius}
      rotation={rotation}
      segments={segments}
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
        disabled={!Boolean(turns) || disabledSpin}
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
