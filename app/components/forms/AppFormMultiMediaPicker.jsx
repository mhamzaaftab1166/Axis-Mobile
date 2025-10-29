import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import { useVideoPlayer, VideoView } from "expo-video";
import { useFormikContext } from "formik";
import { useState } from "react";
import {
  ActivityIndicator,
  Image,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import { useTheme } from "react-native-paper";
import AppAlert from "../common/AppAlert";
import AppErrorMessage from "./AppErrorMessage";

export default function AppMultiMediaPicker({
  name,
  mediaType = "image",
  maxImageSize = 2 * 1024 * 1024,
  maxVideoSize = 8 * 1024 * 1024,
  maxItems = 10,
}) {
  const { colors } = useTheme();
  const { values, setFieldValue, touched, errors } = useFormikContext();
  const mediaUris = Array.isArray(values?.[name]) ? values[name] : [];

  const [alertVisible, setAlertVisible] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const [showPermissionAlert, setShowPermissionAlert] = useState(false);

  const normalizeAssetToUri = (result) => {
    if (!result) return null;
    if (Array.isArray(result.assets) && result.assets.length > 0)
      return result.assets[0]?.uri ?? null;
    if (typeof result.uri === "string") return result.uri;
    if (result.assets && typeof result.assets === "object") {
      const firstKey = Object.keys(result.assets)[0];
      return result.assets[firstKey]?.uri ?? null;
    }
    return null;
  };

  const safeGetFileSize = async (uri) => {
    if (!uri) return 0;
    try {
      const resp = await fetch(uri);
      const blob = await resp.blob();
      return blob?.size || 0;
    } catch (err) {
      console.warn("safeGetFileSize failed:", err);
      return 0;
    }
  };

  const addUris = (uris) => {
    if (!Array.isArray(uris)) uris = [uris].filter(Boolean);
    if (uris.length === 0) return;
    setFieldValue(name, [...mediaUris, ...uris].slice(0, maxItems));
  };

  const removeUri = (uri) => {
    if (!uri) return;
    setFieldValue(
      name,
      mediaUris.filter((u) => u !== uri)
    );
  };

  const handleAddPress = async () => {
    try {
      const current = await ImagePicker.getMediaLibraryPermissionsAsync();
      if (current?.status === "granted") {
        await launchPicker();
        return;
      }
      const requested = await ImagePicker.requestMediaLibraryPermissionsAsync();
      if (requested?.status === "granted") {
        await launchPicker();
        return;
      }
      setShowPermissionAlert(true);
    } catch (err) {
      console.error("Permission check error:", err);
      setAlertMessage("Unable to access media library. Please try again.");
      setAlertVisible(true);
    }
  };

  const openAppSettings = async () => {
    try {
      await Linking.openSettings();
    } catch (err) {
      console.warn("Failed to open settings:", err);
    } finally {
      setShowPermissionAlert(false);
    }
  };

  const launchPicker = async () => {
    try {
      const mediaOption =
        mediaType === "video"
          ? ImagePicker.MediaTypeOptions.Videos
          : mediaType === "image"
          ? ImagePicker.MediaTypeOptions.Images
          : ImagePicker.MediaTypeOptions.All;

      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: mediaOption,
        quality: 0.6,
        allowsEditing: true,
        aspect: [1, 1],
        selectionLimit: 1,
      });

      if (!result) return;
      if (result.canceled === true || result.cancelled === true) return;

      const uri = normalizeAssetToUri(result);
      if (!uri) {
        setAlertMessage("No file selected. Please try again.");
        setAlertVisible(true);
        return;
      }

      const size = await safeGetFileSize(uri);

      if (mediaType === "video" && size > maxVideoSize) {
        setAlertMessage("Video file size exceeds the allowed limit.");
        setAlertVisible(true);
        return;
      }
      if (mediaType === "image" && size > maxImageSize) {
        setAlertMessage("Image file size exceeds the allowed limit.");
        setAlertVisible(true);
        return;
      }

      addUris(uri);
    } catch (err) {
      console.error("launchPicker error:", err);
      setAlertMessage(
        "An error occurred while picking media. Please try again."
      );
      setAlertVisible(true);
    }
  };

  return (
    <View>
      <View style={styles.grid}>
        {mediaUris.map((uri) => (
          <View style={styles.tileWrapper} key={uri}>
            <MediaTile
              uri={uri}
              onRemove={() => removeUri(uri)}
              mediaType={mediaType}
            />
          </View>
        ))}

        {mediaUris.length < maxItems ? (
          <View style={styles.tileWrapper}>
            <TouchableWithoutFeedback onPress={handleAddPress}>
              <View
                style={[
                  styles.tile,
                  {
                    borderColor: colors.outline,
                    backgroundColor: colors.surfaceVariant,
                  },
                ]}
              >
                <MaterialCommunityIcons
                  name={mediaType === "video" ? "video-plus" : "camera-plus"}
                  size={36}
                  color={colors.primary}
                />
                <Text style={{ marginTop: 6, color: colors.onSurfaceVariant }}>
                  Add
                </Text>
              </View>
            </TouchableWithoutFeedback>
          </View>
        ) : null}
      </View>

      <AppErrorMessage error={errors?.[name]} visible={touched?.[name]} />

      {alertVisible && (
        <AppAlert
          showAlert={alertVisible}
          title="Error"
          message={alertMessage}
          showConfirmButton
          confirmText="OK"
          onConfirmPressed={() => setAlertVisible(false)}
        />
      )}

      {showPermissionAlert && (
        <AppAlert
          showAlert={showPermissionAlert}
          title="Permission required"
          message="This app needs access to your media library. Please enable media permissions in your device settings."
          showCancelButton
          showConfirmButton
          confirmText="Open Settings"
          cancelText="Later"
          onConfirmPressed={openAppSettings}
          onCancelPressed={() => setShowPermissionAlert(false)}
        />
      )}
    </View>
  );
}

