export enum RouteList {
  LOGIN = "/login",
  HOME = "/",
  DONATION_PROGRAM = "/donation-program",
  USER_MONITORING = "/user-monitoring",
}

export const ProtectedRouteList = [
  RouteList.HOME,
  RouteList.DONATION_PROGRAM,
  RouteList.USER_MONITORING,
];
export const PublicRouteList = [RouteList.LOGIN];
