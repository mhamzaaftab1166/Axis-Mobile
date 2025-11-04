import { HttpStatusCode } from "axios";
import { Redirect } from "expo-router";
import LoadingOverlay from "./components/LoadingOverlay";
import { ROUTES } from "./helpers/routePaths";
import { useUserDetailQuery } from "./hooks/useAuthQuery";
import LoginScreen from "./screens/(auth)/Login";
import useAuthStore from "./store/useAuthStore";

export default function Index() {

  const { token } = useAuthStore();
  const { userData, isLoading, isError } = useUserDetailQuery();

  if (isLoading) {
    return <LoadingOverlay />;
  }

  // Case 1: no token
  if (!token) {
    return <Redirect href={ROUTES.LOGIN} />;
  }

  // Case 2: token invalid / expired
  if (isError) {
    return <Redirect href={ROUTES.LOGIN} />;
  }

  // Case 3: valid data → go home
  if (userData) {
    if(userData?.status === HttpStatusCode.Unauthorized){
      return <Redirect href={ROUTES.LOGIN} />;
    }
    return <Redirect href={ROUTES.HOME} />;
  }

  return <LoginScreen />;
}
