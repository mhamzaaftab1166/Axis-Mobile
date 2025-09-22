import { useRouter } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { Card, Divider, Text, useTheme } from "react-native-paper";
import CenteredAppbarHeader from "../../components/common/CenteredAppBar";
import PopupDialog from "../../components/common/PopupDialogue";
import { ROUTES } from "../../helpers/routePaths";
import { useGetLoyaltyPoints } from "../../hooks/useLoyaltyQuery";
import LoyaltyPointsSkeleton from "../../skeltons/LoyaltyPointsSkelton";

export default function LoyaltyPointsScreen() {
  const { colors, fonts } = useTheme();
  const router = useRouter();
  const [modalVisible, setModalVisible] = useState(false);

  const { data: loyaltyPointsData, isLoading: fetchingLoyaltyPointsData } =
    useGetLoyaltyPoints();

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

  if (fetchingLoyaltyPointsData) return <LoyaltyPointsSkeleton />;

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
            style={{
              color: colors.text,
              fontFamily: fonts.medium?.fontFamily,
              textAlign: "center",
            }}
          >
            Loyalty Points
          </Text>

          <Text
            variant="headlineMedium"
            style={{
              color: colors.primary,
              fontFamily: fonts.bold?.fontFamily,
              textAlign: "center",
            }}
          >
            {loyaltyPointsData?.data?.pointsBalance}
          </Text>

          <Text
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

        {/* How It Works */}
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
            style={{
              color: colors.text,
              fontFamily: fonts.medium?.fontFamily,
            }}
          >
            Transaction History
          </Text>
          <Divider
            style={{
              marginVertical: 10,
              backgroundColor: colors.outlineVariant,
            }}
          />
          {loyaltyPointsData?.data?.history.map((item, idx) => (
            <View key={item.id}>
              <View style={styles.historyRow}>
                <View>
                  <Text variant="bodyMedium" style={{ color: colors.text }}>
                    {item.title}
                  </Text>
                  <Text
                    variant="bodySmall"
                    style={{
                      color: colors.onSurfaceVariant,
                      marginTop: 2,
                    }}
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
              {idx < loyaltyPointsData?.data?.history?.length - 1 && (
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

      {/* Popup Dialog */}
      <PopupDialog
        visible={modalVisible}
        onDismiss={() => setModalVisible(false)}
        title="How it Works"
        actions={[
          {
            label: "Got it",
            mode: "contained",
            onPress: () => setModalVisible(false),
          },
        ]}
      >
        {steps.map((item) => (
          <View key={item.step} style={styles.stepRow}>
            <View style={[styles.stepCircle, { borderColor: colors.primary }]}>
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
      </PopupDialog>
    </View>
  );
}

const styles = StyleSheet.create({
  scrollContent: { flexGrow: 1, padding: 20, paddingTop: 16 },
  balanceCard: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 20,
    alignItems: "center",
    elevation: 5,
  },
  redeemContainer: { alignSelf: "center", marginTop: 18 },
  redeemText: {
    textDecorationLine: "underline",
    fontWeight: "500",
    fontSize: 16,
  },
  howItWorksContainer: { alignSelf: "center", marginBottom: 24 },
  howItWorksText: {
    textDecorationLine: "underline",
    fontWeight: "500",
    fontSize: 16,
  },
  historyCard: { borderRadius: 16, padding: 20, elevation: 3 },
  historyRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
  },
  stepRow: { flexDirection: "row", alignItems: "center", marginBottom: 20 },
  stepCircle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
});
