import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, View } from "react-native";
import StatCard from "../../components/common/StatCard";
import Greetings from "../../components/home/Greetings";
import WeekServicesSection from "../../components/home/WeekServicesSection";
import { ROUTES } from "../../helpers/routePaths";

const SupervisorHomePage = ({ userData }) => {
  return (
    <View style={{ flex: 1 }}>
      <Greetings name={userData?.data?.user?.name} />

      <View style={{ height: 20 }} />

      {/* Stat cards row */}
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <StatCard
          label="Previous Jobs"
          count={1243}
          icon={
            <MaterialCommunityIcons
              name="check-circle"
              size={22}
              color="#fff"
            />
          }
          variant="success"
          onPress={() => router.push(ROUTES.SUPERVSOR_COMPLETED_JOBS)}
        />

        <StatCard
          label="Assigned Jobs"
          count={37}
          icon={
            <MaterialCommunityIcons name="briefcase" size={22} color="#fff" />
          }
          variant="warning"
          onPress={() => router.push(ROUTES.SUPERVSOR_ASSIGNED_JOBS)}
        />
      </View>

      {/* Add some spacing before the next row */}
      <View style={{ height: 24 }} />

      {/* Week Services Section in a new row */}
      <WeekServicesSection
        services={[
          {
            id: "service-1",
            subServices: [
              {
                id: "AS-3001",
                scheduledDate: "12 September, 2025",
                time: "09:00",
                status: "In Progress",
              },
              {
                id: "AS-3002",
                scheduledDate: "12 September, 2025",
                time: "11:30",
                status: "Pending",
              },
            ],
          },
        ]}
      />
    </View>
  );
};

export default SupervisorHomePage;

const styles = StyleSheet.create({});
