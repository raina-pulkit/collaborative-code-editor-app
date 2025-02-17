import { JSX, Suspense, useEffect } from "react";
import { allRoutes, authRoutes, RouteDetails } from "./routes";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";
import NotFound from "./pages/not-found";

const AuthenticatedContainer = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken && location.pathname !== "/login") navigate("/login");
    else if (accessToken && location.pathname === "/login") navigate("/");
  }, [navigate, location.pathname]);

  return <>{children}</>;
};

const AuthenticatedComponent = ({
  route,
}: {
  route: RouteDetails;
}): JSX.Element => (
  <AuthenticatedContainer>
    <route.component />
  </AuthenticatedContainer>
);

const renderRoute = (route: RouteDetails): JSX.Element => (
  <Route
    key={route.path}
    path={route.path}
    element={<AuthenticatedComponent route={route} />}
  >
    {route.children.length > 0
      ? route.children.map((nestedRoute) => renderRoute(nestedRoute))
      : null}
  </Route>
);

const App = (): JSX.Element => {
  return (
    <AuthenticatedContainer>
      <Suspense fallback={<CircularProgress />}>
        <Routes>
          {authRoutes.map((route) => (
            <Route
              key={route.path}
              path={route.path}
              element={<route.component />}
            />
          ))}
          <Route
            index
            key={"index"}
            element={<AuthenticatedComponent route={allRoutes[0]} />}
          />
          {allRoutes.map((route) => renderRoute(route))}
          <Route
            path="*"
            element={
              <Suspense fallback={<CircularProgress size={16} />}>
                <NotFound />
              </Suspense>
            }
          />
        </Routes>
      </Suspense>
    </AuthenticatedContainer>
  );
};

export default App;
