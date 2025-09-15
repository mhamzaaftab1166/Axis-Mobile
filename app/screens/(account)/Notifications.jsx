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
import EmptyState from "../../components/common/EmptyState";
import Ratings from "../../components/Ratings";
import { useUserDetailQuery } from "../../hooks/useAuthQuery";
import {
  useDeleteNotification,
  useFetchNotifications,
} from "../../hooks/useNotificationQuery";
import { useSubmitServiceReview } from "../../hooks/useReviewQuery";
import NotificationsSkeleton from "../../skeltons/NotificationsSkelton";
import useAuthStore from "../../store/useAuthStore";

export default function Notifications() {
  const { colors, dark, fonts } = useTheme();
  const navigation = useNavigation();
  const [confirmVisible, setConfirmVisible] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const role = useAuthStore((s) => s.role);
  const [openReview, setOpenReview] = useState(false);
  const [serviceIdToReview, setServiceIdToReview] = useState(null);

  const [error, setError] = useState("");
  const [isError, setIsError] = useState(false);

  const { mutate: submitReview, isPending: submittedReview } = useSubmitServiceReview({
    onErrorCallback: (errMsg) => {
      setError(errMsg);
      setIsError(true);
    },
    onSuccessCallback: () => {
      setError("");
      setIsError(false);
      setOpenReview(false);
      setServiceIdToReview(null);
    },
  });

  const screenBg = colors.background;
  const textColor = colors.text;
  const cardBg = dark ? colors.secondary : colors.surface;

  const { userData, isLoading: fetchingUser } = useUserDetailQuery();
  const { data: userNotifications, isLoading: gettingNotifications } =
    useFetchNotifications(userData?.data?.user?._id);
  const { mutate: deleteNotification, isPending: isDeleting } =
    useDeleteNotification({
      onSuccessCallback: () => {
        setConfirmVisible(false);
        setSelectedId(null);
      },
      onErrorCallback: (error) => {},
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

  const onSubmitReview = (values)=>{
    if(!setServiceIdToReview){
      return;
    }
    submitReview({
      bookingId: serviceIdToReview,
      values
    });
  }

  const renderItem = (dataItem) => {
    const item = dataItem.item;
    return (
      <TouchableOpacity
        onPress={()=>{
          const data = JSON.parse(dataItem.item?.pushData)
          setServiceIdToReview(data?.serviceId);
          setOpenReview(true);
        }}
      >
        <View
          style={[
            styles.notificationCard,
            {
              backgroundColor: cardBg,
              borderColor: dark ? colors.outline : "#ddd",
            },
          ]}
        >
          <Ratings
            error={error}
            errorVisible={isError}
            visible={openReview}
            onSubmit={onSubmitReview}
            isSubmitting={submittedReview}
            onDismiss={()=>{
              setOpenReview(false);
            }}
          />
          <Image
            source={require("../../../assets/images/account/avatar.avif")}
            style={styles.image}
          />
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
      </TouchableOpacity>
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

  if (fetchingUser || gettingNotifications) return <NotificationsSkeleton />;
  return (
    <View style={[styles.container, { backgroundColor: screenBg }]}>
      <StatusBar barStyle={"light-content"} backgroundColor={colors.primary} />
      <CenteredAppbarHeader
        title={"Notifications"}
        onBack={() => navigation.goBack()}
        cartDisplay={role === "supervisor" ? false : true}
      />

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
        contentContainerStyle={{
          flexGrow: 1,
          padding: 16,
          justifyContent:
            userNotifications?.length === 0 ? "center" : "flex-start",
        }}
        ItemSeparatorComponent={() => <View style={{ height: 12 }} />}
        ListEmptyComponent={() => (
          <EmptyState
            iconName="notifications-off"
            title="No Notifications"
            description="You currently have no notifications."
          />
        )}
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
