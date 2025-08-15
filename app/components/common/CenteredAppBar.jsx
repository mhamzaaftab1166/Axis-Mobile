import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Pressable, Text, View } from "react-native";
import { Appbar, useTheme } from "react-native-paper";
import useBookingStore from "../../store/useBookingStore";

import { ROUTES } from "../../helpers/routePaths";

export default function CenteredAppbarHeader({
  title,
  onBack,
  cartDisplay = true,
}) {
  const { colors } = useTheme();
  const selectedCount = useBookingStore(
    (state) => state.selectedServices.length
  );

  return (
    <Appbar.Header style={{ backgroundColor: colors.primary }}>
      <View
        style={{ width: 48, alignItems: "center", justifyContent: "center" }}
      >
        <Appbar.BackAction onPress={onBack} color={colors.onPrimary} />
      </View>

      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text
          style={{
            color: colors.onPrimary,
            fontSize: 20,
            fontWeight: "500",
          }}
          numberOfLines={1}
        >
          {title}
        </Text>
      </View>

      <View
        style={{
          width: 48,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {cartDisplay ? (
          <Pressable onPress={() => router.push(ROUTES.BOOK_SERVICE)}>
            <View>
              <MaterialIcons
                name="shopping-cart"
                size={24}
                color={colors.onPrimary}
              />
              {selectedCount > 0 && (
                <View
                  style={{
                    position: "absolute",
                    top: -4, // slightly above the icon
                    right: -4, // slightly to the right
                    backgroundColor: "red",
                    borderRadius: 8,
                    minWidth: 16,
                    height: 16,
                    paddingHorizontal: 4,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Text
                    style={{
                      color: "#fff",
                      fontSize: 10,
                      fontWeight: "700",
                      textAlign: "center",
                    }}
                  >
                    {selectedCount}
                  </Text>
                </View>
              )}
            </View>
          </Pressable>
        ) : null}
      </View>
    </Appbar.Header>
  );
}
