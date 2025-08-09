import * as ImagePicker from "expo-image-picker";
import { useState } from "react";
import {
  Image,
  Linking,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { IconButton, useTheme } from "react-native-paper";
import PermissionDialog from "./common/PermissionsDialog";

const AppImagePicker = ({ imageUri, onChangeImage, onError }) => {
  const theme = useTheme();
  const [showDialog, setShowDialog] = useState(false);

  const requestPermission = async () => {
    const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (!granted) setShowDialog(true);
    return granted;
  };

  const handlePress = async () => {
    const granted = await requestPermission();
    if (!granted) return;

    try {
      const result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ["images"],
        quality: 0.5,
        allowsEditing: true,
        aspect: [1, 1],
      });

      if (!result.canceled && result.assets.length > 0) {
        onChangeImage(result.assets[0].uri);
      }
    } catch (error) {
      console.log("Image picking error:", error);
      onError && onError("Something went wrong while selecting the image.");
    }
  };

  const handleGoToSettings = () => {
    setShowDialog(false);
    Linking.openSettings();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity onPress={handlePress} activeOpacity={0.8}>
        <View>
          <Image
            source={
              imageUri
                ? { uri: imageUri }
                : require("../../assets/images/account/avatar.avif")
            }
            style={styles.image}
          />
          <IconButton
            icon="pencil"
            size={18}
            style={styles.editIcon}
            iconColor={theme.colors.onPrimary}
            containerColor={theme.colors.primary}
          />
        </View>
      </TouchableOpacity>

      <PermissionDialog
        visible={showDialog}
        onDismiss={() => setShowDialog(false)}
        onAllow={handleGoToSettings}
      />
    </View>
  );
};

export default AppImagePicker;

const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    marginVertical: 24,
  },
  image: {
    width: 120,
    height: 120,
    borderRadius: 60,
    resizeMode: "cover",
  },
  editIcon: {
    position: "absolute",
    bottom: 0,
    right: 0,
  },
});
