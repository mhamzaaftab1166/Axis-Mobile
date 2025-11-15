import { MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { IconoirProvider } from 'iconoir-react-native';
import { View } from "react-native";
import config from "../../../config.json";
import StatCard from "../../components/common/StatCard";
import Greetings from "../../components/home/Greetings";
import WeekInspection from "../../components/home/WeekInspectServiceSection";
import WeekServicesSection from "../../components/home/WeekServicesSection";
import { ROUTES } from "../../helpers/routePaths";
import {
  useGetSupervisorStats,
  useGetSupServices,
} from "../../hooks/useBookingQuery";
import { useGetMyInspeServices } from "../../hooks/useInspectionServices";
import SupervisorHomeSkeleton from "../../skeltons/SupervisorHomeLoadingSkelton";
import { useSupServicesStore } from "../../store/useSupServicesStore";

const SupervisorHomePage = ({ userData }) => {
  // stats
  const { isLoading: fetchingStats } = useGetSupervisorStats();

  // loading flag
  const { isLoading: fetchingSupervisorServices } = useGetSupServices();
  const { isLoading: fetchingInspectionServices } = useGetMyInspeServices();

  const supStats = useSupServicesStore((s) => s.stats);

  if (fetchingStats || fetchingSupervisorServices || fetchingInspectionServices)
    return <SupervisorHomeSkeleton />;

  return (
    <IconoirProvider
      iconProps={{
        color: "#fff",
        strokeWidth: 3,
        width: 30,
        height: 30,
      }}
    >
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
            count={supStats?.previous}
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
            count={supStats?.assigned}
            icon={
              <MaterialCommunityIcons name="briefcase" size={22} color="#fff" />
            }
            variant="warning"
            onPress={() => router.push(ROUTES.SUPERVSOR_ASSIGNED_JOBS)}
          />
        </View>

        <View style={{ height: 24 }} />

        <WeekServicesSection />
        <WeekInspection />
      </View>
    </IconoirProvider>
  );
};

export default SupervisorHomePage;
