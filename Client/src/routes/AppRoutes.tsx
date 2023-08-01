import { Route, Routes } from "react-router-dom";
import GuardedRoute from "./GuardedRoute";

interface AppRoutesProp {
  /**
   * True, if the user is authenticated, false otherwise.
   */
  isAuthenticated: boolean;
}

const HOME_ROUTE = "/home";
const LOGIN_ROUTE = "/login";
const ABOUT_ROUTE = "/about";

function AppRoutes(props: AppRoutesProp) {
  const { isAuthenticated } = props;

  return (
    <Routes>
      <Route path={ABOUT_ROUTE} element={<p>About Page</p>} />

      <Route
        element={
          <GuardedRoute
            isRouteAccessible={!isAuthenticated}
            redirectRoute={HOME_ROUTE}
          />
        }
      >
        <Route path={LOGIN_ROUTE} element={<p>Login Page</p>} />
      </Route>

      <Route
        element={
          <GuardedRoute
            isRouteAccessible={isAuthenticated}
            redirectRoute={LOGIN_ROUTE}
          />
        }
      >
        <Route path={HOME_ROUTE} element={<p>Home Page</p>}></Route>
      </Route>
      <Route path="*" element={<p>Page Not Found</p>} />
    </Routes>
  );
}

export default AppRoutes;
