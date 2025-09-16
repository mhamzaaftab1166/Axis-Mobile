import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router, useNavigation } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { FAB, Text, TouchableRipple, useTheme } from "react-native-paper";
import { SwipeListView } from "react-native-swipe-list-view";
import CenteredAppbarHeader from "../../components/common/CenteredAppBar";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import EmptyState from "../../components/common/EmptyState";
import AppErrorMessage from "../../components/forms/AppErrorMessage";
import { ROUTES } from "../../helpers/routePaths";
import {
  useGetAllAddress,
  useRemoveAddress,
} from "../../hooks/useAddressQuery";
import MyAddressesSkeleton from "../../skeltons/MyAddressSkelton";
import useAddressStore from "../../store/useAddressStore";

export default function MyAddresses() {
  const { colors, dark, fonts } = useTheme();
  const navigation = useNavigation();

  const { allAddresses, isLoading: isFetching } = useGetAllAddress();
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [selectedAddress, setSelectedAddress] = useState(null);
  const [error, setError] = useState("");
  const [isError, setIsError] = useState(false);

  const { mutate: removeAddress, isPending: isRemoving } = useRemoveAddress({
    onErrorCallback: (errMsg) => {
      setError(errMsg);
      setIsError(true);
      setConfirmVisible(false);
    },
    onSuccessCallback: () => {
      setError("");
      setIsError(false);
      setConfirmVisible(false);
      setSelectedAddress(null);
    },
  });

  const showConfirm = (item) => {
    setSelectedAddress(item);
    setConfirmVisible(true);
  };

  const handleConfirm = () => {
    if (!selectedAddress) return;

    const isSelected =
      selectedAddress._id === useAddressStore.getState().selectedAddress?._id;

    removeAddress(selectedAddress._id, {
      onSuccess: () => {
        useAddressStore.getState().removeAddress(selectedAddress._id);
        if (isSelected) {
          useAddressStore.getState().clearAddress();
        }
      },
    });
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
            {item?.towerId?.towerName}
          </Text>
          <Text style={[styles.cardSub, { color: colors.text }]}>
            Block: {item?.blockId?.blockName} • Floor:{" "}
            {item?.floorId?.floorName} • Unit: {item?.unitId?.unitName}
          </Text>
        </View>
      </View>
    </TouchableRipple>
  );

  const renderHiddenItem = ({ item }) => (
    <View style={styles.rowBack}>
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
      <TouchableRipple
        onPress={() => handleEdit(item)}
        style={[styles.hiddenButton, { backgroundColor: "#2196F3" }]}
      >
        <MaterialCommunityIcons name="pencil-outline" size={24} color="#fff" />
      </TouchableRipple>
    </View>
  );

  if (isFetching) return <MyAddressesSkeleton />;
  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CenteredAppbarHeader
        title="My Addresses"
        onBack={() => navigation.goBack()}
      />

      <View style={{ alignSelf: "center" }}>
        <AppErrorMessage error={error} visible={isError} />
      </View>

      {allAddresses?.length === 0 ? (
        <View style={styles.emptyContainer}>
          <EmptyState
            iconName="home"
            title="No Addresses"
            description="You currently have no saved addresses."
          />
        </View>
      ) : (
        <SwipeListView
          data={allAddresses}
          keyExtractor={(item) => item._id}
          renderItem={renderItem}
          renderHiddenItem={renderHiddenItem}
          rightOpenValue={-150}
          disableRightSwipe
          contentContainerStyle={{ padding: 16, paddingBottom: 80 }}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        />
      )}

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
        isLoading={isRemoving}
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
  emptyContainer: {
    flex: 1,
    justifyContent: "center",
  },
});
