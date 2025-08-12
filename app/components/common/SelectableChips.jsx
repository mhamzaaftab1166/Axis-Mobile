import { ScrollView, StyleSheet } from "react-native";
import { Chip, useTheme } from "react-native-paper";

const SelectableChips = ({ options = [], selectedOptions = [], onChange }) => {
  const { colors, dark } = useTheme();

  const toggleChip = (option) => {
    if (selectedOptions.includes(option)) {
      onChange(selectedOptions.filter((item) => item !== option));
    } else {
      onChange([...selectedOptions, option]);
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
        const selected = selectedOptions.includes(option);

        return (
          <Chip
            key={option}
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
              height: 32,
              justifyContent: "center",
              paddingHorizontal: 12,
            }}
          >
            {option}
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
