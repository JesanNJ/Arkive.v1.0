import React from 'react';
import Svg, {
  Defs,
  LinearGradient,
  RadialGradient,
  Stop,
  Rect,
  Circle,
  Path,
} from 'react-native-svg';
import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

const LoginBackground = () => {
  return (
    <Svg width={width} height={height}>

      <Defs>
        <LinearGradient id="bg" x1="0" y1="0" x2="0" y2="1">
          <Stop offset="0%" stopColor="#020c1b" />
          <Stop offset="60%" stopColor="#071a2e" />
          <Stop offset="100%" stopColor="#031224" />
        </LinearGradient>

        <RadialGradient id="glow">
          <Stop offset="0%" stopColor="#64ffda" stopOpacity="0.2" />
          <Stop offset="100%" stopColor="#64ffda" stopOpacity="0" />
        </RadialGradient>
      </Defs>

      {/* FULL BG */}
      <Rect width="100%" height="100%" fill="url(#bg)" />

      {/* GLOWS */}
      <Circle cx={width * 0.8} cy={height * 0.2} r="140" fill="url(#glow)" />
      <Circle cx={width * 0.2} cy={height * 0.8} r="160" fill="url(#glow)" />

      {/* 🔥 LAYERED BOTTOM WAVES (FIX) */}
      <Path
        d={`
          M0 ${height * 0.6}
          C ${width * 0.3} ${height * 0.55},
            ${width * 0.7} ${height * 0.75},
            ${width} ${height * 0.65}
          L ${width} ${height}
          L 0 ${height}
          Z
        `}
        fill="#64ffda"
        opacity="0.05"
      />

      <Path
        d={`
          M0 ${height * 0.7}
          C ${width * 0.25} ${height * 0.65},
            ${width * 0.75} ${height * 0.9},
            ${width} ${height * 0.8}
          L ${width} ${height}
          L 0 ${height}
          Z
        `}
        fill="#1E7A85"
        opacity="0.06"
      />

      <Path
        d={`
          M0 ${height * 0.8}
          C ${width * 0.4} ${height * 0.75},
            ${width * 0.6} ${height * 1.0},
            ${width} ${height * 0.9}
          L ${width} ${height}
          L 0 ${height}
          Z
        `}
        fill="#0a192f"
        opacity="0.4"
      />

      {/* VAULT RINGS */}
      {[120, 90, 60].map((r, i) => (
        <Circle
          key={i}
          cx={width * 0.5}
          cy={height * 0.35}
          r={r}
          stroke="#64ffda"
          strokeWidth="1"
          opacity={0.05 - i * 0.01}
        />
      ))}

      {/* CENTER DOT */}
      <Circle
        cx={width * 0.5}
        cy={height * 0.35}
        r="3"
        fill="#64ffda"
        opacity="0.4"
      />

    </Svg>
  );
};

export default LoginBackground;