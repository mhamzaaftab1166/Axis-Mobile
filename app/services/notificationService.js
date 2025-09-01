// services/notificationService.js
const {
  getIndieNotificationInbox,
  deleteIndieNotificationInbox,
} = require("native-notify");

const notificationData = require("../utils/notificationData");

// Fetch inbox for a given Indie ID
export const fetchInboxNotifications = async (indieId) => {
  try {
    const notifications = await getIndieNotificationInbox(indieId, notificationData.default.appId, 
        notificationData.default.appToken, 50, 0);
    return notifications; // array of notifications
  } catch (error) {
    console.error("Error fetching notifications:", error);
    throw error;
  }
};

// Delete a specific notification by its ID
export const removeInboxNotification = async (indieId, notificationId) => {
  try {
    const result = await deleteIndieNotificationInbox(
      indieId,
      notificationData.appId, 
      notificationData.appToken,
      notificationId
    );
    return result; // success/failure response
  } catch (error) {
    console.error("Error deleting notification:", error);
    throw error;
  }
};