function MediaTile({ uri, onRemove, mediaType }) {
  const { colors } = useTheme();
  const [loading] = useState(false);
  const [confirmVisible, setConfirmVisible] = useState(false);

  const player = useVideoPlayer(uri, (p) => {
    p.loop = true;
    p.volume = 0;
    p.play();
  });

  const isVideo =
    mediaType === "video" ||
    (mediaType === "mixed" && /\.(mp4|mov|m4v|webm)$/i.test(uri));

  const handlePress = () => {
    // show AppAlert confirmation instead of native Alert
    setConfirmVisible(true);
  };

  return (
    <TouchableWithoutFeedback onPress={handlePress}>
      <View
        style={[
          styles.tile,
          { borderColor: colors.outline, backgroundColor: colors.surface },
        ]}
      >
        {loading && <ActivityIndicator size="small" color={colors.primary} />}
        {!loading && !isVideo && (
          <>
            <Image
              source={{ uri }}
              style={styles.previewImage}
              resizeMode="cover"
            />

            {/* Semi-transparent overlay with centered delete icon */}
            <TouchableOpacity
              style={styles.overlay}
              activeOpacity={0.7}
              onPress={() => setConfirmVisible(true)}
            >
              <View style={styles.iconCircle}>
                <MaterialCommunityIcons
                  name="trash-can-outline"
                  size={28}
                  color="white"
                />
              </View>
            </TouchableOpacity>
          </>
        )}

        {!loading && isVideo && (
          <>
            <VideoView
              player={player}
              style={styles.previewImage}
              nativeControls
              startsPictureInPictureAutomatically
            />

            {/* For videos we still show the delete overlay icon */}
            <TouchableOpacity
              style={styles.overlay}
              activeOpacity={0.7}
              onPress={() => setConfirmVisible(true)}
            >
              <View style={styles.iconCircle}>
                <MaterialCommunityIcons
                  name="trash-can-outline"
                  size={28}
                  color="white"
                />
              </View>
            </TouchableOpacity>
          </>
        )}

        {/* Confirmation using AppAlert */}
        {confirmVisible && (
          <AppAlert
            showAlert={confirmVisible}
            title="Delete"
            message="Remove this media?"
            showCancelButton
            showConfirmButton
            confirmText="Yes"
            cancelText="No"
            onConfirmPressed={() => {
              setConfirmVisible(false);
              onRemove();
            }}
            onCancelPressed={() => setConfirmVisible(false)}
          />
        )}
      </View>
    </TouchableWithoutFeedback>
  );
}

const styles = StyleSheet.create({
  grid: { flexDirection: "row", flexWrap: "wrap" },
  tileWrapper: { width: "33.33%", padding: 6, marginTop: 8 },
  tile: {
    borderWidth: 1,
    borderRadius: 12,
    height: 110,
    alignItems: "center",
    justifyContent: "center",
    overflow: "hidden",
    padding: 6,
  },
  previewImage: { width: "100%", height: "100%" },
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.35)",
    alignItems: "center",
    justifyContent: "center",
  },
  iconCircle: {
    backgroundColor: "rgba(0,0,0,0.5)",
    padding: 8,
    borderRadius: 999,
  },
});
