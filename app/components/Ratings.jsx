import { MaterialIcons } from "@expo/vector-icons";
import { useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { Divider, Text, useTheme } from "react-native-paper";
import PopupDialog from "../components/common/PopupDialogue";
import AppForm from "./forms/AppForm";
import AppFormField from "./forms/AppFormFeild";
import SubmitButton from "./forms/AppSubmitButton";

const { width: SCREEN_WIDTH } = Dimensions.get("window");

export default function ReviewPopup({ visible, onDismiss, onSubmit }) {
  const { colors } = useTheme();
  const [serviceRating, setServiceRating] = useState(0);
  const [staffRating, setStaffRating] = useState(0);

  const handleSubmit = (values) => {
    const payload = {
      serviceRating,
      serviceComment: values.serviceComment,
      staffRating,
      staffComment: values.staffComment,
    };
    onSubmit?.(payload);
    onDismiss?.();
  };

  const renderStars = (rating, setRating) => {
    return (
      <View style={styles.starRow}>
        {[1, 2, 3, 4, 5].map((i) => (
          <TouchableOpacity
            key={i}
            onPress={() => setRating(i)}
            style={{ flex: 1, alignItems: "center" }}
          >
            <MaterialIcons
              name={i <= rating ? "star" : "star-border"}
              size={40} // bigger star
              color={colors.primary}
            />
          </TouchableOpacity>
        ))}
      </View>
    );
  };

  return (
    <PopupDialog
      visible={visible}
      onDismiss={onDismiss}
      title="Add Review"
      widthPercent={0.95}
    >
      <ScrollView
        style={{ maxHeight: 450 }}
        contentContainerStyle={{ paddingBottom: 16 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Service Review */}
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Service Review
        </Text>
        {renderStars(serviceRating, setServiceRating)}
        <AppForm
          initialValues={{ serviceComment: "", staffComment: "" }}
          onSubmit={handleSubmit}
        >
          <AppFormField
            name="serviceComment"
            label="Service Comment (Optional)"
            placeholder="Write your comment..."
            mode="outlined"
            multiline
            numberOfLines={2}
          />

          <Divider style={{ marginVertical: 16 }} />

          {/* Staff Review */}
          <Text style={[styles.sectionTitle, { color: colors.text }]}>
            Staff Review
          </Text>
          {renderStars(staffRating, setStaffRating)}
          <AppFormField
            name="staffComment"
            label="Staff Comment (Optional)"
            placeholder="Write your comment..."
            mode="outlined"
            multiline
            numberOfLines={2}
          />

          <SubmitButton
            title="Submit Review"
            disabled={serviceRating === 0 || staffRating === 0}
          />
        </AppForm>
      </ScrollView>
    </PopupDialog>
  );
}

const styles = StyleSheet.create({
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 6,
  },
  starRow: {
    flexDirection: "row",
    width: SCREEN_WIDTH * 0.85,
    alignSelf: "center",
  },
});
