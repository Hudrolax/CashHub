import { View, StyleSheet } from "react-native";
import React, { useState } from "react";

import { DropList } from "./DropList";
import { Field } from "./Field";
import { OkBtn } from "./OkBtn";

const transformIncome = (value) => {
    switch (value){
        case true:
            return "Доходы"
        case false:
            return "Расходы"
        case "Доходы":
            return true
        case "Расходы":
            return false
    }
}

export const ExInItemEdit = ({ exInItem, style, onOk }) => {
  const [exInItemName, setExInItemName] = useState(exInItem.name);
  const [income, setIncome] = useState(exInItem.income);

  return (
    <View style={{...styles.body, ...style}}>
      <Field
        hint={"Имя:"}
        value={exInItemName}
        setValue={setExInItemName}
        style={{ marginBottom: 20 }}
      />

      <DropList
        hint={"доход/расход:"}
        value={transformIncome(income)}
        options={[true, false].map((i) => transformIncome(i))}
        setValue={(value) => setIncome(transformIncome(value))}
        style={{ marginBottom: 20 }}
      />

      <OkBtn
        isActive={true}
        text={"Ok"}
        onPress={() => onOk({id: exInItem.id, name: exInItemName, income: income})}
        style={{ marginTop: 40 }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  body: {
    backgroundColor: "#171717",
    justifyContent: "center",
    alignItems: "center",
  },
});
