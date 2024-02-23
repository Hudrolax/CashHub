import React from 'react';
import { TouchableOpacity } from 'react-native';
import Svg, { Path } from 'react-native-svg';

const BackBtn = ({style, onPress }) => {
  return (
    <TouchableOpacity style={style} onPress={onPress}>
      <Svg height="30" width="30" viewBox="0 0 50 50">
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
