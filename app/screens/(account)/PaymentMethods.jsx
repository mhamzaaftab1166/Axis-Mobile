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
import { Button, Dialog, FAB, Portal, useTheme } from "react-native-paper";
import { SwipeListView } from "react-native-swipe-list-view";
import CenteredAppbarHeader from "../../components/common/CenteredAppBar";
import { getCardIcon } from "../../helpers/general";
import { ROUTES } from "../../helpers/routePaths";

export default function PaymentMethods() {
  const { colors, dark, fonts } = useTheme();
  const navigation = useNavigation();
  const router = useRouter();

  const screenBg = colors.background;
  const textColor = colors.text;
  const cardBg = dark ? colors.secondary : colors.surface;
  const fabBg = colors.primary;
  const fabColor = colors.onPrimary;

  const [cards, setCards] = useState([
    { id: "1", type: "visa", last4: "1234", cardHolder: "John Doe" },
    { id: "2", type: "mastercard", last4: "5678", cardHolder: "Samantha Ray" },
    { id: "3", type: "amex", last4: "9012", cardHolder: "Aarav Kumar" },
  ]);

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
    setCards((prev) => prev.filter((card) => card.id !== toDeleteId));
    hideConfirm();
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
      {getCardIcon(item.type)}
      <View style={styles.cardInfo}>
        <Text
          style={[
            styles.cardHolder,
            { fontFamily: fonts.medium, color: textColor },
          ]}
        >
          {item.cardHolder}
        </Text>
        <Text
          style={[
            styles.cardTitle,
            { fontFamily: fonts.medium, color: textColor },
          ]}
        >
          {item.type.toUpperCase()} **** {item.last4}
        </Text>
        <Text
          style={[
            styles.cardSub,
            { fontFamily: fonts.regular, color: textColor },
          ]}
        >
          Exp: 12/26
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

  return (
    <View style={[styles.container, { backgroundColor: screenBg }]}>
      <StatusBar barStyle="light-content" backgroundColor={colors.primary} />
      <CenteredAppbarHeader
        title={"Saved Cards"}
        onBack={() => navigation.goBack()}
      />

      <SwipeListView
        data={cards}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        rightOpenValue={-75}
        disableRightSwipe
        contentContainerStyle={{ padding: 16 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />

      <FAB
        icon="credit-card-plus-outline"
        label="Add New Card"
        onPress={() => router.push(ROUTES.ADD_PAYMENT_METHOD)}
        style={[styles.fab, { backgroundColor: fabBg }]}
        color={fabColor}
      />

      <Portal>
        <Dialog
          visible={confirmVisible}
          onDismiss={hideConfirm}
          style={{
            backgroundColor: dark ? colors.onPrimary : colors.primary,
            borderRadius: 12,
          }}
        >
          <Dialog.Title
            style={{
              color: dark ? colors.primary : colors.onPrimary,
              fontFamily: fonts.bold?.fontFamily,
            }}
          >
            Delete Card
          </Dialog.Title>
          <Dialog.Content>
            <Text
              style={{
                color: dark ? colors.primary : colors.onPrimary,
                fontFamily: fonts.regular?.fontFamily,
              }}
            >
              Are you sure you want to delete this card?
            </Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button
              labelStyle={{ color: dark ? colors.primary : colors.onPrimary }}
              style={{ marginRight: 8 }}
              onPress={hideConfirm}
            >
              No
            </Button>
            <Button
              labelStyle={{ color: dark ? colors.primary : colors.onPrimary }}
              onPress={handleDelete}
            >
              Yes
            </Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
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
});
