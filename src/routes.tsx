import { JSX, lazy, LazyExoticComponent } from 'react';
import { NESTED_ROUTES, ROUTES } from './constants/routes';
// import DrawingCanvas from './pages/demo';

const LoginPage = lazy(() => import('./pages/login-page'));
const NotFound = lazy(() => import('./pages/not-found'));
const HomePage = lazy(() => import('./pages/home-page'));
const CallbackPage = lazy(() => import('./pages/login-callback-page'));
const AboutPage = lazy(() => import('./pages/about-page'));
const ProfilePage = lazy(() => import('./pages/profile-page'));
const ErrorPage = lazy(() => import('./pages/error-page'));
const EditorPage = lazy(() => import('./pages/editor-page'));
const DrawingCanvas = lazy(() => import('./pages/demo'));

export interface RouteDetails {
  path: string;
  label?: string;
  icon?: {
    svg?: LazyExoticComponent<() => JSX.Element> | (() => JSX.Element);
    children: RouteDetails[];
  };
  component: LazyExoticComponent<() => JSX.Element> | (() => JSX.Element);
  children: RouteDetails[];
}

export const authRoutes: RouteDetails[] = [
  {
    path: ROUTES.LOGIN,
    component: LoginPage,
    children: [],
  },
  {
    path: ROUTES.LOGIN_CALLBACK,
    component: CallbackPage,
    children: [],
  },
];

export const homeRoutes: RouteDetails[] = [
  {
    path: ROUTES.HOME,
    component: HomePage,
    children: [],
  },
  {
    path: ROUTES.PROFILE,
    component: ProfilePage,
    children: [],
  },
  {
    path: ROUTES.ABOUT,
    component: AboutPage,
    children: [],
  },
  {
    path: ROUTES.ERROR,
    component: ErrorPage,
    children: [],
  },
  {
    path: NESTED_ROUTES.EDITOR,
    component: EditorPage,
    children: [],
  },
  {
    path: ROUTES.DEMO,
    component: DrawingCanvas,
    children: [],
  },
];

export const otherRoutes: RouteDetails[] = [
  {
    path: ROUTES.OTHER,
    component: NotFound,
    children: [],
  },
];

export const allRoutes = [...homeRoutes, ...otherRoutes];
