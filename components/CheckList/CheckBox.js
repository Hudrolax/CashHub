import React, { useState, useEffect } from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import Svg, { Path } from "react-native-svg";

const CheckBox = ({ style, checked, onPress }) => {
  const [isChecked, setIsChecked] = useState(checked);

  const toggleCheckBox = () => {
    setIsChecked(!isChecked);
    onPress();
  };

  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  const getStyle = () => ({...styles.checkBox, borderColor: isChecked ? 'grey' : '#fff'})

  return (
    <TouchableOpacity
      onPress={toggleCheckBox}
      style={{ ...getStyle(), ...style }}
    >
      {isChecked && (
        <Svg height="24" width="24" viewBox="0 0 24 24">
          <Path
            d="M20.292 5.292a1 1 0 0 1 0 1.416l-11 11a1 1 0 0 1-1.414 0l-5-5a1 1 0 1 1 1.414-1.414L9 15.586l10.292-10.294a1 1 0 0 1 1.414 0z"
            fill={isChecked ? 'grey' : '#fff'}
          />
        </Svg>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  checkBox: {
    height: 34,
    width: 34,
    borderRadius: 5,
    borderWidth: 2,
    borderColor: "#fff",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default CheckBox;
