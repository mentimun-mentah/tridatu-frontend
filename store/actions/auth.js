import nookies from "nookies";
import axios, { jsonHeaderHandler, refreshHeader, signature_exp } from "lib/axios";
import * as actionType from "./actionTypes";
import Router from "next/router";

/*
 * LOGOUT
 */
const authLogout = () => {
  return {
    type: actionType.AUTH_LOGOUT,
  };
};

/*
 * GET USER ACTIONS
 */
const getUserStart = () => {
  return {
    type: actionType.GET_USER_START,
  };
};
const getUserSuccess = (user) => {
  return {
    type: actionType.GET_USER_SUCCESS,
    user: user,
  };
};
const getUserFail = (error) => {
  return {
    type: actionType.GET_USER_FAIL,
    error: error,
  };
};


/*
 * GET WISHLIST USER
 */
const getWishlistStart = () => {
  return { type: actionType.GET_WISHLIST_START }
}
const getWishlistSuccess = (wishlist) => {
  return { 
    type: actionType.GET_WISHLIST_SUCCESS,
    wishlist: wishlist 
  }
}
const getWishlistFail = (error) => {
  return {
    type: actionType.GET_WISHLIST_FAIL,
    error: error
  }
}

/*
 * GET USER FUNCTION
 */
export const getUser = () => {
  return (dispatch) => {
    dispatch(getUserStart());
    axios.get("/users/my-user")
      .then(res => {
        if(res.data){
          dispatch(getUserSuccess(res.data))
        }
        else {
          dispatch(logout())
          dispatch(getUserFail())
          axios.delete("/users/delete-cookies")
        }
      })
      .catch(err => {
        if(err.response.data.detail === signature_exp){
          axios.get("/users/my-user")
            .then(res => {
              dispatch(getUserSuccess(res.data))
            })
            .catch(() => {
              dispatch(logout())
              dispatch(getUserFail())
              axios.delete("/users/delete-cookies")
            })
        }
        else {
          axios.delete("/users/delete-cookies")
          dispatch(getUserFail(err.response))
        }
      })
  };
};

/*
 * CHECK USER IS LOGIN OR NOT
 */
export const authCheckState = (ctx) => {
  return (dispatch) => {
    const cookies = nookies.get(ctx);
    const { csrf_access_token, csrf_refresh_token } = cookies;
    if (csrf_access_token && csrf_refresh_token) {
      if(ctx.req) axios.defaults.headers.get.Cookie = ctx.req.headers.cookie;
      dispatch(getUser()); // when csrf_access_token && csrf_refresh_token is true it will get the user data
    } else {
      axios.delete("/users/delete-cookies")
      dispatch(authLogout())
    }
  };
};

/*
 * LOGOUT FUNCTION
 */
export const logout = () => {
  return (dispatch) => {
    const cookies = nookies.get();
    const { csrf_access_token, csrf_refresh_token } = cookies;

    const access_revoke = "/users/access-revoke";
    const refresh_revoke = "/users/refresh-revoke";

    if (csrf_access_token && csrf_refresh_token) {

      let headerAccessConfig = { headers: { "X-CSRF-TOKEN": csrf_access_token, } };
      let headerRefreshConfig = { headers: { "X-CSRF-TOKEN": csrf_refresh_token, } };

      const req_access_revoke = axios.delete(access_revoke, headerAccessConfig);
      const req_refresh_revoke = axios.delete(refresh_revoke, headerRefreshConfig);

      return Promise.all([req_access_revoke, req_refresh_revoke])
        .then(() => {
          axios.delete("/users/delete-cookies")
        })
        .catch(() => {
          axios.delete("/users/delete-cookies")
          Promise.reject([req_access_revoke, req_refresh_revoke])
        })
        .then(() => {
          axios.delete("/users/delete-cookies")
          dispatch(authLogout())
          process.browser && Router.reload()
        })
    } 
    else {
      if(csrf_access_token){
        axios.delete(access_revoke, jsonHeaderHandler())
      }
      else if(csrf_refresh_token){
        axios.delete(refresh_revoke, refreshHeader())
      }
      axios.delete("/users/delete-cookies")
      dispatch(authLogout())
      process.browser && Router.reload()
    }
  };
};

/*
 * GET WISHLIST FUNCTION
 */
export const getWishlist = ({ page = 1, per_page = 10, q, order_by }) => {
  let queryString = {}
  if(page) queryString["page"] = page
  if(per_page) queryString["per_page"] = per_page

  if(q !== "" && q !== undefined) queryString["q"] = q
  else delete queryString["q"]

  if(order_by !== "") queryString["order_by"] = order_by
  else delete queryString["order_by"]

  return dispatch => {
    dispatch(getWishlistStart())
    axios.get(`/wishlists/user`, { params: queryString })
      .then(res => {
        dispatch(getWishlistSuccess(res.data))
      })
      .catch(err => {
        if(err && err.response && err.response.data.detail === signature_exp){
          axios.get(`/wishlists/user`, { params: queryString })
            .then(res => {
              dispatch(getWishlistSuccess(res.data))
            })
            .catch(() => {})
        }
        else {
          dispatch(getWishlistFail(err.response))
        }
      })
  }
}
