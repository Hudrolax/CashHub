import React from 'react';
import { TouchableOpacity } from 'react-native';
import Svg, { Circle, Path } from 'react-native-svg';

const AddBtn = ({onPress}) => {
  const handlePress = () => {
    onPress()
  };

  return (
    <TouchableOpacity onPress={handlePress}>
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
          d="M15 25 H35 M25 15 V35" // рисуем крест
          stroke="white"
          strokeWidth="5"
        />
      </Svg>
    </TouchableOpacity>
  );
};

export default AddBtn;
