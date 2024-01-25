import React from 'react';
import { TouchableOpacity } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

const CompleteBtn = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Svg height="50" width="50" viewBox="0 0 50 50">
        <Circle
          cx="25"
          cy="25"
          r="23.5" // радиус меньше на половину толщины линии, чтобы граница была видна полностью
          stroke="white"
          strokeWidth="3"
          fill="none"
        />
        <Path
          d="M15 25 L25 35 L35 15" // рисуем галочку
          stroke="white"
          strokeWidth="5"
          strokeLinecap="round" // закругляем концы линии для более плавного вида
        />
      </Svg>
    </TouchableOpacity>
  );
};

export default CompleteBtn;
