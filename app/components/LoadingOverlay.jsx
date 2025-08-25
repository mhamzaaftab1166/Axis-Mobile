import { StyleSheet, View } from 'react-native';
import { ActivityIndicator, Portal } from 'react-native-paper';

const LoadingOverlay = ({ visible }) => {
  if (!visible) return null;

  return (
    <Portal>
      <View style={styles.overlay}>
        <ActivityIndicator animating={true} size="large" color="#ffffff" />
      </View>
    </Portal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 9999,
  },
});

export default LoadingOverlay;