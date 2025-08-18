import DateTimePicker, {
  DateTimePickerAndroid,
} from "@react-native-community/datetimepicker";
import { useState } from "react";
import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Card, useTheme } from "react-native-paper";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {
  formatDate,
  formatTime,
  parseDateToPicker,
  parseTimeToPicker,
} from "../../../../helpers/general";
import AppErrorMessage from "../../AppErrorMessage";

export default function OneTimeBlock({
  oneTimeDate,
  oneTimeTime,
  defaultOneDate,
  defaultOneTime,
  onDateChange,
  onTimeChange,
  errors,
  touched,
}) {
  const { colors, fonts, dark } = useTheme();
  const [iosPicker, setIosPicker] = useState(null);

  const onOneTimeDateChange = (event, date) => {
    if (event?.type === "dismissed") {
      setIosPicker(null);
      return;
    }
    if (date) onDateChange(formatDate(date));
    setIosPicker(null);
  };

  const onOneTimeTimeChange = (event, date) => {
    if (event?.type === "dismissed") {
      setIosPicker(null);
      return;
    }
    if (date) onTimeChange(formatTime(date));
    setIosPicker(null);
  };

  const showAndroidDatePicker = () =>
    DateTimePickerAndroid.open({
      value: parseDateToPicker(oneTimeDate || defaultOneDate),
      mode: "date",
      onChange: (e, d) => {
        if (e?.type === "dismissed") return;
        if (d) onDateChange(formatDate(d));
      },
      minimumDate: parseDateToPicker(defaultOneDate),
    });

  const showAndroidTimePicker = () =>
    DateTimePickerAndroid.open({
      value: parseTimeToPicker(oneTimeTime || defaultOneTime),
      mode: "time",
      is24Hour: false,
      onChange: (e, d) => {
        if (e?.type === "dismissed") return;
        if (d) onTimeChange(formatTime(d));
      },
    });

  const openPicker = (type) => {
    if (Platform.OS === "android") {
      if (type === "date") showAndroidDatePicker();
      else showAndroidTimePicker();
      return;
    }
    setIosPicker(type);
  };

  return (
    <Card
      style={[
        styles.card,
        {
          backgroundColor: colors.background,
          borderWidth: 1,
          elevation: 3,
          borderWidth: dark ? 1 : 0,
          borderColor: dark ? "#333" : "transparent",
        },
      ]}
    >
      <Card.Content>
        <View style={styles.rowEqual}>
          <View style={[styles.flexItem, styles.leftItem]}>
            <Text
              style={[
                styles.label,
                { color: colors.text, fontFamily: fonts.medium?.fontFamily },
              ]}
            >
              Date
            </Text>

            <TouchableOpacity
              onPress={() => openPicker("date")}
              activeOpacity={0.85}
              style={[
                styles.pickerButton,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.outline,
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Open date picker"
            >
              <View style={styles.pickerInner}>
                <MaterialCommunityIcons
                  name="calendar-month"
                  size={18}
                  color={colors.text}
                  style={styles.icon}
                />
                <Text
                  style={[
                    styles.pickerText,
                    {
                      color: colors.text,
                      fontFamily: fonts.medium?.fontFamily,
                    },
                  ]}
                  numberOfLines={1}
                >
                  {oneTimeDate || defaultOneDate}
                </Text>
              </View>
            </TouchableOpacity>

            <AppErrorMessage
              error={errors?.oneTimeDate}
              visible={touched?.oneTimeDate}
            />
          </View>

          <View style={styles.flexItem}>
            <Text
              style={[
                styles.label,
                { color: colors.text, fontFamily: fonts.medium?.fontFamily },
              ]}
            >
              Time
            </Text>

            <TouchableOpacity
              onPress={() => openPicker("time")}
              activeOpacity={0.85}
              style={[
                styles.pickerButton,
                {
                  backgroundColor: colors.surface,
                  borderColor: colors.outline,
                },
              ]}
              accessibilityRole="button"
              accessibilityLabel="Open time picker"
            >
              <View style={styles.pickerInner}>
                <MaterialCommunityIcons
                  name="clock-outline"
                  size={18}
                  color={colors.text}
                  style={styles.icon}
                />
                <Text
                  style={[
                    styles.pickerText,
                    {
                      color: colors.text,
                      fontFamily: fonts.medium?.fontFamily,
                    },
                  ]}
                  numberOfLines={1}
                >
                  {oneTimeTime || defaultOneTime}
                </Text>
              </View>
            </TouchableOpacity>

            <AppErrorMessage
              error={errors?.oneTimeTime}
              visible={touched?.oneTimeTime}
            />
          </View>
        </View>

        {iosPicker === "date" && (
          <DateTimePicker
            value={parseDateToPicker(oneTimeDate || defaultOneDate)}
            mode="date"
            display="spinner"
            minimumDate={parseDateToPicker(defaultOneDate)}
            onChange={onOneTimeDateChange}
          />
        )}

        {iosPicker === "time" && (
          <DateTimePicker
            value={parseTimeToPicker(oneTimeTime || defaultOneTime)}
            mode="time"
            display="spinner"
            is24Hour={false}
            onChange={onOneTimeTimeChange}
          />
        )}
      </Card.Content>
    </Card>
  );
}

const styles = StyleSheet.create({
  card: {
    borderRadius: 10,
    marginBottom: 16,
  },
  rowEqual: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  flexItem: {
    flex: 1,
  },
  leftItem: {
    marginRight: 10,
  },
  label: {
    fontSize: 13,
    marginBottom: 6,
    fontWeight: "600",
    opacity: 0.9,
  },
  pickerButton: {
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  pickerInner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  icon: {
    marginRight: 8,
    opacity: 0.9,
  },
  pickerText: {
    fontSize: 15,
    fontWeight: "500",
    letterSpacing: 0.2,
  },
});
