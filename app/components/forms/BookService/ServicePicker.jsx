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
  Checkbox,
  Divider,
  RadioButton,
  SegmentedButtons,
  Text,
  TextInput,
  useTheme,
} from "react-native-paper";
import AppErrorMessage from "../AppErrorMessage";

const AppFormServicePicker = ({
  name,
  items = [],
  permanentValue = "Permanent Staff",
  onServiceTypeChange,
}) => {
  const { colors, fonts, dark } = useTheme();
  const { values, errors, touched, setFieldValue, setFieldTouched } =
    useFormikContext();

  const fieldObj = values[name] || { type: "", details: null };
  const selectedType = fieldObj.type;
  const details = fieldObj.details || {};

  const initialized = useRef(false);
  useEffect(() => {
    if (!initialized.current && items.length) {
      if (!values[name] || !values[name].type) {
        const first = items[0];
        const defaultDetails = {
          genderOption: "any",
          anyQty: "",
          femaleRequired: false,
          femaleQty: "",
          maleRequired: false,
          maleQty: "",
          hours: "8h",
        };
        setFieldValue(
          name,
          first.toLowerCase() === permanentValue.toLowerCase()
            ? { type: first, details: defaultDetails }
            : { type: first, details: null }
        );
        setFieldTouched(name, true);
      }
      initialized.current = true;
    }
  }, [items, name, permanentValue, setFieldValue, setFieldTouched, values]);

  const onTypeChange = (newType) => {
    if (newType === selectedType) return;
    const defaultDetails = {
      genderOption: "any",
      anyQty: "",
      femaleRequired: false,
      femaleQty: "",
      maleRequired: false,
      maleQty: "",
      hours: "8h",
    };
    setFieldValue(
      name,
      newType.toLowerCase() === permanentValue.toLowerCase()
        ? { type: newType, details: defaultDetails }
        : { type: newType, details: null }
    );
    setFieldTouched(name, true);
    onServiceTypeChange(newType);
  };

  const renderPermanentDetails = () => {
    if (
      selectedType.toLowerCase() !== permanentValue.toLowerCase() ||
      !fieldObj.details
    )
      return null;
    const cardBg = dark ? colors.secondary : colors.surface;

    // compute total experts
    const totalExperts =
      details.genderOption === "any"
        ? parseInt(details.anyQty, 10) || 0
        : (parseInt(details.femaleQty, 10) || 0) +
          (parseInt(details.maleQty, 10) || 0);

    return (
      <Card
        style={[
          styles.detailsCard,
          {
            backgroundColor: cardBg,
            borderColor: dark ? colors.secondary : colors.primary,
          },
        ]}
      >
        <Card.Content>
          <Text
            style={[
              styles.detailsHeader,
              { color: colors.text, fontFamily: fonts.medium?.fontFamily },
            ]}
          >
            Permanent Staff Details
          </Text>
          <Divider style={{ marginVertical: 8 }} />

          <SegmentedButtons
            value={details.genderOption}
            onValueChange={(val) => {
              setFieldValue(name, {
                type: selectedType,
                details: {
                  ...details,
                  genderOption: val,
                  anyQty: "",
                  femaleRequired: val === "select" ? true : false,
                  femaleQty: "",
                  maleRequired: val === "select" ? true : false,
                  maleQty: "",
                },
              });
              setFieldTouched(name, true);
            }}
            buttons={[
              { value: "any", label: "Any Gender" },
              { value: "select", label: "Select Gender" },
            ]}
            style={{ marginVertical: 12 }}
          />
          <AppErrorMessage
            error={errors?.[name]?.details?.genderOption}
            visible={touched?.[name]?.details?.genderOption}
          />

          {details.genderOption === "any" && (
            <>
              <TextInput
                mode="flat"
                label="Quantity"
                value={details.anyQty}
                onChangeText={(text) =>
                  setFieldValue(name, {
                    type: selectedType,
                    details: { ...details, anyQty: text },
                  })
                }
                onBlur={() => setFieldTouched(`${name}.details.anyQty`, true)}
                keyboardType="numeric"
                returnKeyType="done"
                blurOnSubmit
                onSubmitEditing={Keyboard.dismiss}
                style={[
                  styles.input,
                  {
                    backgroundColor: dark ? colors.primary : colors.background,
                  },
                ]}
                underlineColor={colors.outline}
                activeUnderlineColor={colors.primary}
                theme={{
                  colors: {
                    placeholder: colors.outline,
                    text: colors.text,
                    primary: colors.primary,
                  },
                }}
              />
              <AppErrorMessage
                error={errors?.[name]?.details?.anyQty}
                visible={touched?.[name]?.details?.anyQty}
              />
            </>
          )}

          {details.genderOption === "select" && (
            <>
              <View style={styles.checkboxRow}>
                <View style={styles.checkboxWrapper}>
                  <Checkbox.Android
                    status={details.femaleRequired ? "checked" : "unchecked"}
                    onPress={() => {
                      const newReq = !details.femaleRequired;
                      const updated = {
                        ...details,
                        femaleRequired: newReq,
                        femaleQty: newReq ? details.femaleQty : "",
                      };
                      setFieldValue(name, {
                        type: selectedType,
                        details: updated,
                      });
                      setFieldTouched(name, true);
                      setFieldTouched(`${name}.details.femaleRequired`, true);
                    }}
                    color={dark ? colors.onPrimary : colors.primary}
                    uncheckedColor={dark ? colors.placeholder : colors.primary}
                  />
                  <Text
                    style={[
                      styles.checkboxLabel,
                      {
                        color: colors.text,
                        fontFamily: fonts.regular?.fontFamily,
                      },
                    ]}
                  >
                    Female Expert
                  </Text>
                </View>
                <View style={styles.checkboxWrapper}>
                  <Checkbox.Android
                    status={details.maleRequired ? "checked" : "unchecked"}
                    onPress={() => {
                      const newReq = !details.maleRequired;
                      const updated = {
                        ...details,
                        maleRequired: newReq,
                        maleQty: newReq ? details.maleQty : "",
                      };
                      setFieldValue(name, {
                        type: selectedType,
                        details: updated,
                      });
                      setFieldTouched(name, true);
                      setFieldTouched(`${name}.details.maleRequired`, true);
                    }}
                    color={dark ? colors.onPrimary : colors.primary}
                    uncheckedColor={dark ? colors.placeholder : colors.primary}
                  />
                  <Text
                    style={[
                      styles.checkboxLabel,
                      {
                        color: colors.text,
                        fontFamily: fonts.regular?.fontFamily,
                      },
                    ]}
                  >
                    Male Expert
                  </Text>
                </View>
              </View>

              <View style={styles.quantityRow}>
                {details.femaleRequired && (
                  <View style={styles.halfInputWrapper}>
                    <TextInput
                      mode="flat"
                      label="Female Expert Qty"
                      value={details.femaleQty}
                      onChangeText={(text) =>
                        setFieldValue(name, {
                          type: selectedType,
                          details: { ...details, femaleQty: text },
                        })
                      }
                      onBlur={() =>
                        setFieldTouched(`${name}.details.femaleQty`, true)
                      }
                      keyboardType="numeric"
                      returnKeyType="done"
                      blurOnSubmit
                      onSubmitEditing={Keyboard.dismiss}
                      style={[
                        styles.input,
                        {
                          backgroundColor: dark
                            ? colors.primary
                            : colors.background,
                        },
                      ]}
                      underlineColor={colors.outline}
                      activeUnderlineColor={colors.primary}
                      theme={{
                        colors: {
                          placeholder: colors.outline,
                          text: colors.text,
                          primary: colors.primary,
                        },
                      }}
                    />
                    <AppErrorMessage
                      error={errors?.[name]?.details?.femaleQty}
                      visible={touched?.[name]?.details?.femaleQty}
                    />
                  </View>
                )}
                {details.maleRequired && (
                  <View
                    style={[
                      styles.halfInputWrapper,
                      details.femaleRequired && { marginLeft: 8 },
                    ]}
                  >
                    <TextInput
                      mode="flat"
                      label="Male Expert Qty"
                      value={details.maleQty}
                      onChangeText={(text) =>
                        setFieldValue(name, {
                          type: selectedType,
                          details: { ...details, maleQty: text },
                        })
                      }
                      onBlur={() =>
                        setFieldTouched(`${name}.details.maleQty`, true)
                      }
                      keyboardType="numeric"
                      returnKeyType="done"
                      blurOnSubmit
                      onSubmitEditing={Keyboard.dismiss}
                      style={[
                        styles.input,
                        {
                          backgroundColor: dark
                            ? colors.primary
                            : colors.background,
                        },
                      ]}
                      underlineColor={colors.outline}
                      activeUnderlineColor={colors.primary}
                      theme={{
                        colors: {
                          placeholder: colors.outline,
                          text: colors.text,
                          primary: colors.primary,
                        },
                      }}
                    />
                    <AppErrorMessage
                      error={errors?.[name]?.details?.maleQty}
                      visible={touched?.[name]?.details?.maleQty}
                    />
                  </View>
                )}
              </View>
            </>
          )}

          <Text style={[styles.label, { color: colors.text, marginTop: 16 }]}>
            Hours per day
          </Text>
          <SegmentedButtons
            value={details.hours}
            onValueChange={(val) =>
              setFieldValue(name, {
                type: selectedType,
                details: { ...details, hours: val },
              })
            }
            buttons={[
              { value: "8h", label: "8h" },
              { value: "10h", label: "10h" },
              { value: "12h", label: "12h" },
            ]}
            style={{ marginVertical: 8 }}
          />
          <AppErrorMessage
            error={errors?.[name]?.details?.hours}
            visible={touched?.[name]?.details?.hours}
          />

          {/* Total Experts Required */}
          <Text
            style={[styles.totalLabel, { color: colors.text, marginTop: 12 }]}
          >
            Total Experts Required: {totalExperts}
          </Text>
        </Card.Content>
      </Card>
    );
  };

  const cardBg = dark ? colors.secondary : colors.surface;

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss} accessible={false}>
      <View style={styles.container}>
        <Text
          style={[
            styles.label,
            { color: colors.text, fontFamily: fonts.medium?.fontFamily },
          ]}
        >
          Select Service Type
        </Text>
        <Card
          style={[
            styles.cardContainer,
            {
              backgroundColor: cardBg,
              borderColor: dark ? colors.secondary : colors.primary,
            },
          ]}
        >
          <Card.Content>
            <RadioButton.Group
              onValueChange={onTypeChange}
              value={selectedType}
            >
              {items.map((it) => (
                <RadioButton.Item
                  key={it}
                  label={it}
                  value={it}
                  color={colors.primary}
                  labelStyle={{ color: colors.text }}
                  style={styles.radioItem}
                />
              ))}
            </RadioButton.Group>
            <AppErrorMessage
              error={errors?.[name]?.type}
              visible={touched?.[name]?.type}
            />
          </Card.Content>
        </Card>
        {renderPermanentDetails()}
      </View>
    </TouchableWithoutFeedback>
  );
};

export default AppFormServicePicker;

const styles = StyleSheet.create({
  container: { marginTop: 20 },
  label: { fontSize: 16, marginBottom: 8 },
  cardContainer: { borderRadius: 8, marginBottom: 12, borderWidth: 1 },
  radioItem: { paddingVertical: 4, marginVertical: 0 },
  detailsCard: { borderRadius: 8, marginTop: 12, borderWidth: 1 },
  detailsHeader: { fontSize: 16, marginBottom: 4 },
  input: { marginTop: 12, fontSize: 16 },
  checkboxRow: { flexDirection: "row", marginTop: 12 },
  checkboxWrapper: {
    flexDirection: "row",
    alignItems: "center",
    marginRight: 16,
  },
  checkboxLabel: { marginLeft: 8, fontSize: 14 },
  quantityRow: { flexDirection: "row", marginTop: 12 },
  halfInputWrapper: { flex: 1 },
  totalLabel: { fontSize: 16, fontWeight: "bold" },
});
