// components/SearchWithDropdown.js
import { MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  Animated,
  Easing,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { Portal, useTheme } from "react-native-paper";
import { ROUTES } from "../../helpers/routePaths";

export default function SearchWithDropdown({
  onNotificationPress,
  notificationCount = 3,
  suggestions: suggestionsProp,
}) {
  const { colors } = useTheme();

  const recommendedDefault = useMemo(
    () => [
      "Deep Cleaning",
      "Carpet Cleaning",
      "Sofa Cleaning",
      "Window Cleaning",
      "Bathroom Cleaning",
      "Kitchen Cleaning",
    ],
    []
  );
  const recommended = Array.isArray(suggestionsProp)
    ? suggestionsProp
    : recommendedDefault;

  const [query, setQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [inputLayout, setInputLayout] = useState(null);

  const inputRef = useRef(null);
  const animated = useRef({
    opacity: new Animated.Value(0),
    translateY: new Animated.Value(-6),
  }).current;

  useEffect(() => {
    if (showDropdown) {
      Animated.parallel([
        Animated.timing(animated.opacity, {
          toValue: 1,
          duration: 160,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(animated.translateY, {
          toValue: 0,
          duration: 200,
          easing: Easing.out(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    } else {
      Animated.parallel([
        Animated.timing(animated.opacity, {
          toValue: 0,
          duration: 120,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
        Animated.timing(animated.translateY, {
          toValue: -6,
          duration: 140,
          easing: Easing.in(Easing.cubic),
          useNativeDriver: true,
        }),
      ]).start();
    }
  }, [showDropdown, animated]);

  const filtered = recommended.filter((item) =>
    item.toLowerCase().includes(query.toLowerCase())
  );

  const measureInput = (cb) => {
    if (!inputRef.current || !inputRef.current.measureInWindow)
      return cb && cb(null);
    inputRef.current.measureInWindow((x, y, width, height) => {
      cb && cb({ x, y, width, height });
    });
  };

  const openDropdownAndMeasure = () => {
    measureInput((layout) => {
      setInputLayout(layout || null);
      setShowDropdown(filtered.length > 0 && query.length > 0);
    });
  };

  const handleChangeText = (text) => {
    setQuery(text);
    const match = recommended.filter((item) =>
      item.toLowerCase().includes(text.toLowerCase())
    );
    if (text.length > 0 && match.length > 0) {
      measureInput((layout) => {
        setInputLayout(layout || null);
        setShowDropdown(true);
      });
    } else {
      setShowDropdown(false);
    }
  };

  const handleFocus = () => {
    openDropdownAndMeasure();
  };

  const handleBlur = () => {
    setTimeout(() => setShowDropdown(false), 120);
  };

  const selectItem = (item) => {
    router.push({
      pathname: ROUTES.SERVICE_LISTING,
      params: { selectedItem: item },
    });
    setQuery(item);
    setShowDropdown(false);
    inputRef.current?.blur && inputRef.current.blur();
  };

  const clearQuery = () => {
    setQuery("");
    setShowDropdown(false);
    setTimeout(() => inputRef.current?.focus && inputRef.current.focus(), 50);
  };

  const dropdownTop = inputLayout ? inputLayout.y + inputLayout.height + 6 : 0;
  const dropdownLeft = inputLayout ? inputLayout.x : 12;
  const dropdownWidth = inputLayout ? inputLayout.width : "90%";

  return (
    <View style={styles.wrapper}>
      <View style={styles.container}>
        <View style={styles.inputWrapper}>
          <TextInput
            ref={inputRef}
            style={[
              styles.input,
              {
                borderColor: colors.outline ?? "#ddd",
                color: colors.onSurface,
                backgroundColor: colors.surface,
              },
            ]}
            placeholder="Search cleaning services..."
            placeholderTextColor={colors.onSurfaceDisabled}
            value={query}
            onChangeText={handleChangeText}
            onFocus={handleFocus}
            onBlur={handleBlur}
            returnKeyType="search"
            accessible
            accessibilityLabel="Search input"
            onSubmitEditing={() => {
              if (query.trim().length > 0) {
                router.push({
                  pathname: ROUTES.SERVICE_LISTING,
                  params: { selectedItem: query.trim() },
                });
                setShowDropdown(false);
                inputRef.current?.blur && inputRef.current.blur();
              }
            }}
          />

          {query.length > 0 && (
            <TouchableOpacity
              onPress={clearQuery}
              style={[styles.clearButton, { backgroundColor: colors.surface }]}
              hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
              accessibilityLabel="Clear search"
            >
              <MaterialIcons name="close" size={18} color={colors.onSurface} />
            </TouchableOpacity>
          )}
        </View>

        <TouchableOpacity
          style={styles.notifWrapper}
          onPress={onNotificationPress}
          activeOpacity={0.75}
          accessibilityLabel="Notifications"
        >
          <MaterialIcons
            name="notifications"
            size={28}
            color={colors.onSurface}
          />
          {notificationCount > 0 && (
            <View style={[styles.badge, { backgroundColor: colors.error }]}>
              <Text style={styles.badgeText}>{notificationCount}</Text>
            </View>
          )}
        </TouchableOpacity>
      </View>

      <Portal>
        {showDropdown && (
          <Pressable
            style={styles.fullOverlay}
            onPress={() => setShowDropdown(false)}
          />
        )}

        {showDropdown && (
          <Animated.View
            style={[
              styles.portalDropdown,
              {
                top: dropdownTop,
                left: dropdownLeft,
                width: dropdownWidth,
                backgroundColor: colors.surface,
                borderColor: colors.outline ?? "#e6e6e6",
                opacity: animated.opacity,
                transform: [{ translateY: animated.translateY }],
                elevation: 8,
                zIndex: 99999,
              },
            ]}
          >
            {filtered.map((item, idx) => {
              const isLast = idx === filtered.length - 1;
              return (
                <TouchableOpacity
                  key={item}
                  activeOpacity={0.8}
                  onPress={() => selectItem(item)}
                  style={[
                    styles.dropdownItem,
                    !isLast && {
                      borderBottomWidth: 1,
                      borderBottomColor: colors.outlineVariant ?? "#eee",
                    },
                  ]}
                >
                  <Text
                    style={[styles.dropdownText, { color: colors.onSurface }]}
                    numberOfLines={1}
                  >
                    {item}
                  </Text>
                  <MaterialIcons
                    name="arrow-outward"
                    size={18}
                    color={colors.primary}
                  />
                </TouchableOpacity>
              );
            })}
          </Animated.View>
        )}
      </Portal>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    position: "relative",
    zIndex: 0,
  },
  container: {
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
  },
  inputWrapper: {
    flex: 1,
    position: "relative",
    justifyContent: "center",
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: Platform.select({ ios: 10, android: 8 }),
    fontSize: 16,
  },
  clearButton: {
    position: "absolute",
    right: 8,
    height: 32,
    width: 32,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  notifWrapper: {
    marginLeft: 12,
    width: 36,
    height: 36,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
  },
  badge: {
    position: "absolute",
    right: 2,
    top: 0,
    minWidth: 18,
    height: 18,
    borderRadius: 9,
    paddingHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  badgeText: {
    color: "#fff",
    fontSize: 11,
    fontWeight: "700",
  },
  fullOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 1,
  },
  portalDropdown: {
    position: "absolute",
    borderWidth: 1,
    borderRadius: 10,
    overflow: "hidden",
    maxHeight: 240,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.08,
    shadowRadius: 10,
  },
  dropdownItem: {
    paddingVertical: 12,
    paddingHorizontal: 14,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  dropdownText: {
    fontSize: 16,
    flex: 1,
    marginRight: 8,
  },
});
