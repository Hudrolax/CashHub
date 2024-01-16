import React from "react";
import CircleItem from "./CircleItem";
import { useFocusEffect } from '@react-navigation/native';
import { useDispatch } from "react-redux";
import { StyleSheet, ScrollView } from "react-native";

import { setDates } from "../actions";
import { blueColor } from "../colors";
import { formatDateShort } from "../util";


export default function Dates() {
  const dispatch = useDispatch();

  const makeDates = () => {
    let currentDate = new Date();
    let currentDatePlus1 = new Date();
    currentDatePlus1.setDate(currentDatePlus1.getDate() + 1);
    let currentDatePlus2 = new Date();
    currentDatePlus2.setDate(currentDatePlus2.getDate() + 2);
    let currentDateMinus1 = new Date();
    currentDateMinus1.setDate(currentDateMinus1.getDate() - 1);
    let currentDateMinus2 = new Date();
    currentDateMinus2.setDate(currentDateMinus2.getDate() - 2);
    const _dates = [
      {
        id: 1,
        title: "Сегодня",
        text: formatDateShort(currentDate),
        date: currentDate.toISOString(),
      },
      {
        id: 2,
        title: "Вчера",
        text: formatDateShort(currentDateMinus1),
        date: currentDateMinus1.toISOString(),
      },
      {
        id: 3,
        title: "Позавчера",
        text: formatDateShort(currentDateMinus2),
        date: currentDateMinus2.toISOString(),
      },
      {
        id: 4,
        title: "Завтра",
        text: formatDateShort(currentDatePlus1),
        date: currentDatePlus1.toISOString(),
      },
      {
        id: 5,
        title: "Послезавтра",
        text: formatDateShort(currentDatePlus2),
        date: currentDatePlus2.toISOString(),
      },
    ];

    return _dates;
  };

  let dates = makeDates();

  useFocusEffect(
    React.useCallback(() => {
      dates = makeDates();
      dispatch(setDates(dates));

      return () => {
        // Опционально: Ваш код здесь - выполняется при потере фокуса экрана
      };
    }, [])
  );

  return (
    <ScrollView
      style={styles.column}
      contentContainerStyle={styles.columnContent}
    >
      {dates.map((item) => (
        <CircleItem
          key={item.id}
          title={item.title}
          circleColor={blueColor}
          circleText={item.text}
          subtitle={""}
          object={item}
          object_type={"date"}
          pressible={true}
        />
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  column: {
    flex: 1,
  },
  columnContent: {
    alignItems: "center",
  },
});
