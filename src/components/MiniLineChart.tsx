import React from 'react';
import { StyleSheet, View, Text, ViewStyle, Platform } from 'react-native';
import Svg, { Path, Defs, LinearGradient, Stop, Line } from 'react-native-svg';
import { typography } from '../theme/theme';

interface MiniLineChartProps {
  data: number[];
  labels?: string[];
  width: number;
  height: number;
  strokeColor: string;
  fillColorStart: string;
  fillColorEnd: string;
  showAxes?: boolean;
  style?: ViewStyle;
}

export const MiniLineChart: React.FC<MiniLineChartProps> = ({
  data,
  labels = [],
  width,
  height,
  strokeColor,
  fillColorStart,
  fillColorEnd,
  showAxes = false,
  style,
}) => {
  if (data.length === 0) return null;

  const paddingLeft = showAxes ? 35 : 0;
  const paddingRight = 0;
  const paddingTop = 10;
  const paddingBottom = showAxes ? 25 : 5;

  const chartWidth = width - paddingLeft - paddingRight;
  const chartHeight = height - paddingTop - paddingBottom;

  const minVal = Math.min(...data) === Math.max(...data) ? 0 : Math.min(...data);
  const maxVal = Math.max(...data) === minVal ? 100 : Math.max(...data);
  const valRange = maxVal - minVal;

  const points = data.map((val, idx) => {
    const x = paddingLeft + (idx / (data.length - 1)) * chartWidth;
    // Invert Y coordinate for screen drawing
    const y = paddingTop + chartHeight - ((val - minVal) / valRange) * chartHeight;
    return { x, y, value: val };
  });

  // Construct path string
  let pathD = '';
  let areaD = '';

  if (points.length > 0) {
    pathD = `M ${points[0].x} ${points[0].y}`;
    for (let i = 1; i < points.length; i++) {
      // Clean linear path
      pathD += ` L ${points[i].x} ${points[i].y}`;
    }
    
    // Close the area path for fill gradient
    areaD = `${pathD} L ${points[points.length - 1].x} ${paddingTop + chartHeight} L ${points[0].x} ${paddingTop + chartHeight} Z`;
  }

  // Pick three sample labels to show on X axis
  const getXAxisLabels = () => {
    if (labels.length === 0) return [];
    if (labels.length <= 3) return labels.map((l, i) => ({ label: l, x: points[i]?.x }));
    
    const firstIdx = 0;
    const midIdx = Math.floor(labels.length / 2);
    const lastIdx = labels.length - 1;

    return [
      { label: labels[firstIdx], x: points[firstIdx].x },
      { label: labels[midIdx], x: points[midIdx].x },
      { label: labels[lastIdx], x: points[lastIdx].x }
    ];
  };

  const xLabels = getXAxisLabels();

  return (
    <View style={[styles.container, style, { width, height }]}>
      <Svg width={width} height={height}>
        <Defs>
          <LinearGradient id="chartGrad" x1="0" y1="0" x2="0" y2="1">
            <Stop offset="0%" stopColor={fillColorStart} stopOpacity={0.2} />
            <Stop offset="100%" stopColor={fillColorEnd} stopOpacity={0} />
          </LinearGradient>
        </Defs>

        {/* Minimal grid lines */}
        {showAxes && (
          <>
            <Line
              x1={paddingLeft}
              y1={paddingTop}
              x2={width}
              y2={paddingTop}
              stroke="rgba(128,128,128,0.1)"
              strokeDasharray="4 4"
            />
            <Line
              x1={paddingLeft}
              y1={paddingTop + chartHeight / 2}
              x2={width}
              y2={paddingTop + chartHeight / 2}
              stroke="rgba(128,128,128,0.1)"
              strokeDasharray="4 4"
            />
            <Line
              x1={paddingLeft}
              y1={paddingTop + chartHeight}
              x2={width}
              y2={paddingTop + chartHeight}
              stroke="rgba(128,128,128,0.15)"
            />
          </>
        )}

        {/* Area fill under curve */}
        {areaD ? <Path d={areaD} fill="url(#chartGrad)" /> : null}

        {/* The line path */}
        {pathD ? (
          <Path
            d={pathD}
            fill="transparent"
            stroke={strokeColor}
            strokeWidth={2.5}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        ) : null}
      </Svg>

      {/* Y Axis text label overlays */}
      {showAxes && (
        <View style={[styles.yAxisLabels, { height: chartHeight, top: paddingTop }]}>
          <Text style={styles.axisText}>{Math.round(maxVal)}</Text>
          <Text style={styles.axisText}>{Math.round(minVal + valRange / 2)}</Text>
          <Text style={styles.axisText}>{Math.round(minVal)}</Text>
        </View>
      )}

      {/* X Axis text label overlays */}
      {showAxes && xLabels.length > 0 && (
        <View style={styles.xAxisLabels}>
          {xLabels.map((item, idx) => (
            <Text
              key={idx}
              style={[
                styles.axisText,
                {
                  position: 'absolute',
                  left: item.x - 20, // Center label slightly
                  width: 40,
                  textAlign: 'center',
                },
              ]}
            >
              {item.label}
            </Text>
          ))}
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: 'relative',
  },
  yAxisLabels: {
    position: 'absolute',
    left: 0,
    width: 30,
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  xAxisLabels: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 20,
  },
  axisText: {
    fontSize: typography.fontSizes.xs - 2,
    color: '#888',
    fontFamily: Platform.select({ ios: 'Courier', android: 'monospace' }),
  },
});
