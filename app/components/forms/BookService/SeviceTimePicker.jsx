import DateTimePicker from "@react-native-community/datetimepicker";
import { useFormikContext } from "formik";
import { useEffect, useRef } from "react";
import {
  Keyboard,
  StyleSheet,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import {
  Card,
  Chip,
  SegmentedButtons,
  Switch,
  Text,
  useTheme,
} from "react-native-paper";
import AppErrorMessage from "../AppErrorMessage";

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

const repeatToWeeks = {
  "1w": 1,
  "2w": 2,
  "3w": 3,
  "1m": 4,
  "2m": 8,
  "3m": 12,
  "6m": 26,
  "9m": 39,
  "1y": 52,
};

// Helpers to format and parse
const formatDate = (date) => {
  const d = new Date(date);
  const yyyy = d.getFullYear();
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const dd = String(d.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};
const formatTime = (date) => {
  const d = new Date(date);
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
};
const parseDateToPicker = (dateString) => {
  if (!dateString) return new Date();
  const [yyyy, mm, dd] = dateString.split("-").map(Number);
  return new Date(yyyy, mm - 1, dd);
};
const parseTimeToPicker = (timeString) => {
  if (!timeString) return new Date();
  const [hh, mm] = timeString.split(":").map(Number);
  const d = new Date();
  d.setHours(hh, mm, 0, 0);
  return d;
};

export default function AppFormServiceTimePicker({ name }) {
  const { colors, fonts, dark } = useTheme();
  const { values, errors, touched, setFieldValue, setFieldTouched } =
    useFormikContext();

  const field = values[name] || {};
  const {
    mode = null,
    oneTimeDate = null,
    oneTimeTime = null,
    regular = null,
  } = field;

  const regType = regular?.type || "all";
  const selectedDays = Array.isArray(regular?.selectedDays)
    ? regular.selectedDays
    : [];
  const isRepeat = Boolean(regular?.repeat);
  const currentRepeat = regular?.repeatDuration;

  const today = new Date();
  // Defaults: date strings and time strings
  const defaultOneDate = (() => {
    const d = new Date(today);
    d.setDate(d.getDate() + 3);
    return formatDate(d);
  })();
  const defaultOneTime = formatTime(today);
  const defaultRegDate = (() => {
    const d = new Date(today);
    d.setDate(d.getDate() + 7);
    return formatDate(d);
  })();
  const defaultRegTime = formatTime(today);

  // compute totalDays
  let totalDays = 0;
  if (mode === "regular") {
    const weeklyCount = regType === "all" ? 7 : selectedDays.length;
    totalDays =
      isRepeat && currentRepeat
        ? weeklyCount * (repeatToWeeks[currentRepeat] || 0)
        : weeklyCount;
  }

  const init = useRef(false);
  useEffect(() => {
    if (init.current) return;
    const existing = values[name];
    if (
      existing &&
      typeof existing === "object" &&
      (existing.mode === "oneTime" || existing.mode === "regular")
    ) {
      init.current = true;
      return;
    }
    setFieldValue(name, {
      mode: "oneTime",
      oneTimeDate: defaultOneDate,
      oneTimeTime: defaultOneTime,
      regular: null,
    });
    init.current = true;
    setFieldTouched(name, true);
  }, [name, setFieldValue, setFieldTouched, values[name]]);

  const cardStyle = {
    backgroundColor: dark ? colors.primary : colors.background,
    borderColor: dark ? colors.secondary : colors.primary,
  };

  const onModeChange = (newMode) => {
    if (newMode === mode) return;
    const baseRegular = {
      type: "all",
      startDate: defaultRegDate,
      startTime: defaultRegTime,
      selectedDays: [],
      repeat: false,
      repeatDuration: null,
    };
    setFieldValue(name, {
      mode: newMode,
      oneTimeDate: newMode === "oneTime" ? defaultOneDate : null,
      oneTimeTime: newMode === "oneTime" ? defaultOneTime : null,
      regular: newMode === "regular" ? baseRegular : null,
    });
    setFieldTouched(name, true);
  };

  const onOneTimeDateChange = (event, date) => {
    if (event.type === "dismissed") return;
    if (date) {
      const ds = formatDate(date);
      setFieldValue(name, {
        ...field,
        mode: "oneTime",
        oneTimeDate: ds,
        oneTimeTime: oneTimeTime || defaultOneTime,
        regular: null,
      });
      setFieldTouched(name, true);
    }
  };
  const onOneTimeTimeChange = (event, date) => {
    if (event.type === "dismissed") return;
    if (date) {
      const ts = formatTime(date);
      setFieldValue(name, {
        ...field,
        mode: "oneTime",
        oneTimeDate: oneTimeDate || defaultOneDate,
        oneTimeTime: ts,
        regular: null,
      });
      setFieldTouched(name, true);
    }
  };

  const onRegTypeChange = (newType) => {
    if (newType === regType) return;
    setFieldValue(name, {
      ...field,
      regular: {
        ...regular,
        type: newType,
        startDate: regular?.startDate || defaultRegDate,
        startTime: regular?.startTime || defaultRegTime,
        selectedDays: newType === "all" ? null : [],
        repeat: regular?.repeat || false,
        repeatDuration: regular?.repeatDuration || null,
      },
    });
    setFieldTouched(name, true);
  };

  const onRegStartDateChange = (event, date) => {
    if (event.type === "dismissed") return;
    if (date) {
      const ds = formatDate(date);
      setFieldValue(name, {
        ...field,
        regular: {
          ...regular,
          startDate: ds,
          startTime: regular?.startTime || defaultRegTime,
        },
      });
      setFieldTouched(name, true);
    }
  };
  const onRegStartTimeChange = (event, date) => {
    if (event.type === "dismissed") return;
    if (date) {
      const ts = formatTime(date);
      setFieldValue(name, {
        ...field,
        regular: {
          ...regular,
          startDate: regular?.startDate || defaultRegDate,
          startTime: ts,
        },
      });
      setFieldTouched(name, true);
    }
  };

  const toggleDay = (day) => {
    const arr = Array.isArray(selectedDays) ? selectedDays : [];
    const next = arr.includes(day)
      ? arr.filter((d) => d !== day)
      : [...arr, day];
    setFieldValue(name, {
      ...field,
      regular: { ...regular, selectedDays: next },
    });
    setFieldTouched(name, true);
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Text
          style={[
            styles.title,
            { color: colors.text, fontFamily: fonts.medium?.fontFamily },
          ]}
        >
          Service Time
        </Text>
        <Card style={[styles.card, cardStyle]}>
          <Card.Content>
            <SegmentedButtons
              value={mode}
              onValueChange={onModeChange}
              buttons={[
                {
                  value: "oneTime",
                  label: "One Time",
                  style: { borderColor: cardStyle.borderColor },
                  checkedColor: dark ? colors.secondary : colors.primary,
                  uncheckedColor: colors.text,
                  labelStyle: { color: colors.text },
                  showSelectedCheck: false,
                },
                {
                  value: "regular",
                  label: "Regular",
                  style: { borderColor: cardStyle.borderColor },
                  checkedColor: dark ? colors.secondary : colors.primary,
                  uncheckedColor: colors.text,
                  labelStyle: { color: colors.text },
                  showSelectedCheck: false,
                },
              ]}
            />
            <AppErrorMessage
              error={errors?.[name]?.mode}
              visible={touched?.[name]?.mode}
            />
          </Card.Content>
        </Card>

        {mode === "oneTime" && (
          <Card style={[styles.card, cardStyle]}>
            <Card.Content>
              <View style={styles.row}>
                <View style={styles.flexItem}>
                  <Text style={[styles.section, { color: colors.text }]}>
                    Date
                  </Text>
                  <DateTimePicker
                    value={parseDateToPicker(oneTimeDate || defaultOneDate)}
                    mode="date"
                    minimumDate={parseDateToPicker(defaultOneDate)}
                    onChange={onOneTimeDateChange}
                  />
                  <AppErrorMessage
                    error={errors?.[name]?.oneTimeDate}
                    visible={touched?.[name]?.oneTimeDate}
                  />
                </View>
                <View style={styles.flexItem}>
                  <Text style={[styles.section, { color: colors.text }]}>
                    Time
                  </Text>
                  <DateTimePicker
                    value={parseTimeToPicker(oneTimeTime || defaultOneTime)}
                    mode="time"
                    is24Hour={false}
                    onChange={onOneTimeTimeChange}
                  />
                  <AppErrorMessage
                    error={errors?.[name]?.oneTimeTime}
                    visible={touched?.[name]?.oneTimeTime}
                  />
                </View>
              </View>
            </Card.Content>
          </Card>
        )}

        {mode === "regular" && (
          <Card style={[styles.card, cardStyle]}>
            <Card.Content>
              <Text style={[styles.section, { color: colors.text }]}>
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
                    style: { borderColor: cardStyle.borderColor },
                    checkedColor: dark ? colors.secondary : colors.primary,
                    uncheckedColor: colors.text,
                    labelStyle: { color: colors.text },
                    showSelectedCheck: false,
                  },
                  {
                    value: "selected",
                    label: "Select Days",
                    style: { borderColor: cardStyle.borderColor },
                    checkedColor: dark ? colors.secondary : colors.primary,
                    uncheckedColor: colors.text,
                    labelStyle: { color: colors.text },
                    showSelectedCheck: false,
                  },
                ]}
              />
              <AppErrorMessage
                error={errors?.[name]?.regular?.type}
                visible={touched?.[name]?.regular?.type}
              />
              {regType === "selected" && (
                <View style={styles.chipRow}>
                  {daysOfWeek.map((d) => (
                    <Chip
                      key={d.value}
                      mode="flat"
                      selected={selectedDays.includes(d.value)}
                      selectedColor={
                        selectedDays.includes(d.value)
                          ? dark
                            ? colors.onSecondary
                            : colors.onPrimary
                          : colors.text
                      }
                      onPress={() => toggleDay(d.value)}
                      style={[
                        styles.chip,
                        {
                          backgroundColor: selectedDays.includes(d.value)
                            ? dark
                              ? colors.secondary
                              : colors.primary
                            : cardStyle.backgroundColor,
                          borderColor: cardStyle.borderColor,
                        },
                      ]}
                      textStyle={{
                        color: selectedDays.includes(d.value)
                          ? colors.onPrimary
                          : colors.text,
                      }}
                    >
                      {d.label}
                    </Chip>
                  ))}
                  <AppErrorMessage
                    error={errors?.[name]?.regular?.selectedDays}
                    visible={touched?.[name]?.regular?.selectedDays}
                  />
                </View>
              )}
              <View style={styles.row}>
                <View style={styles.flexItem}>
                  <Text style={[styles.section, { color: colors.text }]}>
                    Start Date
                  </Text>
                  <DateTimePicker
                    value={parseDateToPicker(
                      regular?.startDate || defaultRegDate
                    )}
                    mode="date"
                    minimumDate={parseDateToPicker(defaultRegDate)}
                    onChange={onRegStartDateChange}
                  />
                  <AppErrorMessage
                    error={errors?.[name]?.regular?.startDate}
                    visible={touched?.[name]?.regular?.startDate}
                  />
                </View>
                <View style={styles.flexItem}>
                  <Text style={[styles.section, { color: colors.text }]}>
                    Start Time
                  </Text>
                  <DateTimePicker
                    value={parseTimeToPicker(
                      regular?.startTime || defaultRegTime
                    )}
                    mode="time"
                    is24Hour={false}
                    onChange={onRegStartTimeChange}
                  />
                  <AppErrorMessage
                    error={errors?.[name]?.regular?.startTime}
                    visible={touched?.[name]?.regular?.startTime}
                  />
                </View>
              </View>
              <View style={styles.repeatRow}>
                <Text style={[styles.section, { color: colors.text }]}>
                  Repeat?
                </Text>
                <Switch
                  value={isRepeat}
                  color={dark ? colors.secondary : colors.primary}
                  onValueChange={(val) =>
                    setFieldValue(name, {
                      ...field,
                      regular: {
                        ...regular,
                        repeat: val,
                        repeatDuration: val ? currentRepeat || "1w" : null,
                      },
                    })
                  }
                />
              </View>
              {isRepeat && (
                <View style={styles.chipRow}>
                  {repeatOptions.map((opt) => (
                    <Chip
                      key={opt.value}
                      mode="flat"
                      selected={currentRepeat === opt.value}
                      selectedColor={
                        currentRepeat === opt.value
                          ? dark
                            ? colors.onSecondary
                            : colors.onPrimary
                          : colors.text
                      }
                      onPress={() =>
                        setFieldValue(name, {
                          ...field,
                          regular: { ...regular, repeatDuration: opt.value },
                        })
                      }
                      style={[
                        styles.chip,
                        {
                          backgroundColor:
                            currentRepeat === opt.value
                              ? dark
                                ? colors.secondary
                                : colors.primary
                              : cardStyle.backgroundColor,
                          borderColor: cardStyle.borderColor,
                        },
                      ]}
                      textStyle={{
                        color:
                          currentRepeat === opt.value
                            ? colors.onPrimary
                            : colors.text,
                      }}
                    >
                      {opt.label}
                    </Chip>
                  ))}
                  <AppErrorMessage
                    error={errors?.[name]?.regular?.repeatDuration}
                    visible={touched?.[name]?.regular?.repeatDuration}
                  />
                </View>
              )}
              <Text style={[styles.section, { color: colors.text }]}>
                Total Service Days: {totalDays}
              </Text>
            </Card.Content>
          </Card>
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  container: { marginTop: 20, paddingHorizontal: 0 },
  title: { fontSize: 18, marginBottom: 12 },
  card: { borderRadius: 10, borderWidth: 1, marginBottom: 16, elevation: 2 },
  section: { fontSize: 14, marginBottom: 6, fontWeight: "600" },
  segmented: { marginVertical: 8 },
  chipRow: { flexDirection: "row", flexWrap: "wrap", marginVertical: 8 },
  chip: { margin: 4, borderWidth: 1 },
  row: { flexDirection: "row", justifyContent: "space-between" },
  flexItem: { flex: 1, marginRight: 8, marginVertical: 20 },
  repeatRow: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
});
