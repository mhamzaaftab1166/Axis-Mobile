import { useEffect, useRef } from "react";
import { Animated, StyleSheet } from "react-native";
import { useTheme } from "react-native-paper";

const AppSkeleton = ({ width, height, borderRadius = 4, style }) => {
  const shimmerAnim = useRef(new Animated.Value(0)).current;
  const { dark, colors } = useTheme();

  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(shimmerAnim, {
          toValue: 1,
          duration: 1000,
          useNativeDriver: false,
        }),
        Animated.timing(shimmerAnim, {
          toValue: 0,
          duration: 1000,
          useNativeDriver: false,
        }),
      ])
    ).start();
  }, [shimmerAnim]);

  const backgroundColor = shimmerAnim.interpolate({
    inputRange: [0, 1],
    outputRange: dark
      ? [colors.surfaceVariant || "#333333", "#444444"]
      : ["#e0e0e0", "#f5f5f5"],
  });

  return (
    <Animated.View
      style={[
        styles.skeleton,
        { width, height, borderRadius, backgroundColor },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  skeleton: {
    marginVertical: 6,
  },
});

export default AppSkeleton;
