import { useFormikContext } from "formik";
import { useEffect, useMemo, useRef } from "react";
import { Keyboard, Text, TouchableWithoutFeedback, View } from "react-native";
import { useTheme } from "react-native-paper";

import { MaterialCommunityIcons } from "@expo/vector-icons";
import { formatDate, formatTime } from "../../../../helpers/general";
import AppErrorMessage from "../../AppErrorMessage";
import ModeSelector from "./ModeSelector";
import OneTimeBlock from "./OneTimeBlock";
import RegularBlock from "./RegularBlock";

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

  const today = useMemo(() => new Date(), []);
  const defaultOneDate = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() + 3);
    return formatDate(d);
  }, [today]);
  const defaultOneTime = useMemo(() => formatTime(today), [today]);
  const defaultRegDate = useMemo(() => {
    const d = new Date(today);
    d.setDate(d.getDate() + 7);
    return formatDate(d);
  }, [today]);
  const defaultRegTime = useMemo(() => formatTime(today), [today]);

  const regType = regular?.type || "all";
  const selectedDays = Array.isArray(regular?.selectedDays)
    ? regular.selectedDays
    : [];
  const isRepeat = Boolean(regular?.repeat);
  const currentRepeat = regular?.repeatDuration;

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

  let totalDays = 0;
  if (mode === "regular") {
    const weeklyCount = regType === "all" ? 7 : selectedDays.length;
    totalDays =
      isRepeat && currentRepeat
        ? weeklyCount * (repeatToWeeks[currentRepeat] || 0)
        : weeklyCount;
  }

  // NEW: ensure one-time bookings count as 1 service day
  if (mode === "oneTime") {
    totalDays = 1;
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
  }, [
    name,
    setFieldTouched,
    setFieldValue,
    values,
    defaultOneDate,
    defaultOneTime,
  ]);

  const cardStyle = {
    backgroundColor: dark ? colors.primary : "",
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

  const updateField = (next) => {
    setFieldValue(name, { ...field, ...next });
    setFieldTouched(name, true);
  };

  const toggleDay = (day) => {
    const arr = Array.isArray(selectedDays) ? selectedDays : [];
    const next = arr.includes(day)
      ? arr.filter((d) => d !== day)
      : [...arr, day];
    updateField({ regular: { ...regular, selectedDays: next } });
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={{ marginTop: 20, paddingHorizontal: 0 }}>
        <Text
          style={{
            fontSize: 18,
            marginBottom: 12,
            color: colors.text,
            fontFamily: fonts.medium?.fontFamily,
          }}
        >
          Service Time
        </Text>

        <ModeSelector
          mode={mode}
          onChange={onModeChange}
          cardStyle={cardStyle}
          dark={dark}
          colors={colors}
        />
        <AppErrorMessage
          error={errors?.[name]?.mode}
          visible={touched?.[name]?.mode}
        />

        {mode === "oneTime" && (
          <OneTimeBlock
            oneTimeDate={oneTimeDate}
            oneTimeTime={oneTimeTime}
            defaultOneDate={defaultOneDate}
            defaultOneTime={defaultOneTime}
            onDateChange={(ds) =>
              updateField({
                mode: "oneTime",
                oneTimeDate: ds,
                oneTimeTime: oneTimeTime || defaultOneTime,
                regular: null,
              })
            }
            onTimeChange={(ts) =>
              updateField({
                mode: "oneTime",
                oneTimeDate: oneTimeDate || defaultOneDate,
                oneTimeTime: ts,
                regular: null,
              })
            }
            errors={errors?.[name]}
            touched={touched?.[name]}
          />
        )}

        {mode === "regular" && (
          <RegularBlock
            regular={regular}
            defaultRegDate={defaultRegDate}
            defaultRegTime={defaultRegTime}
            setRegular={(next) =>
              updateField({ regular: { ...regular, ...next } })
            }
            toggleDay={toggleDay}
            errors={errors?.[name]?.regular}
            touched={touched?.[name]?.regular}
            setRootFieldValue={setFieldValue}
            field={field}
            name={name}
            dark={dark}
            colors={colors}
          />
        )}

        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: colors.surface,
            paddingVertical: 10,
            paddingHorizontal: 16,
            borderRadius: 8,
            marginVertical: 8,
            elevation: 2,
            shadowColor: "#000",
            shadowOffset: { width: 0, height: 2 },
            shadowOpacity: 0.15,
            shadowRadius: 3,
          }}
        >
          <MaterialCommunityIcons
            name="calendar-check"
            size={20}
            color={colors.primary}
            style={{ marginRight: 8 }}
          />
          <Text
            style={{
              color: colors.text,
              fontSize: 16,
              fontWeight: "500",
            }}
          >
            Total Service Days:{" "}
            <Text style={{ color: colors.primary, fontWeight: "700" }}>
              {totalDays}
            </Text>
          </Text>
        </View>
      </View>
    </TouchableWithoutFeedback>
  );
}
