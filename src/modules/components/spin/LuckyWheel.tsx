import BottomSheet from '@gorhom/bottom-sheet';
import React, { useCallback, useEffect, useRef, useState } from 'react';
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
import { AppButton } from '../button/AppButton';
import { ModalCongratulation } from './ModalCongratulation';
import { SpinCircle } from './SpinCircle';

interface CircleSegment {
  name: string;
  color: string;
}

interface IProps {
  radius: number;
  segments: CircleSegment[]; // max length is 72
  pipeColor?: string;
  borderCircle?: number;
  borderCircleColor?: string;
}

export const LuckyWheel = (props: IProps) => {
  const { radius, segments, borderCircle, borderCircleColor, pipeColor } = props
  const { t } = useTranslation()
  const [currentIndex, setCurrentIndex] = useState<number>();
  const [disabledSpin, setdisabledSpin] = useState<boolean>(false);
  const [nextAngleState, setNextAngleState] = useState<number>(0);
  const totalSegments = segments.length;
  const angleStep = 360 / totalSegments;
  const refModal = useRef<BottomSheet>(null)

  const rotation = useSharedValue(0); // Shared value for rotation
  const nextAngle = useSharedValue(0);

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
        nextAngle.value = 0
      }
      runOnJS(setCurrentIndex)(index);
    }
  });

  // random next index
  const caculateNextAngle = useCallback(() => {
    const nextIndex = Math.floor(Math.random() * (totalSegments - 0)) + 0
    const caculateNextAngle = 360 - (nextIndex * angleStep + (angleStep / 2))
    nextAngle.value = caculateNextAngle
  }, [nextAngle, angleStep, totalSegments])

  // Spin the wheel
  const startSpin = useCallback(() => {
    setdisabledSpin(true)
    SoundPlayer.playAsset(SoundSource.spinning_wheel)
    rotation.value = withSequence(
      withTiming(360, { duration: 1000, easing: Easing.in(Easing.sin) }),
      withTiming(360 * 40, { duration: 30000, easing: Easing.linear }),
    )
  }, [rotation])

  // Reset the wheel
  const resetSpin = useCallback(() => {
    SoundPlayer.stop()
    // nextAngle.value = 0
    rotation.value = nextAngleState
    setCurrentIndex(undefined)
    setdisabledSpin(false)
  }, [nextAngleState, rotation])

  useEffect(() => {
    if (disabledSpin) {
      setTimeout(() => {
        caculateNextAngle()
      }, 1200);
    }
  }, [disabledSpin, caculateNextAngle])

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
        disabled={disabledSpin}
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
