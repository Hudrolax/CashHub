import React from 'react';
import { TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const BackBtn = ({ onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Svg height="50" width="50" viewBox="0 0 50 50">
        <Path
          d="M30 10 L15 25 L30 40" // рисуем стрелку влево
          stroke="white"
          strokeWidth="5"
          strokeLinecap="round"
          fill="none"
        />
      </Svg>
    </TouchableOpacity>
  );
};

export default BackBtn;
