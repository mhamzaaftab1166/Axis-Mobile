import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useNavigation } from "expo-router";
import { useCallback, useState } from "react";
import {
  Image,
  RefreshControl,
  StatusBar,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useTheme } from "react-native-paper";
import { SwipeListView } from "react-native-swipe-list-view";
import AvatarPlaceholder from "../../../assets/images/account/avatar.avif";
import CenteredAppbarHeader from "../../components/common/CenteredAppBar";

export default function Notifications() {
  const { colors, dark, fonts } = useTheme();
  const navigation = useNavigation();

  const screenBg = colors.background;
  const textColor = colors.text;
  const cardBg = dark ? colors.secondary : colors.surface;

  const [refreshing, setRefreshing] = useState(false);

  const [data] = useState([
    {
      id: "1",
      title: "Booking Confirmed",
      description: "Your appointment is confirmed for tomorrow.",
      image: AvatarPlaceholder,
    },
    {
      id: "2",
      title: "Service Completed",
      description: "Your cleaning service is now complete.",
      image: AvatarPlaceholder,
    },
    {
      id: "3",
      title: "Discount Available",
      description: "Get 20% off on your next service!",
      image: AvatarPlaceholder,
    },
  ]);

  const onRefresh = useCallback(() => {
    console.log("Refreshing notifications...");
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const handleDelete = (rowKey) => {
    console.log(rowKey);
  };

  const renderItem = (dataItem) => {
    const item = dataItem.item;
    return (
      <View
        style={[
          styles.notificationCard,
          {
            backgroundColor: cardBg,
            borderColor: dark ? colors.outline : "#ddd",
          },
        ]}
      >
        <Image source={item.image} style={styles.image} />
        <View style={styles.textContainer}>
          <Text
            style={[
              styles.title,
              { color: textColor, fontFamily: fonts.medium },
            ]}
          >
            {item.title}
          </Text>
          <Text
            style={[
              styles.description,
              { color: textColor, fontFamily: fonts.regular },
            ]}
          >
            {item.description}
          </Text>
        </View>
      </View>
    );
  };

  const renderHiddenItem = (dataItem) => {
    return (
      <View style={styles.rowBack}>
        <TouchableOpacity
          onPress={() => handleDelete(dataItem.item.id)}
          style={[styles.deleteButton, { backgroundColor: colors.error }]}
        >
          <MaterialCommunityIcons name="delete" size={24} color="#fff" />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: screenBg }]}>
      <StatusBar barStyle={"light-content"} backgroundColor={colors.primary} />

      <CenteredAppbarHeader
        title={"Notifications"}
        onBack={() => navigation.goBack()}
      />

      {/* List */}
      <SwipeListView
        data={data}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        renderHiddenItem={renderHiddenItem}
        rightOpenValue={-75}
        disableRightSwipe
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        contentContainerStyle={{ padding: 16 }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  notificationCard: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 12,
    borderWidth: 1,
  },
  image: {
    width: 48,
    height: 48,
    borderRadius: 24,
    marginRight: 12,
  },
  textContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
  },
  description: {
    fontSize: 14,
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
});
