import * as actionType from "store/actions/actionTypes";
import { updateObject } from "lib/utility";

const initialState = {
  adminCollapsed: false,
  adminIsMobile: false
};

const getAdminCollapsed = (state, action) => {
  return updateObject(state, {
    adminCollapsed: action.adminCollapsed,
  });
};

const getAdminIsMobile = (state, action) => {
  return updateObject(state, {
    adminIsMobile: action.adminIsMobile,
  });
};

const reducer = (state = initialState, action) => {
  switch(action.type){
    case actionType.GET_ADMIN_COLLAPSED:
      return getAdminCollapsed(state, action)

    case actionType.GET_ADMIN_IS_MOBILE:
      return getAdminIsMobile(state, action)

    default:
      return state;
  }
}

export default reducer
