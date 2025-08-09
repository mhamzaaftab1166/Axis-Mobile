import { StyleSheet, Text, View } from "react-native";
import { Button, Dialog, Portal, useTheme } from "react-native-paper";
import Animated, { ZoomIn, ZoomOut } from "react-native-reanimated";

export default function ConfirmDialog({
  visible,
  title = "Confirm Action",
  message = "Are you sure?",
  onCancel,
  onConfirm,
}) {
  const { colors, fonts } = useTheme();

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
            onDismiss={onCancel}
            style={[
              styles.dialog,
              {
                backgroundColor: colors.primary,
                shadowColor: colors.onPrimary,
              },
            ]}
          >
            <Dialog.Title
              style={[
                styles.title,
                {
                  color: colors.onPrimary,
                  fontFamily: fonts?.bold?.fontFamily,
                },
              ]}
            >
              {title}
            </Dialog.Title>

            <Dialog.Content>
              <Text
                style={[
                  styles.message,
                  {
                    color: colors.onPrimary,
                    fontFamily: fonts?.regular?.fontFamily,
                  },
                ]}
              >
                {message}
              </Text>
            </Dialog.Content>

            <View style={styles.actionRow}>
              <Button
                mode="outlined"
                labelStyle={{
                  color: colors.onPrimary,
                  fontWeight: "bold",
                  fontSize: 16,
                }}
                style={[styles.fullButton, { borderColor: colors.onPrimary }]}
                onPress={onCancel}
              >
                Cancel
              </Button>
              <Button
                mode="contained"
                buttonColor={colors.onPrimary}
                textColor={colors.primary}
                labelStyle={{ fontWeight: "bold", fontSize: 16 }}
                style={styles.fullButton}
                onPress={onConfirm}
              >
                Confirm
              </Button>
            </View>
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
    paddingHorizontal: 5,
    elevation: 5,
    minWidth: "85%",
  },
  title: {
    fontSize: 20,
    marginBottom: 4,
  },
  message: {
    fontSize: 16,
    opacity: 0.9,
    marginBottom: 4,
  },
  actionRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  fullButton: {
    flex: 1,
    borderRadius: 8,
    paddingVertical: 5,
  },
});
