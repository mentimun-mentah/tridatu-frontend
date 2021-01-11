import axios, { signature_exp } from "lib/axios";
import * as actionType from "./actionTypes";

export const getAdminCollapsed = adminCollapsed => {
  return {
    type: actionType.GET_ADMIN_COLLAPSED,
    adminCollapsed: adminCollapsed
  };
};

export const getAdminIsMobile = isMobile => {
  return {
    type: actionType.GET_ADMIN_IS_MOBILE,
    adminIsMobile: isMobile
  };
};

