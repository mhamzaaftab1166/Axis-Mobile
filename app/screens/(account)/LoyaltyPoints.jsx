import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import {
  Button,
  Card,
  Divider,
  Modal,
  Portal,
  Text,
  useTheme,
} from "react-native-paper";
import CenteredAppbarHeader from "../../components/common/CenteredAppBar";
import { ROUTES } from "../../helpers/routePaths";

export default function LoyaltyPointsScreen() {
  const { colors, fonts } = useTheme();
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);

  const pointsBalance = 1200;
  const history = [
    {
      id: 1,
      title: "Service Termination",
      date: "Sep 05, 2025",
      points: "+200",
    },
    { id: 2, title: "Booking Completed", date: "Aug 20, 2025", points: "+500" },
    { id: 3, title: "Redeemed Discount", date: "Aug 02, 2025", points: "-300" },
  ];

  const steps = [
    {
      step: 1,
      description:
        "When you terminate a service, you earn loyalty points instead of cashback.",
    },
    {
      step: 2,
      description:
        "On your next booking, you can redeem these points for a discount.",
    },
    {
      step: 3,
      description: "Apply points during checkout to reduce your bill.",
    },
  ];

  return (
    <View style={{ flex: 1, backgroundColor: colors.background }}>
      <CenteredAppbarHeader
        title="Loyalty Points"
        onBack={() => router.back()}
      />

      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Balance Card */}
        <Card style={[styles.balanceCard, { backgroundColor: colors.surface }]}>
          <Text
            variant="headlineSmall"
            style={[
              styles.balanceTitle,
              { color: colors.text, fontFamily: fonts.medium?.fontFamily },
            ]}
          >
            Loyalty Points
          </Text>
          <Text
            variant="headlineMedium"
            style={[
              styles.balanceValue,
              { color: colors.primary, fontFamily: fonts.bold?.fontFamily },
            ]}
          >
            {pointsBalance}
          </Text>
          <Text
            variant="bodyMedium"
            style={{
              textAlign: "center",
              marginTop: 8,
              color: colors.onSurfaceVariant,
            }}
          >
            Earn points when you terminate a service instead of cashback.
          </Text>
          <TouchableOpacity
            onPress={() => router.push(ROUTES.BOOK_SERVICE)}
            style={styles.redeemContainer}
          >
            <Text style={[styles.redeemText, { color: colors.primary }]}>
              Redeem Now
            </Text>
          </TouchableOpacity>
        </Card>

        {/* How it works */}
        <TouchableOpacity
          onPress={() => setModalVisible(true)}
          style={styles.howItWorksContainer}
        >
          <Text style={[styles.howItWorksText, { color: colors.primary }]}>
            How it works?
          </Text>
        </TouchableOpacity>

        {/* Transaction History */}
        <Card style={[styles.historyCard, { backgroundColor: colors.surface }]}>
          <Text
            variant="titleMedium"
            style={[
              styles.historyTitle,
              { color: colors.text, fontFamily: fonts.medium?.fontFamily },
            ]}
          >
            Transaction History
          </Text>
          <Divider
            style={{
              marginVertical: 10,
              backgroundColor: colors.outlineVariant,
            }}
          />
          {history.map((item, idx) => (
            <View key={item.id}>
              <View style={styles.historyRow}>
                <View>
                  <Text variant="bodyMedium" style={{ color: colors.text }}>
                    {item.title}
                  </Text>
                  <Text
                    variant="bodySmall"
                    style={{ color: colors.onSurfaceVariant, marginTop: 2 }}
                  >
                    {item.date}
                  </Text>
                </View>
                <Text
                  variant="bodyMedium"
                  style={{
                    fontWeight: "bold",
                    color: item.points.startsWith("-")
                      ? colors.error
                      : colors.primary,
                  }}
                >
                  {item.points}
                </Text>
              </View>
              {idx < history.length - 1 && (
                <Divider
                  style={{
                    marginVertical: 6,
                    backgroundColor: colors.outlineVariant,
                  }}
                />
              )}
            </View>
          ))}
        </Card>
      </ScrollView>

      {/* Modal */}
      <Portal>
        <Modal
          visible={modalVisible}
          onDismiss={() => setModalVisible(false)}
          contentContainerStyle={[
            styles.modalContainer,
            { backgroundColor: colors.surface },
          ]}
        >
          <Text
            variant="titleMedium"
            style={{
              textAlign: "center",
              marginBottom: 20,
              color: colors.text,
              fontFamily: fonts.medium?.fontFamily,
            }}
          >
            How it Works
          </Text>

          {steps.map((item) => (
            <View key={item.step} style={styles.stepRow}>
              <View
                style={[styles.stepCircle, { borderColor: colors.primary }]}
              >
                <Text
                  style={{
                    color: colors.primary,
                    fontWeight: "bold",
                    fontSize: 18,
                  }}
                >
                  {item.step}
                </Text>
              </View>
              <Text
                style={{
                  marginLeft: 16,
                  flex: 1,
                  color: colors.text,
                  fontSize: 16,
                }}
              >
                {item.description}
              </Text>
            </View>
          ))}

          <Button
            mode="contained"
            style={[styles.gotItButton, { backgroundColor: colors.primary }]}
            onPress={() => setModalVisible(false)}
          >
            Got it
          </Button>
        </Modal>
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    paddingTop: 16,
  },
  balanceCard: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    alignItems: "center",
    elevation: 5,
  },
  balanceTitle: {
    fontWeight: "600",
    marginBottom: 8,
    textAlign: "center",
  },
  balanceValue: {
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  howItWorksContainer: {
    alignSelf: "center",
    marginBottom: 24,
  },
  howItWorksText: {
    textDecorationLine: "underline",
    fontWeight: "500",
    fontSize: 16,
  },
  redeemContainer: {
    alignSelf: "center",
    marginTop: 18,
  },
  redeemText: {
    textDecorationLine: "underline",
    fontWeight: "500",
    fontSize: 16,
  },
  historyCard: {
    borderRadius: 16,
    padding: 20,
    elevation: 3,
  },
  historyTitle: {
    marginBottom: 4,
  },
  historyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  modalContainer: {
    margin: 20,
    borderRadius: 16,
    padding: 24,
  },
  stepRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  stepCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  gotItButton: {
    marginTop: 24,
    borderRadius: 10,
    paddingVertical: 8,
  },
});
