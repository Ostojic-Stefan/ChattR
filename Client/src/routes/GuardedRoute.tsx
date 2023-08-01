import { Navigate, Outlet } from "react-router-dom";

interface GuardedRouteProps {
  isRouteAccessible?: boolean;
  redirectRoute?: string;
}

export default function GuardedRoute({
  isRouteAccessible = false,
  redirectRoute = "/",
}: GuardedRouteProps) {
  return isRouteAccessible ? (
    <Outlet />
  ) : (
    <Navigate to={redirectRoute} replace />
  );
}
