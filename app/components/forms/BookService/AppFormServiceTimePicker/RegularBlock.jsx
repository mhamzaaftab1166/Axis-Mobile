import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
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
import { DatePickerModal, TimePickerModal } from "react-native-paper-dates";
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
}) {
  const { colors, dark, fonts } = useTheme();
  const [dateVisible, setDateVisible] = useState(false);
  const [timeVisible, setTimeVisible] = useState(false);

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

  const minDate = useMemo(() => {
    const msInDay = 24 * 60 * 60 * 1000;
    return new Date(Date.now() + 6 * msInDay);
  }, []);

  const openPicker = (type) => {
    if (type === "date") setDateVisible(true);
    else setTimeVisible(true);
  };

  const onConfirmDate = ({ date }) => {
    setDateVisible(false);
    if (date) setRegular({ ...regular, startDate: formatDate(date) });
  };

  const onConfirmTime = ({ hours, minutes }) => {
    setTimeVisible(false);
    const d = new Date();
    d.setHours(hours, minutes, 0, 0);
    setRegular({ ...regular, startTime: formatTime(d) });
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
              style: {
                borderColor: colors.outline,
                borderWidth: 1,
                backgroundColor:
                  regType === "all" ? colors.tertiary : colors.surface,
              },
              labelStyle: {
                color: regType === "all" ? "#fff" : colors.text,
                fontFamily: fonts.medium?.fontFamily,
              },
              showSelectedCheck: false,
              accessibilityLabel: "Choose all days",
            },
            {
              value: "selected",
              label: "Select Days",
              style: {
                borderColor: colors.outline,
                borderWidth: 1,
                backgroundColor:
                  regType === "selected" ? colors.tertiary : colors.surface,
              },
              labelStyle: {
                color: regType === "selected" ? "#fff" : colors.text,
                fontFamily: fonts.medium?.fontFamily,
              },
              showSelectedCheck: false,
              accessibilityLabel: "Choose selected days",
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
                          backgroundColor: colors.tertiary,
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
              <MaterialCommunityIcons
                name="calendar-month"
                size={18}
                color={colors.text}
                style={{ marginRight: 8 }}
              />
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
              <MaterialCommunityIcons
                name="clock-outline"
                size={18}
                color={colors.text}
                style={{ marginRight: 8 }}
              />
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
            color={colors.tertiary}
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
                          backgroundColor: colors.tertiary,
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

        <DatePickerModal
          locale="en"
          mode="single"
          visible={dateVisible}
          onDismiss={() => setDateVisible(false)}
          date={parseDateToPicker(regular?.startDate || defaultRegDate)}
          onConfirm={onConfirmDate}
          validRange={{ startDate: minDate }}
        />

        <TimePickerModal
          visible={timeVisible}
          onDismiss={() => setTimeVisible(false)}
          onConfirm={onConfirmTime}
          hours={parseTimeToPicker(
            regular?.startTime || defaultRegTime
          ).getHours()}
          minutes={parseTimeToPicker(
            regular?.startTime || defaultRegTime
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
    fontSize: 13,
    marginBottom: 6,
    fontWeight: "600",
    opacity: 0.9,
  },
  pickerButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 36,
    borderRadius: 8,
    borderWidth: 1,
    paddingHorizontal: 10,
    paddingVertical: 0,
  },
  pickerText: {
    fontSize: 14,
    lineHeight: 18,
  },
  repeatRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
});
