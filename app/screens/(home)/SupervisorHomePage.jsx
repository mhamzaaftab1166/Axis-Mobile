import { MaterialCommunityIcons } from "@expo/vector-icons";
import { StyleSheet, View } from "react-native";
import StatCard from "../../components/common/StatCard";
import Greetings from "../../components/home/Greetings";

const SupervisorHomePage = ({ userData }) => {
  return (
    <View>
      <Greetings name={userData?.data?.user?.name} />
      <View style={{ height: 20 }} />
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <StatCard
          label="Completed Jobs"
          count={1243}
          icon={
            <MaterialCommunityIcons
              name="check-circle"
              size={22}
              color="#fff"
            />
          }
          variant="success"
          onPress={() => console.log("Completed Jobs tapped")}
        />

        <StatCard
          label="Assigned Jobs"
          count={37}
          icon={
            <MaterialCommunityIcons name="briefcase" size={22} color="#fff" />
          }
          variant="warning"
          onPress={() => console.log("Assigned Jobs tapped")}
        />
      </View>
    </View>
  );
};

export default SupervisorHomePage;

const styles = StyleSheet.create({});
