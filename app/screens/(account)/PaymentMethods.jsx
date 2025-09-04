// screens/(account)/PaymentMethods.js
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation, useRouter } from "expo-router";
import { useState } from "react";
import {
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { FAB, useTheme } from "react-native-paper";
import { SwipeListView } from "react-native-swipe-list-view";
import CenteredAppbarHeader from "../../components/common/CenteredAppBar";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import EmptyState from "../../components/common/EmptyState";
import AppErrorMessage from "../../components/forms/AppErrorMessage";
import { getCardIcon } from "../../helpers/general";
import { ROUTES } from "../../helpers/routePaths";
import {
  useGetPaymentMethods,
  useRemovePaymentMethod,
} from "../../hooks/usePaymetMethodQuery";
import PaymentMethodsSkeleton from "../../skeltons/PaymentsSkelton";

export default function PaymentMethods() {
  const { colors, dark, fonts } = useTheme();
  const navigation = useNavigation();
  const router = useRouter();

  const screenBg = colors.background;
  const textColor = colors.text;
  const cardBg = dark ? colors.secondary : colors.surface;
  const fabBg = colors.primary;
  const fabColor = colors.onPrimary;

  const [error, setError] = useState("");
  const [isError, setIsError] = useState(false);

  const { data: cardsData, isLoading: isFetching } = useGetPaymentMethods();
  const { mutate: removePaymentMethod, isPending: isRemoving } =
    useRemovePaymentMethod({
      onErrorCallback: (errMsg) => {
        setError(errMsg);
        setIsError(true);
      },
      onSuccessCallback: () => {
        setError("");
        setIsError(false);
        setToDeleteId(null);
        setConfirmVisible(false);
      },
    });

  // Dialog state
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [toDeleteId, setToDeleteId] = useState(null);

  const showConfirm = (id) => {
    setToDeleteId(id);
    setConfirmVisible(true);
  };

  const hideConfirm = () => {
    setToDeleteId(null);
    setConfirmVisible(false);
  };

  const handleDelete = () => {
    removePaymentMethod(toDeleteId);
  };

  const renderItem = ({ item }) => (
    <View
      style={[
        styles.card,
        {
          backgroundColor: cardBg,
          borderColor: dark ? colors.outline : "#ddd",
        },
      ]}
    >
      {getCardIcon(item?.card_type)}
      <View style={styles.cardInfo}>
        <Text
          style={[
            styles.cardHolder,
            { fontFamily: fonts.medium, color: textColor },
          ]}
        >
          {item.name_on_card}
        </Text>
        <Text
          style={[
            styles.cardTitle,
            { fontFamily: fonts.medium, color: textColor },
          ]}
        >
          {item.card_type.toUpperCase()} {item.card_number}
        </Text>
        <Text
          style={[
            styles.cardSub,
            { fontFamily: fonts.regular, color: textColor },
          ]}
        >
          Exp: {item.expiry}
        </Text>
      </View>
    </View>
  );

  const renderHiddenItem = ({ item }) => (
    <View style={styles.rowBack}>
      <TouchableOpacity
        onPress={() => showConfirm(item.id)}
        style={[styles.deleteButton, { backgroundColor: colors.error }]}
      >
        <MaterialCommunityIcons
          name="trash-can-outline"
          size={24}
          color="#fff"
        />
      </TouchableOpacity>
    </View>
  );

  if (isFetching) return <PaymentMethodsSkeleton />;
  return (
    <View style={[styles.container, { backgroundColor: screenBg }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <CenteredAppbarHeader
        title={"Saved Cards"}
        onBack={() => navigation.goBack()}
      />
      <View style={{ alignSelf: "center" }}>
        <AppErrorMessage visible={isError} error={error} />
      </View>

      {cardsData?.length === 0 ? (
        <View style={styles.emptyContainer}>
          <EmptyState
            iconName="credit-card"
            title="No Cards Added"
            description="You currently have no saved payment methods."
          />
        </View>
      ) : (
        <SwipeListView
          data={cardsData}
          keyExtractor={(item) => item.id}
          renderItem={renderItem}
          renderHiddenItem={renderHiddenItem}
          rightOpenValue={-75}
          disableRightSwipe
          contentContainerStyle={{ padding: 16 }}
          ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        />
      )}

      <FAB
        icon="credit-card-plus-outline"
        label="Add New Card"
        onPress={() => router.push(ROUTES.ADD_PAYMENT_METHOD)}
        style={[styles.fab, { backgroundColor: fabBg }]}
        color={fabColor}
      />

      <ConfirmDialog
        visible={confirmVisible}
        title="Delete Card"
        message="Are you sure you want to delete this card?"
        onCancel={hideConfirm}
        onConfirm={handleDelete}
        isLoading={isRemoving}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  cardInfo: {
    marginLeft: 12,
  },
  cardHolder: {
    fontSize: 15,
    marginBottom: 2,
  },
  cardTitle: {
    fontSize: 16,
  },
  cardSub: {
    fontSize: 13,
    marginTop: 2,
  },
  rowBack: {
    alignItems: "center",
    flex: 1,
    flexDirection: "row",
    justifyContent: "flex-end",
    paddingRight: 16,
  },
  deleteButton: {
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
