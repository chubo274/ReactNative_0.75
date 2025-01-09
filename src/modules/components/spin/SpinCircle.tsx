import React, { useCallback, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import Animated, {
  runOnJS,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withSequence,
  withTiming,
} from 'react-native-reanimated';
import Svg, { Circle, G, Path, Polygon, Text as SvgText } from 'react-native-svg';

interface CircleSegment {
  name: string;
  color: string;
}

interface SpinCircleProps {
  radius: number;
  segments: CircleSegment[];
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
  const [currentIndex, setCurrentIndex] = useState<number>();
  const [countSpin, setCountSpin] = useState<number>(0);
  const totalSegments = segments.length;
  const angleStep = 360 / totalSegments;

  const size = radius * 2;
  const strokeWidth = 0;
  const center = radius;
  const radiusContent = radius - borderCircle * 2
  const rotation = useSharedValue(0); // Shared value for rotation

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

  // Update the current segment based on rotation
  useDerivedValue(() => {
    if (rotation.value != 0) {
      const angleRotated = rotation.value % 360
      const index = Math.floor((360 - angleRotated) / angleStep)
      runOnJS(setCurrentIndex)(index);
    }
  }, []);

  // Animated style for rotation
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  const getRandomNumberInRange = useCallback((min: number, max: number) => {
    return Math.floor(Math.random() * (max - min)) + min;
  }, [])

  // random next index
  const caculateNextIndex = useCallback(() => {
    const nextStep = getRandomNumberInRange(0, totalSegments)
    return nextStep
  }, [getRandomNumberInRange, totalSegments])

  // Spin or stop the wheel
  const toggleSpin = useCallback(() => {
    const nextCountSpin = countSpin + 1
    const next = caculateNextIndex()
    if (next >= 0) {
      setCountSpin(nextCountSpin)
      const caculateNextAngle = 360 - (next * angleStep + (angleStep / 2))
      rotation.value = withSequence(
        withTiming((360 * 5) * nextCountSpin + caculateNextAngle, { duration: 5000 }),
      )
    }
  }, [countSpin, caculateNextIndex, rotation, angleStep])

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
      <Text style={styles.text}>
        {(currentIndex != undefined) ? `Current Segment: ${segments?.[(currentIndex)]?.name}` : 'None'}
      </Text>
    </View>

    <View style={{ justifyContent: 'center' }}>
      <View style={styles.buttons}>
        <Button title="Start" onPress={toggleSpin} />
      </View>
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
