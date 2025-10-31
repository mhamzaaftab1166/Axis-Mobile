import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import { useFormikContext } from "formik";
import { useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Text, useTheme } from "react-native-paper";
import { TimePickerModal } from "react-native-paper-dates";
import AppErrorMessage from "./AppErrorMessage";

const parseHM = (s) => {
  if (!s) return null;
  const parts = s.split(":");
  if (parts.length !== 2) return null;
  const [h, m] = parts.map(Number);
  if (Number.isNaN(h) || Number.isNaN(m)) return null;
  return { hours: h, minutes: m };
};

const toHM = ({ hours, minutes }) => {
  if (hours == null || minutes == null) return "";
  const hh = String(hours).padStart(2, "0");
  const mm = String(minutes).padStart(2, "0");
  return `${hh}:${mm}`;
};

export default function AppFormTimeInput({
  name,
  label,
  parentStyles,
  locale = "en",
  iconName = "clock-outline",
  iconSize = 20,
}) {
  const { colors, fonts, dark } = useTheme();
  const { values, setFieldValue, touched, errors } = useFormikContext();
  const formVal = values?.[name];
  const parsedVal = parseHM(formVal);
  const [visible, setVisible] = useState(false);

  const onConfirm = ({ hours, minutes }) => {
    setVisible(false);
    setFieldValue(name, toHM({ hours, minutes }));
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
              {formVal ? toHM(parsedVal) : "Select Time"}
            </Text>
          </View>
        </TouchableOpacity>

        <TimePickerModal
          locale={locale}
          visible={visible}
          onDismiss={() => setVisible(false)}
          onConfirm={onConfirm}
          label="Select Time"
          saveLabel="OK"
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
    gap: 6,
  },
  text: {
    fontSize: 15,
    textAlign: "center",
  },
});
