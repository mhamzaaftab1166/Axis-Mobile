import { MaterialIcons } from "@expo/vector-icons";
import BottomSheet, { BottomSheetView } from "@gorhom/bottom-sheet";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Button, Card, Text, useTheme } from "react-native-paper";

const AddressBottomSheet = ({
  addresses,
  visible,
  onClose,
  onSelect,
  onAdd,
}) => {
  const { dark, colors } = useTheme();
  const sheetRef = useRef(null);
  const [selectedId, setSelectedId] = useState(addresses?.[0]?.id);
  const snapPoints = useMemo(() => ["40%", "60%"], []);

  const ACTIVE_BG_LIGHT = "#FFD6D6";
  const ACTIVE_BG_DARK = "#4B2C2C";
  const ADD_BTN_LIGHT = "#FF8A80";
  const ADD_BTN_DARK = "#6A3B3B";

  useEffect(() => {
    if (sheetRef.current) {
      visible ? sheetRef.current.snapToIndex(0) : sheetRef.current.close();
    }
  }, [visible]);

  const handleSelect = (item) => {
    setSelectedId(item.id);
    onSelect?.(item);
    sheetRef.current?.close();
  };

  const renderItem = ({ item }) => {
    const isSelected = item.id === selectedId;
    const activeBg = dark ? ACTIVE_BG_DARK : ACTIVE_BG_LIGHT;
    const activeText = dark ? "#FFF2F2" : "#660000";

    return (
      <TouchableOpacity activeOpacity={0.8} onPress={() => handleSelect(item)}>
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
          ]}
          mode="elevated"
        >
          <View style={styles.row}>
            <MaterialIcons
              name={
                isSelected ? "radio-button-checked" : "radio-button-unchecked"
              }
              size={22}
              color={isSelected ? activeText : "#777"}
            />
            <View style={{ marginLeft: 12 }}>
              <Text
                variant="titleMedium"
                style={{
                  fontWeight: isSelected ? "700" : "500",
                  color: isSelected ? activeText : colors.onSurface,
                }}
              >
                {item.property.name}
              </Text>
              <Text
                variant="bodyMedium"
                style={{
                  color: isSelected ? activeText : "#666",
                  marginTop: 2,
                }}
              >
                {item.block.name}, {item.floor.name}, {item.unit.name}
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
            Select Address
          </Text>
          <FlatList
            data={addresses}
            keyExtractor={(item) => item.id}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 8 }}
            showsVerticalScrollIndicator={false}
          />
          <Button
            mode="contained"
            icon="plus"
            onPress={onAdd}
            style={[styles.addBtn, { backgroundColor: colors.secondary }]}
            contentStyle={{ paddingVertical: 5 }}
            textColor="#fff"
          >
            Add More Address
          </Button>
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

export default AddressBottomSheet;
