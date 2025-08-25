import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { FAB, Text, TouchableRipple, useTheme } from "react-native-paper";
import { SwipeListView } from "react-native-swipe-list-view";
import CenteredAppbarHeader from "../../components/common/CenteredAppBar";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import { ROUTES } from "../../helpers/routePaths";

export default function MyAddresses() {
  const { colors, dark, fonts } = useTheme();

  const [addresses, setAddresses] = useState([
    {
      id: "1",
      property: { id: "1", name: "Tower A" },
      block: { id: "2", name: "Block 2" },
      floor: { id: "5", name: "5th" },
      unit: { id: "102", name: "102" },
    },
    {
      id: "2",
      property: { id: "2", name: "Tower B" },
      block: { id: "1", name: "Block 1" },
      floor: { id: "2", name: "2nd" },
      unit: { id: "201", name: "201" },
    },
    {
      id: "3",
      property: { id: "3", name: "Tower C" },
      block: { id: "3", name: "Block 3" },
      floor: { id: "1", name: "1st" },
      unit: { id: "101", name: "101" },
    },
  ]);

  const [confirmVisible, setConfirmVisible] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);

  const showConfirm = (item) => {
    setSelectedAddress(item);
    setConfirmVisible(true);
  };

  const handleConfirm = () => {
    console.log("Deleted Address ID:", selectedAddress?.id);
    setConfirmVisible(false);
  };

  const handleEdit = (item) => {
    router.push({
      pathname: ROUTES.ADD_ADDRESS,
      params: { address: JSON.stringify(item) },
    });
  };

  const renderItem = ({ item }) => (
    <TouchableRipple>
      <View
        style={[
          styles.card,
          {
            backgroundColor: colors.surface,
            borderColor: dark ? colors.outline : "#ddd",
          },
        ]}
      >
        <MaterialCommunityIcons
          name="home-outline"
          size={28}
          color={colors.primary}
          style={{ marginRight: 12 }}
        />
        <View style={{ flex: 1 }}>
          <Text
            style={[
              styles.cardTitle,
              { color: colors.text, fontFamily: fonts.medium },
            ]}
          >
            {item.property.name}
          </Text>
          <Text style={[styles.cardSub, { color: colors.text }]}>
            Block: {item.block.name} • Floor: {item.floor.name} • Unit:{" "}
            {item.unit.name}
          </Text>
        </View>
      </View>
    </TouchableRipple>
  );

  const renderHiddenItem = ({ item }) => (
    <View style={styles.rowBack}>
      {/* Delete Button */}
      <TouchableRipple
        onPress={() => showConfirm(item)}
        style={[
          styles.hiddenButton,
          { backgroundColor: colors.error, marginRight: 8 },
        ]}
      >
        <MaterialCommunityIcons
          name="trash-can-outline"
          size={24}
          color="#fff"
        />
      </TouchableRipple>

      {/* Edit Button */}
      <TouchableRipple
        onPress={() => handleEdit(item)}
        style={[styles.hiddenButton, { backgroundColor: "#2196F3" }]}
      >
        <MaterialCommunityIcons name="pencil-outline" size={24} color="#fff" />
      </TouchableRipple>
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CenteredAppbarHeader title="My Addresses" />

      <SwipeListView
        data={addresses}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        rightOpenValue={-150}
        disableRightSwipe
        contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />

      <FAB
        icon="plus"
        label="Add New Address"
        style={[styles.fab, { backgroundColor: colors.primary }]}
        color={colors.onPrimary}
        onPress={() => router.push(ROUTES.ADD_ADDRESS)}
      />

      <ConfirmDialog
        visible={confirmVisible}
        title="Delete Address"
        message={`Remove ${selectedAddress?.property?.name}?`}
        onCancel={() => setConfirmVisible(false)}
        onConfirm={handleConfirm}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  cardTitle: { fontSize: 16, marginBottom: 4 },
  cardSub: { fontSize: 14, color: "gray" },
  rowBack: {
    flexDirection: "row",
    justifyContent: "flex-end",
    alignItems: "center",
    flex: 1,
    paddingRight: 16,
  },
  hiddenButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 64,
    height: "85%",
    borderRadius: 12,
  },
  fab: {
    position: "absolute",
    bottom: 30,
    alignSelf: "center",
    borderRadius: 28,
  },
});
