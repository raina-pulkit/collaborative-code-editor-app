import { JSX, Suspense, useEffect } from "react";
import { allRoutes, authRoutes, RouteDetails } from "./routes";
import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import NotFound from "./pages/not-found";
import { LoadingPage } from "./pages/loading-page";
import { QueryClientProvider } from "@tanstack/react-query";
import { queryClient } from "./utils/tanstack-query-client";
import { ROUTES } from "./constants/routes";

const AuthenticatedContainer = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const accessToken = localStorage.getItem("accessToken");

    if (
      !accessToken &&
      location.pathname !== ROUTES.LOGIN &&
      location.pathname !== ROUTES.LOGIN_CALLBACK
    )
      navigate(ROUTES.LOGIN);
    else if (accessToken && location.pathname === ROUTES.LOGIN)
      navigate(ROUTES.HOME);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

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
      <QueryClientProvider client={queryClient}>
        <Suspense fallback={<LoadingPage />}>
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
                <Suspense fallback={<LoadingPage size={20} />}>
                  <NotFound />
                </Suspense>
              }
            />
          </Routes>
        </Suspense>
      </QueryClientProvider>
    </AuthenticatedContainer>
  );
};

export default App;
