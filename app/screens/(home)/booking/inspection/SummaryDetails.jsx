import { MaterialIcons } from "@expo/vector-icons";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { Surface, useTheme } from "react-native-paper";
import { formatAddressLabel } from "../../../../helpers/general";
import useAddressStore from "../../../../store/useAddressStore";

export default function BookingSummary({ onChangeAddress }) {
  const { colors, fonts, dark } = useTheme();
  const selectedAddress = useAddressStore((s) => s.selectedAddress);
  const addr = formatAddressLabel(selectedAddress);

  return (
    <View>
      <Surface
        style={[
          styles.addressSurface,
          {
            backgroundColor: colors.background,
            borderWidth: dark ? 1 : 0,
            borderColor: colors.outline,
          },
        ]}
      >
        <TouchableOpacity
          activeOpacity={0.8}
          onPress={() =>
            typeof onChangeAddress === "function" && onChangeAddress()
          }
          style={styles.addressRowInner}
        >
          <View style={styles.addressLeft}>
            <MaterialIcons
              name="home"
              size={20}
              color={colors.primary}
              style={{ marginRight: 8 }}
            />
            <View style={{ flex: 1 }}>
              <Text
                style={[
                  styles.addressMain,
                  {
                    color: colors.onSurface,
                    fontFamily: fonts?.medium?.fontFamily,
                  },
                ]}
              >
                {selectedAddress ? addr.main : "No address selected"}
              </Text>
              <Text
                style={[
                  styles.addressMeta,
                  {
                    color: colors.placeholder,
                    fontFamily: fonts?.regular?.fontFamily,
                  },
                ]}
              >
                {selectedAddress ? addr.meta : "Please choose an address"}
              </Text>
            </View>
          </View>

          <MaterialIcons
            name="keyboard-arrow-down"
            size={24}
            color={colors.primary}
          />
        </TouchableOpacity>
      </Surface>
    </View>
  );
}

const styles = StyleSheet.create({
  addressSurface: {
    marginTop: 8,
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 10,
    marginBottom: 20,
  },
  addressRowInner: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  addressLeft: { flexDirection: "row", alignItems: "center", flex: 1 },
  addressMain: { fontSize: 15, fontWeight: "600" },
  addressMeta: { fontSize: 13, marginTop: 2 },
});
