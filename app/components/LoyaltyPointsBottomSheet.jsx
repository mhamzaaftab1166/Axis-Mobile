import { MaterialIcons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useFocusEffect } from "expo-router";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Card, Text, useTheme } from "react-native-paper";

const LOYALTY_OPTIONS = [0, 20, 30, 50];

const LoyaltyPointsBottomSheet = ({
  visible,
  onClose,
  onSelect,
  totalAmount = 0,
  availablePoints = 0,
  selectedPercentage: selectedPercentageProp = null,
}) => {
  const { dark, colors } = useTheme();
  const sheetRef = useRef(null);
  const snapPoints = useMemo(() => ["50%", "80%"], []);

  const [selectedPercentage, setSelectedPercentage] = useState(null);

  const ACTIVE_BG_LIGHT = "#FFD6D6";
  const ACTIVE_BG_DARK = "#4B2C2C";

  useEffect(() => {
    if (!sheetRef.current) return;
    if (visible) sheetRef.current.snapToIndex(0);
    else sheetRef.current.close();
  }, [visible]);

  useFocusEffect(
    useCallback(() => {
      if (selectedPercentageProp != null) {
        setSelectedPercentage(selectedPercentageProp);
      } else {
        setSelectedPercentage(null);
      }
    }, [selectedPercentageProp])
  );

  const handleSelect = (percentage) => {
    setSelectedPercentage(percentage);
    const discountValue = (totalAmount * percentage) / 100;
    console.log(discountValue)
    onSelect?.({ percentage, discountValue });
    sheetRef.current?.close();
  };

  const renderItem = ({ item }) => {
    const discountValue = (totalAmount * item) / 100;
    const pointsRequired = discountValue;
    const isDisabled = availablePoints < pointsRequired;
    const isSelected = item === selectedPercentage && !isDisabled;
    const activeBg = dark ? ACTIVE_BG_DARK : ACTIVE_BG_LIGHT;
    const activeText = dark ? "#FFF2F2" : "#660000";

    return (
      <TouchableOpacity
        activeOpacity={0.8}
        onPress={() => !isDisabled && handleSelect(item)}
        disabled={isDisabled}
      >
        <Card
          style={[
            styles.card,
            isSelected && {
              backgroundColor: activeBg,
              borderColor: colors.primary,
              shadowColor: colors.primary,
              shadowOffset: { width: 0, height: 2 },
              shadowOpacity: 0.25,
              shadowRadius: 3.84,
              elevation: 5,
            },
            isDisabled && {
              backgroundColor: dark ? "#333" : "#eee",
            },
          ]}
          mode="elevated"
        >
          <View style={styles.row}>
            <MaterialIcons
              name={
                isSelected
                  ? "radio-button-checked"
                  : isDisabled
                  ? "block"
                  : "radio-button-unchecked"
              }
              size={22}
              color={isSelected ? activeText : isDisabled ? "#999" : "#777"}
            />
            <View style={{ marginLeft: 12 }}>
              <Text
                variant="titleMedium"
                style={{
                  fontWeight: isSelected ? "700" : "500",
                  color: isSelected
                    ? activeText
                    : isDisabled
                    ? "#999"
                    : colors.onSurface,
                }}
              >
                {item}% Off
              </Text>
              <Text
                variant="bodyMedium"
                style={{
                  color: isSelected ? activeText : isDisabled ? "#999" : "#666",
                  marginTop: 2,
                }}
              >
                Discount: {discountValue.toFixed(2)} AED • Points required:{" "}
                {pointsRequired.toFixed(2)}
              </Text>
            </View>
          </View>
        </Card>
      </TouchableOpacity>
    );
  };

  return (
    <>
      {visible && (
        <Pressable
          style={styles.overlay}
          onPress={() => sheetRef.current?.close()}
        />
      )}
      <BottomSheet
        ref={sheetRef}
        snapPoints={snapPoints}
        enablePanDownToClose
        onClose={onClose}
        index={-1}
        handleIndicatorStyle={{ backgroundColor: "#bbb", width: 40 }}
        backgroundStyle={{
          backgroundColor: dark ? colors.surface : colors.background,
        }}
        animateOnMount
        keyboardBehavior="interactive"
      >
        <BottomSheetView style={styles.container}>
          <Text variant="titleLarge" style={styles.title}>
            Redeem Loyalty Points
          </Text>

          <FlatList
            data={LOYALTY_OPTIONS}
            keyExtractor={(item) => String(item)}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 8 }}
            showsVerticalScrollIndicator={false}
          />
        </BottomSheetView>
      </BottomSheet>
    </>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)",
  },
  container: { flex: 1, paddingTop: 8 },
  title: { marginBottom: 12, fontWeight: "600", paddingHorizontal: 16 },
  card: {
    padding: 14,
    marginBottom: 12,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: "transparent",
    borderRadius: 14,
  },
  row: { flexDirection: "row", alignItems: "center" },
  addBtn: { marginHorizontal: 16, borderRadius: 12 },
});

export default LoyaltyPointsBottomSheet;
