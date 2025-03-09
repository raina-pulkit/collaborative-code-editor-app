import { QueryClientProvider } from '@tanstack/react-query';
import { JSX, Suspense, useEffect } from 'react';
import { Route, Routes, useLocation, useNavigate } from 'react-router-dom';
import { ROUTES } from './constants/routes';
import { UserProvider } from './context/user-context';
import { LoadingPage } from './pages/loading-page';
import NotFound from './pages/not-found';
import { allRoutes, authRoutes, RouteDetails } from './routes';
import { queryClient } from './utils/tanstack-query-client';
import { useGetUserDetails } from './utils/use-get-user-details';
import { ErrorProvider, useError } from './context/error-context';
import { UNAUTHORIZED_ERROR } from './constants/error';

const AuthenticatedContainer = ({
  children,
}: {
  children: React.ReactNode;
}): JSX.Element => {
  const navigate = useNavigate();
  const location = useLocation();
  const { setErrorMessage } = useError();
  const { data: userDetails, error, isFetching } = useGetUserDetails();

  useEffect(() => {
    if (error?.message === UNAUTHORIZED_ERROR) {
      localStorage.removeItem('accessToken');
      setErrorMessage('');
      navigate(ROUTES.LOGIN);
    } else if (!error && !isFetching && location.pathname === ROUTES.LOGIN) {
      navigate(ROUTES.HOME);
    }
  }, [error, isFetching, location.pathname, navigate, setErrorMessage]);

  if (isFetching) return <LoadingPage message="Fetching user details" />;

  return (
    <UserProvider value={{ userDetails, isLoading: isFetching, error }}>
      {children}
    </UserProvider>
  );
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
      ? route.children.map(nestedRoute => renderRoute(nestedRoute))
      : null}
  </Route>
);

const App = (): JSX.Element => {
  return (
    <QueryClientProvider client={queryClient}>
      <ErrorProvider>
        <Suspense fallback={<LoadingPage message="Loading..." />}>
          <Routes>
            {authRoutes.map(route => (
              <Route
                key={route.path}
                path={route.path}
                element={<route.component />}
              />
            ))}

            <Route
              index
              key={'index'}
              element={<AuthenticatedComponent route={allRoutes[0]} />}
            />
            {allRoutes.map(route => renderRoute(route))}
            <Route
              path="*"
              element={
                <Suspense
                  fallback={
                    <LoadingPage size={20} message="Route not found!" />
                  }
                >
                  <NotFound />
                </Suspense>
              }
            />
          </Routes>
        </Suspense>
      </ErrorProvider>
    </QueryClientProvider>
  );
};

export default App;
