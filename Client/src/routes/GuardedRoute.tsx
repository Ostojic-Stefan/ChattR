import { Navigate, Outlet } from "react-router-dom";

interface GuardedRouteProps {
  isAccessible: boolean;
  redirectRoute: string;
}

export default function GuardedRoute({
  isAccessible,
  redirectRoute,
}: GuardedRouteProps) {
  if (isAccessible) return <Navigate to={redirectRoute} />;
  return <Outlet />;
}
