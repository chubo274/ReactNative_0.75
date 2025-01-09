import React, { useCallback } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  SharedValue,
  useAnimatedStyle
} from 'react-native-reanimated';
import Svg, { Circle, G, Path, Polygon, Text as SvgText } from 'react-native-svg';

interface CircleSegment {
  name: string;
  color: string;
}

interface SpinCircleProps {
  radius: number;
  rotation: SharedValue<number>
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
  rotation,
}) => {
  const totalSegments = segments.length;
  const angleStep = 360 / totalSegments;

  const size = radius * 2;
  const strokeWidth = 0;
  const center = radius;
  const radiusContent = radius - borderCircle * 2

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
    const labelRadius = radiusContent * 0.6; // Position labels slightly inward
    const x = center + labelRadius * Math.cos((angle * Math.PI) / 180);
    const y = center + labelRadius * Math.sin((angle * Math.PI) / 180);
    return { x, y };
  };

  // Animated style for rotation
  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ rotate: `${rotation.value}deg` }],
  }));

  // render
  const renderPolygon = useCallback(() => {
    const viewPolygonSize = Math.min(32, size / (totalSegments / 1.5))
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

  return <View style={[styles.svgContainer, { width: size, height: size, }]}>
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
                  {segment?.name?.slice(0, 16)}
                </SvgText>
              </React.Fragment>
            );
          })}
        </G>
      </Svg>
    </Animated.View>
    {/* Polygon */}
    {renderPolygon()}
  </View>
};

const styles = StyleSheet.create({
  svgContainer: {
  },
});
