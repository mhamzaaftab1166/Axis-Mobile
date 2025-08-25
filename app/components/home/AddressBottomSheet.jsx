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

  const snapPoints = useMemo(() => ["60%", "80%"], []);

  useEffect(() => {
    if (sheetRef.current) {
      if (visible) {
        sheetRef.current.snapToIndex(0);
      } else {
        sheetRef.current.close();
      }
    }
  }, [visible]);

  const handleSelect = (item) => {
    setSelectedId(item.id);
    onSelect?.(item);
    sheetRef.current?.close();
  };

  const renderItem = ({ item }) => {
    const isSelected = item.id === selectedId;
    return (
      <TouchableOpacity activeOpacity={0.8} onPress={() => handleSelect(item)}>
        <Card
          style={[
            styles.card,
            isSelected && {
              backgroundColor: colors.secondaryContainer,
              borderColor: colors.primary,
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
              color={isSelected ? colors.primary : "#777"}
            />
            <View style={{ marginLeft: 12 }}>
              <Text
                variant="titleMedium"
                style={{
                  fontWeight: isSelected ? "700" : "500",
                  color: isSelected ? colors.primary : colors.onSurface,
                }}
              >
                {item.property.name}
              </Text>
              <Text
                variant="bodyMedium"
                style={{
                  color: isSelected ? colors.onSecondaryContainer : "#666",
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
            mode="contained-tonal"
            icon="plus"
            onPress={onAdd}
            style={styles.addBtn}
            contentStyle={{}}
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
  container: {
    flex: 1,
    paddingTop: 8,
  },
  title: {
    marginBottom: 12,
    fontWeight: "600",
    paddingHorizontal: 16,
  },
  card: {
    padding: 14,
    marginBottom: 12,
    marginHorizontal: 8,
    borderWidth: 1,
    borderColor: "transparent",
    borderRadius: 14,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  addBtn: {
    marginHorizontal: 16,
    borderRadius: 12,
  },
});

export default AddressBottomSheet;
