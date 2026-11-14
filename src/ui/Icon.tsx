import React from 'react';
import Svg, { Circle, Ellipse, Path, Rect } from 'react-native-svg';
export type IconName = 'today' | 'tasks' | 'goals' | 'habits' | 'more';
export function Icon({
  name,
  color,
  size = 24,
}: {
  name: IconName;
  color: string;
  size?: number;
}) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke={color}
      strokeWidth={1.65}
      strokeLinecap="round"
      strokeLinejoin="round"
      accessible={false}
    >
      {name === 'today' && (
        <>
          <Circle cx={12} cy={12} r={8} />
          <Path d="m15 9-2 4-4 2 2-4Z" />
        </>
      )}
      {name === 'tasks' && (
        <>
          <Rect x={4} y={4} width={16} height={16} rx={5} />
          <Path d="m8 12 3 3 5-6" />
        </>
      )}
      {name === 'goals' && (
        <>
          <Circle cx={12} cy={12} r={8} />
          <Circle cx={12} cy={12} r={3.5} />
        </>
      )}
      {name === 'habits' && (
        <>
          <Path d="M19 10a7.5 7.5 0 1 0-1 7M19 5v5h-5" />
          <Path d="m9 12 2 2 4-4" />
        </>
      )}
      {name === 'more' && (
        <>
          <Circle cx={5} cy={12} r={1} />
          <Circle cx={12} cy={12} r={1} />
          <Circle cx={19} cy={12} r={1} />
        </>
      )}
    </Svg>
  );
}
export function BrandMark({
  color,
  size = 52,
}: {
  color: string;
  size?: number;
}) {
  return (
    <Svg
      width={size}
      height={size}
      viewBox="0 0 64 64"
      fill="none"
      accessible={false}
    >
      <Circle cx={32} cy={32} r={18} stroke={color} strokeWidth={2.5} />
      <Ellipse
        cx={32}
        cy={32}
        rx={28}
        ry={12}
        rotation={-35}
        origin="32,32"
        stroke={color}
        strokeWidth={2.5}
      />
      <Circle cx={53} cy={17} r={4} fill={color} />
    </Svg>
  );
}
