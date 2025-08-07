import { StyleSheet, Text, View } from "react-native";
import { Avatar, useTheme } from "react-native-paper";

const DetailItem = ({ icon, iconBg, label, value }) => {
  const { colors, fonts } = useTheme();
  return (
    <View style={styles.row}>
      <Avatar.Icon
        icon={icon}
        size={32}
        style={[styles.avatar, { backgroundColor: iconBg }]}
        color="#fff"
      />
      <View style={styles.textContainer}>
        <Text
          style={[
            styles.label,
            { color: colors.text, fontFamily: fonts.medium },
          ]}
        >
          {label}
        </Text>
        <Text
          style={[
            styles.value,
            { color: colors.text, fontFamily: fonts.regular },
          ]}
        >
          {value || "-"}
        </Text>
      </View>
    </View>
  );
};

export default DetailItem;

const styles = StyleSheet.create({
  row: { flexDirection: "row", alignItems: "center", marginBottom: 16 },
  avatar: { elevation: 3 },
  textContainer: { marginLeft: 12, flex: 1 },
  label: { fontSize: 16 },
  value: { fontSize: 16, marginTop: 4, opacity: 0.8 },
  sectionTitle: { fontSize: 16, fontWeight: "bold", marginVertical: 8 },
});
