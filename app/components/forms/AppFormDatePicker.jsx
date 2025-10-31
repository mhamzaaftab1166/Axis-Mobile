import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useFormikContext } from "formik";
import { useMemo, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { DatePickerModal } from "react-native-paper-dates";
import AppErrorMessage from "./AppErrorMessage";

const parseYMD = (s) => {
  if (!s) return null;
  const parts = s.split("-");
  if (parts.length !== 3) return null;
  const [y, m, d] = parts.map(Number);
  if (!y || !m || !d) return null;
  return new Date(y, m - 1, d);
};

const toYMD = (d) => {
  if (!d) return "";
  const y = d.getFullYear();
  const m = `${d.getMonth() + 1}`.padStart(2, "0");
  const day = `${d.getDate()}`.padStart(2, "0");
  return `${y}-${m}-${day}`;
};

const uaeNowDate = () => {
  const now = new Date();
  const utc = new Date(now.getTime() + now.getTimezoneOffset() * 60000);
  const uae = new Date(utc.getTime() + 4 * 60 * 60 * 1000);
  return uae;
};

export default function AppFormDateInput({
  name,
  label,
  parentStyles,
  maxDate,
  minDaysOffset = 0,
  locale = "en",
  iconName = "calendar",
  iconSize = 20,
}) {
  const { colors, fonts, dark } = useTheme();
  const { values, setFieldValue, touched, errors } = useFormikContext();
  const formVal = values?.[name]; // expected "YYYY-MM-DD" or empty

  const parsedMax = useMemo(
    () => (typeof maxDate === "string" ? parseYMD(maxDate) : maxDate),
    [maxDate]
  );

  const computedMin = useMemo(() => {
    const base = uaeNowDate();
    base.setHours(0, 0, 0, 0);
    base.setDate(base.getDate() + Math.max(0, Number(minDaysOffset || 0)));
    return base;
  }, [minDaysOffset]);

  const parsedFormVal = useMemo(() => {
    if (!formVal) return null;
    return typeof formVal === "string"
      ? parseYMD(formVal)
      : formVal instanceof Date
      ? formVal
      : null;
  }, [formVal]);

  const modalDate = parsedFormVal || computedMin; // used by modal
  const displayText = formVal ? toYMD(parsedFormVal) : "Select Date";

  const [visible, setVisible] = useState(false);

  const onConfirm = ({ date }) => {
    setVisible(false);
    if (!date) return;
    setFieldValue(name, toYMD(date));
  };

  return (
    <>
      <View style={[styles.wrapper, parentStyles]}>
        {label ? (
          <Text
            style={[
              styles.label,
              {
                color: colors.onBackground,
                fontFamily: fonts?.regular?.fontFamily,
              },
            ]}
          >
            {label}
          </Text>
        ) : null}

        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() => setVisible(true)}
          style={[
            styles.input,
            { borderColor: colors.outline, backgroundColor: colors.surface },
          ]}
        >
          <View style={styles.centerRow}>
            <MaterialCommunityIcons
              name={iconName}
              size={iconSize}
              color={dark ? colors.onPrimary : colors.primary}
            />
            <Text
              style={[
                styles.text,
                {
                  color: formVal ? colors.text : colors.placeholder,
                  fontFamily: fonts?.regular?.fontFamily,
                },
              ]}
              numberOfLines={1}
              ellipsizeMode="tail"
            >
              {displayText}
            </Text>
          </View>
        </TouchableOpacity>

        <DatePickerModal
          locale={locale}
          mode="single"
          visible={visible}
          onDismiss={() => setVisible(false)}
          date={modalDate}
          onConfirm={onConfirm}
          validRange={{
            startDate: computedMin,
            endDate: parsedMax || undefined,
          }}
        />
      </View>

      <AppErrorMessage
        error={errors?.[name]}
        visible={Boolean(touched?.[name])}
      />
    </>
  );
}

const styles = StyleSheet.create({
  wrapper: { marginVertical: 6 },
  label: { fontSize: 14, marginBottom: 6 },
  input: {
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderWidth: 1,
    borderRadius: 8,
    justifyContent: "center",
  },
  centerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  text: {
    fontSize: 15,
    textAlign: "center",
  },
});
