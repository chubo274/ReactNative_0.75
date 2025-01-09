import BottomSheet from '@gorhom/bottom-sheet';
import React, { useCallback, useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import SoundPlayer from 'react-native-sound-player';
import Svg, { Circle, G, Path, Polygon, Text as SvgText } from 'react-native-svg';
import SoundSource from 'src/assets/sounds';
import { AppButton } from '../button/AppButton';
import { ModalCongratulation } from './ModalCongratulation';

interface CircleSegment {
  name: string;
  color: string;
}

interface SpinCircleProps {
  radius: number;
  segments: CircleSegment[]; // max length is 72
  pipeColor?: string;
  borderCircle?: number;
  borderCircleColor?: string;
}

export const SpinCircle: React.FC<SpinCircleProps> = ({
  radius,
  segments,
  pipeColor = 'black',
  borderCircle = 0,
  borderCircleColor = 'black',
}) => {
  const { t } = useTranslation()
  const [currentIndex, setCurrentIndex] = useState<number>();
  const [disabledSpin, setdisabledSpin] = useState<boolean>(false);
  const [nextAngleState, setNextAngleState] = useState<number>(0);
  const totalSegments = segments.length;
  const angleStep = 360 / totalSegments;
  const refModal = useRef<BottomSheet>(null)

  const size = radius * 2;
  const strokeWidth = 0;
  const center = radius;
  const radiusContent = radius - borderCircle * 2
  const rotation = useSharedValue(0); // Shared value for rotation
  const nextAngle = useSharedValue(0);

  // Helper to calculate the path for each segment
  const getPath = (startAngle: number, endAngle: number) => {
    const largeArcFlag = endAngle - startAngle > 180 ? 1 : 0;
    const startX = center + radiusContent * Math.cos((startAngle * Math.PI) / 180);
    const startY = center + radiusContent * Math.sin((startAngle * Math.PI) / 180);
    const endX = center + radiusContent * Math.cos((endAngle * Math.PI) / 180);
    const endY = center + radiusContent * Math.sin((endAngle * Math.PI) / 180);

    return `M ${center},${center} L ${startX},${startY} A ${radiusContent},${radiusContent} 0 ${largeArcFlag} 1 ${endX},${endY} Z`;
  };

  // Calculate label position
  const getLabelPosition = (startAngle: number, endAngle: number) => {
    const angle = (startAngle + endAngle) / 2; // Midpoint angle
    const labelRadius = radiusContent * 0.7; // Position labels slightly inward
    const x = center + labelRadius * Math.cos((angle * Math.PI) / 180);
    const y = center + labelRadius * Math.sin((angle * Math.PI) / 180);
    return { x, y };
  };

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

  // Animated style for rotation
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  // random next index
  const caculateNextAngle = useCallback(() => {
    const nextIndex = Math.floor(Math.random() * (totalSegments - 0)) + 0
    const caculateNextAngle = 360 - (nextIndex * angleStep + (angleStep / 2))
    console.log('nextIndex', nextIndex);

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
    console.log('nextAngleState', nextAngleState);
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

  // render
  const renderPolygon = useCallback(() => {
    const viewPolygonSize = Math.min(42, size / (totalSegments / 1.5))
    return <View style={{ position: 'absolute', top: radius - (viewPolygonSize / 2), right: borderCircle }}>
      <Svg width={viewPolygonSize} height={viewPolygonSize}>
        <Polygon
          points={`${0},${viewPolygonSize / 2} ${viewPolygonSize},${0} ${viewPolygonSize},${viewPolygonSize}`} // Coordinates of point
          fill={borderCircleColor}
          stroke={borderCircleColor}
          strokeWidth="1"
        />
      </Svg>
    </View>
  }, [borderCircle, borderCircleColor, radius, size, totalSegments])

  return <View style={styles.container}>
    <View style={[styles.svgContainer, { width: size, height: size, }]}>
      <Animated.View style={[styles.svgContainer, { width: size, height: size, }, animatedStyle]}>
        <Svg width={size} height={size}>
          <G>
            {/* border */}
            <Circle
              cx={center}  // X-coordinate of the circle's center
              cy={center}  // Y-coordinate of the circle's center
              r={center - borderCircle}    // Radius of the circle
              stroke={borderCircleColor}  // Circle border color
              strokeWidth={borderCircle} // Border thickness
              fill="transparent"      // Fill color of the circle
            />
            {segments.map((segment, index) => {
              const startAngle = index * angleStep;
              const endAngle = startAngle + angleStep;

              const { x, y } = getLabelPosition(startAngle, endAngle); // Coordinates of start label
              const rotationAngle = (startAngle + endAngle) / 2; // Midpoint of the segment

              return (
                <React.Fragment key={index}>
                  <Path
                    d={getPath(startAngle, endAngle)}
                    fill={segment.color}
                    stroke={pipeColor}
                    strokeWidth={strokeWidth}
                  />
                  {/* Render segment label */}
                  <SvgText
                    x={x}
                    y={y}
                    transform={`rotate(${rotationAngle}, ${x}, ${y})`} // Show follow the rotation of Path segment
                    textAnchor="middle"
                    alignmentBaseline="middle"
                    fontSize={14}
                    fill="white"
                  >
                    {segment.name}
                  </SvgText>
                </React.Fragment>
              );
            })}
          </G>
        </Svg>
      </Animated.View>
      {/* Polygon */}
      {renderPolygon()}
      {/* <Text style={styles.text}>
        {(currentIndex != undefined) ? `Current Segment: ${segments?.[(currentIndex)]?.name}` : 'None'}
      </Text> */}
      <ModalCongratulation
        ref={refModal}
        onClose={resetSpin}
        // @ts-ignore
        prizeName={segments?.[currentIndex]?.name} />
    </View>

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
    </View>
  </View>
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
  },
  svgContainer: {
  },
  text: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: 'bold',
  },
  buttons: {
    flexDirection: 'row',
    marginTop: 20,
    gap: 10,
  },
});
