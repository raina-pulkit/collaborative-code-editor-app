import { JSX, lazy, LazyExoticComponent } from "react";
import { ROUTES } from "./constants/routes";

const LoginPage = lazy(() => import("./pages/login-page"));
const NotFound = lazy(() => import("./pages/not-found"));
const HomePage = lazy(() => import("./pages/home-page"));

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
];

export const homeRoutes: RouteDetails[] = [
  {
    path: ROUTES.HOME,
    component: HomePage,
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
