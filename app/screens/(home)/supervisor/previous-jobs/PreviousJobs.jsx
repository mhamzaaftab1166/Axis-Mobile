import { router } from "expo-router";
import { useState } from "react";
import { StyleSheet, View } from "react-native";
import { useTheme } from "react-native-paper";
import ButtonSegmented from "../../../../components/common/ButtonSegmented";
import CenteredAppbarHeader from "../../../../components/common/CenteredAppBar";
import CompletedJobsDirect from "./CompletedJobsDirect";
import CompletedJosInspect from "./CompletedJosInspect";

export default function PreviousJobs() {
  const theme = useTheme();
  const { colors } = theme;
  const [selected, setSelected] = useState("direct");

  const options = [
    { label: "Direct", value: "direct" },
    { label: "Inspect", value: "inspect" },
  ];

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <CenteredAppbarHeader
        title="Completed Jobs"
        onBack={() => router.back()}
        cartDisplay={false}
      />
      <View style={{ paddingHorizontal: 16 }}>
        <ButtonSegmented
          options={options}
          selected={selected}
          onChange={setSelected}
        />
      </View>
      {selected === "direct" && <CompletedJobsDirect />}
      {selected === "inspect" && <CompletedJosInspect />}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
