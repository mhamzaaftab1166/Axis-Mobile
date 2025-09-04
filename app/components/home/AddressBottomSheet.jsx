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
import { Button, Card, Text, useTheme } from "react-native-paper";

const getId = (item) => item?.id ?? item?._id ?? null;

const AddressBottomSheet = ({
  addresses = [],
  visible,
  onClose,
  onSelect,
  onAdd,
  selectedId: selectedIdProp = null,
}) => {
  const { dark, colors } = useTheme();
  const sheetRef = useRef(null);
  const snapPoints = useMemo(() => ["40%", "60%"], []);

  const [selectedId, setSelectedId] = useState(null);

  const ACTIVE_BG_LIGHT = "#FFD6D6";
  const ACTIVE_BG_DARK = "#4B2C2C";

  useEffect(() => {
    if (!sheetRef.current) return;
    if (visible) sheetRef.current.snapToIndex(0);
    else sheetRef.current.close();
  }, [visible]);

  useFocusEffect(
    useCallback(() => {
      if (selectedIdProp != null) {
        setSelectedId(selectedIdProp);
        return;
      }

      if (addresses?.length) {
        setSelectedId(getId(addresses[0]));
      }
    }, [selectedIdProp, addresses])
  );

  useEffect(() => {
    if (!selectedId && addresses?.length) {
      setSelectedId(getId(addresses[0]));
    }
  }, [addresses]);

  const handleSelect = (item) => {
    const id = getId(item);
    setSelectedId(id);
    onSelect?.(item);
    sheetRef.current?.close();
  };

  const renderItem = ({ item }) => {
    const id = getId(item);
    const isSelected = id === selectedId;
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
                {item?.towerId?.towerName ?? item?.label ?? "Address"}
              </Text>
              <Text
                variant="bodyMedium"
                style={{
                  color: isSelected ? activeText : "#666",
                  marginTop: 2,
                }}
              >
                {`${item?.blockId?.blockName ?? ""}${
                  item?.blockId?.blockName ? " • " : ""
                }${item?.floorId?.floorName ?? ""}${
                  item?.floorId?.floorName ? " • " : ""
                }${item?.unitId?.unitName ?? ""}`}
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
            keyExtractor={(item) => String(getId(item))}
            renderItem={renderItem}
            contentContainerStyle={{ paddingBottom: 20, paddingHorizontal: 8 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={
              <View style={{ padding: 16 }}>
                <Text style={{ color: colors.placeholder }}>
                  No addresses available
                </Text>
              </View>
            }
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
