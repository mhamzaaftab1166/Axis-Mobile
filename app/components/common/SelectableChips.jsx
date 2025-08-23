import { MaterialIcons } from "@expo/vector-icons";
import { ScrollView, StyleSheet, Text, View } from "react-native";
import { Chip, useTheme } from "react-native-paper";

const SelectableChips = ({ options = [], selectedOptions = [], onChange }) => {
  const { colors, dark } = useTheme();

  const toggleChip = (option) => {
    if (selectedOptions.includes(option.value)) {
      onChange(selectedOptions.filter((v) => v !== option.value));
    } else {
      onChange([...selectedOptions, option.value]);
    }
  };

  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      style={styles.container}
      contentContainerStyle={{ paddingHorizontal: 16 }}
    >
      {options.map((option) => {
        const selected = selectedOptions.includes(option.value);

        return (
          <Chip
            key={option.value}
            mode={selected ? "flat" : "outlined"}
            selected={selected}
            onPress={() => toggleChip(option)}
            style={[
              styles.chip,
              {
                backgroundColor: selected
                  ? colors.primary
                  : dark
                  ? "rgba(255, 255, 255, 0.08)"
                  : "transparent",
                borderColor: !selected
                  ? dark
                    ? "rgba(255, 255, 255, 0.3)"
                    : "rgba(0, 0, 0, 0.12)"
                  : undefined,
                borderWidth: !selected ? 1 : 0,
              },
            ]}
            textStyle={{
              color: selected ? colors.onPrimary : colors.text,
              fontWeight: "500",
              fontSize: 14,
              lineHeight: 24,
            }}
            contentStyle={{
              height: 36,
              justifyContent: "flex-start",
              paddingHorizontal: 12,
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <View style={{ flexDirection: "row", alignItems: "center" }}>
              <MaterialIcons
                name="build-circle"
                size={16}
                color={selected ? colors.onPrimary : colors.text}
                style={{ marginRight: 6 }}
              />
              <Text
                style={{ color: selected ? colors.onPrimary : colors.text }}
              >
                {option.label} ({option.serviceCount})
              </Text>
            </View>
          </Chip>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 10,
  },
  chip: {
    marginRight: 10,
    borderRadius: 16,
  },
});

export default SelectableChips;
