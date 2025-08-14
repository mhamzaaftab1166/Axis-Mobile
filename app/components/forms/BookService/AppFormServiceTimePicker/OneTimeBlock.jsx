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
  const { colors, fonts } = useTheme();
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
    <Card style={[styles.card]}>
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
              <Text
                style={[
                  styles.pickerText,
                  { color: colors.text, fontFamily: fonts.medium?.fontFamily },
                ]}
              >
                {oneTimeDate || defaultOneDate}
              </Text>
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
              <Text
                style={[
                  styles.pickerText,
                  { color: colors.text, fontFamily: fonts.medium?.fontFamily },
                ]}
              >
                {oneTimeTime || defaultOneTime}
              </Text>
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
    fontSize: 14,
    marginBottom: 8,
    fontWeight: "600",
  },
  pickerButton: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
  },
  pickerText: {
    fontSize: 16,
  },
});
