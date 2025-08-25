import { useMemo, useState } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Card, useTheme } from "react-native-paper";
import {
  DatePickerModal,
  en,
  registerTranslation,
  TimePickerModal,
} from "react-native-paper-dates";
import MaterialCommunityIcons from "react-native-vector-icons/MaterialCommunityIcons";
import {
  formatDate,
  formatTime,
  parseDateToPicker,
  parseTimeToPicker,
} from "../../../../helpers/general";
import AppErrorMessage from "../../AppErrorMessage";
registerTranslation("en", en);

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
  const [dateVisible, setDateVisible] = useState(false);
  const [timeVisible, setTimeVisible] = useState(false);

  const minDate = useMemo(() => {
    const msInDay = 24 * 60 * 60 * 1000;
    return new Date(Date.now() + 2 * msInDay);
  }, []);

  const openPicker = (type) => {
    if (type === "date") setDateVisible(true);
    else setTimeVisible(true);
  };

  const onConfirmDate = ({ date }) => {
    setDateVisible(false);
    if (date) onDateChange(formatDate(date));
  };

  const onConfirmTime = ({ hours, minutes }) => {
    setTimeVisible(false);
    const d = new Date();
    d.setHours(hours, minutes, 0, 0);
    onTimeChange(formatTime(d));
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

        <DatePickerModal
          locale="en"
          mode="single"
          visible={dateVisible}
          onDismiss={() => setDateVisible(false)}
          date={parseDateToPicker(oneTimeDate || defaultOneDate)}
          onConfirm={onConfirmDate}
          validRange={{ startDate: minDate }}
        />

        <TimePickerModal
          visible={timeVisible}
          onDismiss={() => setTimeVisible(false)}
          onConfirm={onConfirmTime}
          hours={parseTimeToPicker(oneTimeTime || defaultOneTime).getHours()}
          minutes={parseTimeToPicker(
            oneTimeTime || defaultOneTime
          ).getMinutes()}
          use24HourClock={false}
        />
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
