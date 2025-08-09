import { StyleSheet, Text } from "react-native";
import { Button, Dialog, Portal, useTheme } from "react-native-paper";
import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated";

export default function PermissionDialog({ visible, onDismiss, onAllow }) {
  const theme = useTheme();

  return (
    <Portal>
      {visible && (
        <Animated.View
          entering={ZoomIn.duration(200)}
          exiting={ZoomOut.duration(150)}
          style={styles.overlay}
        >
          <Dialog
            visible={visible}
            onDismiss={onDismiss}
            style={[
              styles.dialog,
              {
                backgroundColor: theme.colors.primary,
                shadowColor: theme.colors.onPrimary,
              },
            ]}
          >
            <Dialog.Title
              style={[
                styles.title,
                {
                  color: theme.colors.onPrimary,
                  fontFamily: theme.fonts.bold?.fontFamily,
                },
              ]}
            >
              Permission Required
            </Dialog.Title>

            <Dialog.Content>
              <Text
                style={[
                  styles.message,
                  {
                    color: theme.colors.onPrimary,
                    fontFamily: theme.fonts.regular?.fontFamily,
                  },
                ]}
              >
                To change your profile image, please allow access to your
                gallery in the device settings.
              </Text>
            </Dialog.Content>

            <Dialog.Actions style={styles.actions}>
              <Button
                mode="contained"
                buttonColor={theme.colors.onPrimary}
                textColor={theme.colors.primary}
                labelStyle={{ fontWeight: "bold", fontSize: 16 }}
                style={styles.fullButton}
                onPress={onAllow}
              >
                Allow
              </Button>
            </Dialog.Actions>
          </Dialog>
        </Animated.View>
      )}
    </Portal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  dialog: {
    borderRadius: 16,
    paddingVertical: 10,
    paddingHorizontal: 15,
    elevation: 5,
    minWidth: "85%",
  },
  title: {
    fontSize: 20,
    marginBottom: 10,
  },
  message: {
    fontSize: 16,
    opacity: 0.9,
    marginBottom: 10,
  },
  actions: {
    paddingHorizontal: 10,
    paddingBottom: 15,
  },
  fullButton: {
    borderRadius: 8,
    paddingVertical: 12,
    flex: 1,
  },
});
