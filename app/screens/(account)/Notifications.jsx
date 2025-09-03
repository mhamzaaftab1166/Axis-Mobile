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
import CenteredAppbarHeader from "../../components/common/CenteredAppBar";
import ConfirmDialog from "../../components/common/ConfirmDialog";
import LoadingOverlay from "../../components/LoadingOverlay";
import { useUserDetailQuery } from "../../hooks/useAuthQuery";
import { useDeleteNotification, useFetchNotifications } from "../../hooks/useNotificationQuery";

export default function Notifications() {
  const { colors, dark, fonts } = useTheme();
  const navigation = useNavigation();
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [selectedId, setSelectedId] = useState(null);

  const screenBg = colors.background;
  const textColor = colors.text;
  const cardBg = dark ? colors.secondary : colors.surface;

  const { userData, isLoading: fetchingUser } = useUserDetailQuery();
  const { data: userNotifications, isLoading: gettingNotifications } = useFetchNotifications(userData?.data?.user?._id);
  const { mutate: deleteNotification, isPending: isDeleting } = useDeleteNotification({
    onSuccessCallback: () => {
      setConfirmVisible(false);
      setSelectedId(null);
    },
    onErrorCallback: (error)=>{}
  });

  const [refreshing, setRefreshing] = useState(false);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setTimeout(() => setRefreshing(false), 1000);
  }, []);

  const handleDelete = (id) => {
    setSelectedId(id);
    setConfirmVisible(true);
  };

  const onConfirmDelete = () => {
    deleteNotification({
      indieId: userData?.data?.user?._id,
      notificationId: selectedId,
    });
  };

  const onCancelDelete = () => {
    setConfirmVisible(false);
    setSelectedId(null);
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
        <Image source={require("../../../assets/images/account/avatar.avif")} style={styles.image} />
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
            {item.message}
          </Text>
        </View>
      </View>
    );
  };

  const renderHiddenItem = (dataItem) => {
    return (
      <View style={styles.rowBack}>
        <TouchableOpacity
          onPress={() => handleDelete(dataItem.item.notification_id)}
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
      <LoadingOverlay  visible={fetchingUser || gettingNotifications }/>
      <CenteredAppbarHeader
        title={"Notifications"}
        onBack={() => navigation.goBack()}
      />

      {/* List */}
      <SwipeListView
        data={userNotifications}
        keyExtractor={(item) => String(item.notification_id)}
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

      <ConfirmDialog
        visible={confirmVisible}
        title="Delete Notification"
        message="Are you sure you want to delete this notification?"
        onCancel={onCancelDelete}
        onConfirm={onConfirmDelete}
        isLoading={isDeleting}
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
