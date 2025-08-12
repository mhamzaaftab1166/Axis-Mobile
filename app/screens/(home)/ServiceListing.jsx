import { useNavigation } from "expo-router";
import { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";
import CenteredAppbarHeader from "../../components/common/CenteredAppBar";
import SearchBarWithToggle from "../../components/common/SearchBarWithToggle";
import SelectableChips from "../../components/common/SelectableChips";

const categories = [
  "Cleaning",
  "Repairing",
  "Plumbing",
  "Electrical",
  "Painting",
  "Gardening",
];

export default function ServiceListing() {
  const navigation = useNavigation();
  const { colors } = useTheme();

  const [searchText, setSearchText] = useState("");
  const [viewMode, setViewMode] = useState("grid");
  const [selectedCategories, setSelectedCategories] = useState([]);

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CenteredAppbarHeader
        title="Service Listing"
        onBack={() => navigation.goBack()}
      />
      <View style={styles.controlsContainer}>
        <SelectableChips
          options={categories}
          selectedOptions={selectedCategories}
          onChange={setSelectedCategories}
        />
        <SearchBarWithToggle
          searchValue={searchText}
          onSearchChange={setSearchText}
          viewMode={viewMode}
          onToggleView={setViewMode}
        />
      </View>

      <ScrollView contentContainerStyle={styles.content}>
        {/* TODO: Your grid/list of services */}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  controlsContainer: {
    paddingVertical: 8,
  },
  content: {
    padding: 16,
    flexGrow: 1,
  },
});
