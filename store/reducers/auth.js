import * as actionType from "store/actions/actionTypes";
import { updateObject } from "lib/utility";

const initialState = {
  user: null,
  error: null,
  wishlist: []
};

/*
 * GET USER
 */
const getUserStart = (state, _) => {
  return updateObject(state, {
    error: null,
  });
};

const getUserSuccess = (state, action) => {
  return updateObject(state, {
    user: action.user,
  });
};

const getUserFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
  });
};

/*
 * AUTH
 */
const authLogout = (state, _) => {
  return updateObject(state, initialState);
};


/*
 * GET WISHLIST
 */
const getWishlistStart = (state, _) => {
  return updateObject(state, {
    error: null,
    loading: true
  });
}

const getWishlistSuccess = (state, action) => {
  return updateObject(state, {
    wishlist: action.wishlist,
    loading: false
  });
}

const getWishlistFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false
  });
}

const reducer = (state = initialState, action) => {
  switch (action.type) {
    /* GET USER */
    case actionType.GET_USER_START:
      return getUserStart(state, action);
    case actionType.GET_USER_SUCCESS:
      return getUserSuccess(state, action);
    case actionType.GET_USER_FAIL:
      return getUserFail(state, action);

    /* GET WISHLIST */
    case actionType.GET_WISHLIST_START:
      return getWishlistStart(state, action)
    case actionType.GET_WISHLIST_SUCCESS:
      return getWishlistSuccess(state, action)
    case actionType.GET_WISHLIST_FAIL:
      return getWishlistFail(state, action)

    /* LOGOUT */
    case actionType.AUTH_LOGOUT:
      return authLogout(state, action);

    default:
      return state;
  }
};

export default reducer;
