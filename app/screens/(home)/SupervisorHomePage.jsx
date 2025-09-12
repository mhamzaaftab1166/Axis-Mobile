import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { View } from "react-native";
import config from "../../../config.json";
import StatCard from "../../components/common/StatCard";
import Greetings from "../../components/home/Greetings";
import WeekServicesSection from "../../components/home/WeekServicesSection";
import { getNextWeekServices } from "../../helpers/general";
import { ROUTES } from "../../helpers/routePaths";
import { useGetSupervisorStats, useGetSupServices } from "../../hooks/useBookingQuery";
import SupervisorHomeSkeleton from "../../skeltons/SupervisorHomeLoadingSkelton";
import { useSupServicesStore } from "../../store/useSupServicesStore";

const SupervisorHomePage = ({ userData }) => {
  // stats
  const { data: myStatsData, isLoading: fetchingStats } = useGetSupervisorStats();

  // loading flag
  const { isLoading: fetchingSupervisorServices } = useGetSupServices();
  const supervisorServices = useSupServicesStore((s) => s.services);
  const filtered = getNextWeekServices(supervisorServices);

  if (fetchingStats || fetchingSupervisorServices) return <SupervisorHomeSkeleton />;
  return (
    <View style={{ flex: 1 }}>
      <Greetings
        name={userData?.data?.user?.name}
        profilePic={`${config.pictureUrl}/${userData?.data?.user?.profileImage}`}
      />

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
          count={myStatsData?.previous}
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
          count={myStatsData?.assigned}
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
      {/* filter out the ones for today + next 6 days */}
      <WeekServicesSection services={filtered} />
    </View>
  );
};

export default SupervisorHomePage;
