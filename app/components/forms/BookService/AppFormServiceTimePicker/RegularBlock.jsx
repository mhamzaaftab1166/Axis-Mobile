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
import {
  Card,
  Chip,
  SegmentedButtons,
  Switch,
  useTheme,
} from "react-native-paper";
import {
  formatDate,
  formatTime,
  parseDateToPicker,
  parseTimeToPicker,
} from "../../../../helpers/general";
import AppErrorMessage from "../../AppErrorMessage";

const daysOfWeek = [
  { label: "Mon", value: "mon" },
  { label: "Tue", value: "tue" },
  { label: "Wed", value: "wed" },
  { label: "Thu", value: "thu" },
  { label: "Fri", value: "fri" },
  { label: "Sat", value: "sat" },
  { label: "Sun", value: "sun" },
];

const repeatOptions = [
  { label: "1 week", value: "1w" },
  { label: "2 weeks", value: "2w" },
  { label: "3 weeks", value: "3w" },
  { label: "1 month", value: "1m" },
  { label: "2 months", value: "2m" },
  { label: "3 months", value: "3m" },
  { label: "6 months", value: "6m" },
  { label: "9 months", value: "9m" },
  { label: "1 year", value: "1y" },
];

export default function RegularBlock({
  regular = {},
  defaultRegDate,
  defaultRegTime,
  setRegular,
  toggleDay,
  errors = {},
  touched = {},
  setRootFieldValue,
  field,
  name,
}) {
  const { colors, dark, fonts } = useTheme();
  const [iosPicker, setIosPicker] = useState(null);

  const regType = regular?.type || "all";
  const selectedDays = Array.isArray(regular?.selectedDays)
    ? regular.selectedDays
    : [];

  const onRegTypeChange = (newType) => {
    if (newType === regType) return;
    setRegular({
      type: newType,
      startDate: regular?.startDate || defaultRegDate,
      startTime: regular?.startTime || defaultRegTime,
      selectedDays: newType === "all" ? null : [],
      repeat: regular?.repeat || false,
      repeatDuration: regular?.repeatDuration || null,
    });
  };

  const onRegStartDateChange = (event, date) => {
    if (event?.type === "dismissed") return;
    if (date) setRegular({ ...regular, startDate: formatDate(date) });
  };
  const onRegStartTimeChange = (event, date) => {
    if (event?.type === "dismissed") return;
    if (date) setRegular({ ...regular, startTime: formatTime(date) });
  };

  const showAndroidDatePickerRegular = () =>
    DateTimePickerAndroid.open({
      value: parseDateToPicker(regular?.startDate || defaultRegDate),
      mode: "date",
      onChange: onRegStartDateChange,
      minimumDate: parseDateToPicker(defaultRegDate),
    });

  const showAndroidTimePickerRegular = () =>
    DateTimePickerAndroid.open({
      value: parseTimeToPicker(regular?.startTime || defaultRegTime),
      mode: "time",
      is24Hour: false,
      onChange: onRegStartTimeChange,
    });

  const openPicker = (type) => {
    if (Platform.OS === "android") {
      if (type === "date") showAndroidDatePickerRegular();
      else showAndroidTimePickerRegular();
      return;
    }
    setIosPicker(type);
  };

  const onIosPickerChange = (event, date) => {
    if (event?.type === "dismissed") {
      setIosPicker(null);
      return;
    }
    if (date) {
      if (iosPicker === "date") onRegStartDateChange(event, date);
      else onRegStartTimeChange(event, date);
    }
    setIosPicker(null);
  };

  return (
    <Card style={[styles.card]}>
      <Card.Content>
        <Text
          style={[
            styles.sectionTitle,
            { color: colors.text, fontFamily: fonts.medium?.fontFamily },
          ]}
        >
          Regular Schedule
        </Text>

        <SegmentedButtons
          value={regType}
          onValueChange={onRegTypeChange}
          style={styles.segmented}
          buttons={[
            {
              value: "all",
              label: "All Days",
              style: { borderColor: dark ? colors.secondary : colors.primary },
              checkedColor: dark ? colors.secondary : colors.primary,
              uncheckedColor: colors.text,
              labelStyle: {
                color: colors.text,
                fontFamily: fonts.medium?.fontFamily,
              },
              showSelectedCheck: false,
            },
            {
              value: "selected",
              label: "Select Days",
              style: { borderColor: dark ? colors.secondary : colors.primary },
              checkedColor: dark ? colors.secondary : colors.primary,
              uncheckedColor: colors.text,
              labelStyle: {
                color: colors.text,
                fontFamily: fonts.medium?.fontFamily,
              },
              showSelectedCheck: false,
            },
          ]}
        />
        <AppErrorMessage error={errors?.type} visible={touched?.type} />

        {regType === "selected" && (
          <View style={styles.chipRow}>
            {daysOfWeek.map((d) => {
              const selected = selectedDays.includes(d.value);
              return (
                <Chip
                  key={d.value}
                  mode="flat"
                  selected={selected}
                  onPress={() => toggleDay(d.value)}
                  style={[
                    styles.chip,
                    selected
                      ? {
                          backgroundColor: dark
                            ? colors.secondary
                            : colors.primary,
                          borderColor: dark ? colors.secondary : colors.primary,
                        }
                      : {
                          backgroundColor: colors.surface,
                          borderColor: colors.disabled,
                        },
                  ]}
                  textStyle={{
                    color: selected ? colors.onPrimary : colors.text,
                    fontFamily: fonts.medium?.fontFamily,
                  }}
                >
                  {d.label}
                </Chip>
              );
            })}
            <AppErrorMessage
              error={errors?.selectedDays}
              visible={touched?.selectedDays}
            />
          </View>
        )}

        <View style={[styles.rowEqual, { marginTop: 20 }]}>
          <View style={[styles.flexItem, styles.leftItem]}>
            <Text
              style={[
                styles.fieldLabel,
                { color: colors.text, fontFamily: fonts.medium?.fontFamily },
              ]}
            >
              Start Date
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
              accessibilityLabel="Open start date picker"
            >
              <Text
                style={[
                  styles.pickerText,
                  { color: colors.text, fontFamily: fonts.medium?.fontFamily },
                ]}
              >
                {regular?.startDate || defaultRegDate}
              </Text>
            </TouchableOpacity>

            <AppErrorMessage
              error={errors?.startDate}
              visible={touched?.startDate}
            />
          </View>

          <View style={styles.flexItem}>
            <Text
              style={[
                styles.fieldLabel,
                { color: colors.text, fontFamily: fonts.medium?.fontFamily },
              ]}
            >
              Start Time
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
              accessibilityLabel="Open start time picker"
            >
              <Text
                style={[
                  styles.pickerText,
                  { color: colors.text, fontFamily: fonts.medium?.fontFamily },
                ]}
              >
                {regular?.startTime || defaultRegTime}
              </Text>
            </TouchableOpacity>

            <AppErrorMessage
              error={errors?.startTime}
              visible={touched?.startTime}
            />
          </View>
        </View>

        <View
          style={[
            styles.repeatRow,
            { marginTop: Platform.OS === "ios" ? 8 : 0 },
          ]}
        >
          <Text
            style={[
              styles.fieldLabel,
              { color: colors.text, fontFamily: fonts.medium?.fontFamily },
            ]}
          >
            Repeat?
          </Text>
          <Switch
            value={Boolean(regular?.repeat)}
            color={dark ? colors.secondary : colors.primary}
            onValueChange={(val) =>
              setRegular({
                ...regular,
                repeat: val,
                repeatDuration: val ? regular?.repeatDuration || "1w" : null,
              })
            }
          />
        </View>

        {Boolean(regular?.repeat) && (
          <View style={styles.chipRow}>
            {repeatOptions.map((opt) => {
              const selected = regular?.repeatDuration === opt.value;
              return (
                <Chip
                  key={opt.value}
                  mode="flat"
                  selected={selected}
                  onPress={() =>
                    setRegular({ ...regular, repeatDuration: opt.value })
                  }
                  style={[
                    styles.chip,
                    selected
                      ? {
                          backgroundColor: dark
                            ? colors.secondary
                            : colors.primary,
                          borderColor: dark ? colors.secondary : colors.primary,
                        }
                      : {
                          backgroundColor: colors.surface,
                          borderColor: colors.disabled,
                        },
                  ]}
                  textStyle={{
                    color: selected ? colors.onPrimary : colors.text,
                    fontFamily: fonts.medium?.fontFamily,
                  }}
                >
                  {opt.label}
                </Chip>
              );
            })}
            <AppErrorMessage
              error={errors?.repeatDuration}
              visible={touched?.repeatDuration}
            />
          </View>
        )}

        {iosPicker && (
          <DateTimePicker
            value={
              iosPicker === "date"
                ? parseDateToPicker(regular?.startDate || defaultRegDate)
                : parseTimeToPicker(regular?.startTime || defaultRegTime)
            }
            mode={iosPicker}
            display="spinner"
            onChange={onIosPickerChange}
            is24Hour={false}
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
  sectionTitle: {
    fontSize: 14,
    marginBottom: 6,
    fontWeight: "600",
  },
  segmented: {
    marginVertical: 8,
  },
  chipRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 8,
  },
  chip: {
    margin: 4,
    borderWidth: 1,
  },
  rowEqual: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  flexItem: {
    flex: 1,
  },
  leftItem: {
    marginRight: 10,
  },
  fieldLabel: {
    fontSize: 14,
    marginBottom: 8,
    fontWeight: "600",
  },
  pickerButton: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    alignItems: "center",
    borderWidth: 1,
  },
  pickerText: {
    fontSize: 16,
  },
  repeatRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
