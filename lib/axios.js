import getConfig from "next/config";
import axios from "axios";
import * as actions from "store/actions";
import { parseCookies } from "nookies";

// For refresh
const signature_exp = "Signature has expired";

// Need logout
const not_enough_seg = "Not enough segments";
const token_rvd = "Token has been revoked";
const signature_failed ="Signature verification failed";
const csrf_not_match = "CSRF double submit tokens do not match";
const invalid_alg = "The specified alg value is not allowed";
const invalid_header_str = "Invalid header string: 'utf-8' codec can't decode byte 0xab in position 22: invalid start byte";

const { serverRuntimeConfig, publicRuntimeConfig } = getConfig();
const API_URL = serverRuntimeConfig.API_URL || publicRuntimeConfig.API_URL;

const instance = axios.create({
  baseURL: API_URL,
  withCredentials: true,
});

export const jsonHeaderHandler = () => {
  let headerConfig = {};
  const cookies = parseCookies();
  const { csrf_access_token } = cookies;
  headerConfig = {
    headers: {
      "X-CSRF-TOKEN": csrf_access_token,
    },
  };

  return headerConfig;
};

export const formHeaderHandler = () => {
  let headerConfig = {};
  const cookies = parseCookies();
  const { csrf_access_token } = cookies;
  headerConfig = {
    headers: {
      "X-CSRF-TOKEN": csrf_access_token,
      "content-type": "multipart/form-data",
    },
  };

  return headerConfig;
};

export const refreshHeader = () => {
  let headerConfig = {};
  const cookies = parseCookies();
  const { csrf_refresh_token } = cookies;
  headerConfig = {
    headers: {
      "X-CSRF-TOKEN": csrf_refresh_token,
    },
  };

  return headerConfig;
};

instance.interceptors.request.use((config) => {
    // Do something before request is sent
    return config;
  },
  function (error) {
    // Do something with request error
    return Promise.reject(error);
  }
);

export const installInterceptors = (store) => {
  instance.interceptors.response.use((response) => {
    return response;
  }, async error => {
    const cookies = parseCookies();
    const { csrf_refresh_token } = cookies;

    console.log("error axios lib => ", error.response)
    const { status, data, config } = error.response;

    /*
     * This section will run if the refresh token has been expired
     * and delete all cookies
     * TODO:
     * - Check for more condition
    */
    if(status == 422 && data.detail == signature_exp && csrf_refresh_token && config.url === "/users/refresh-token"){
      instance.delete("/users/delete-cookies")
      store.dispatch(actions.logout());
      console.log("422 REFRESH === TOKEN DELETED ===")
      return Promise.reject(error);
    }

    /*
     * Section when token is invalid and must be logout
     * TODO:
     * - Check for more condition
     */
    if(status == 401 && ((data.detail == token_rvd) || (data.detail == csrf_not_match) || (data.detail == invalid_alg))){
      instance.delete("/users/delete-cookies")
      store.dispatch(actions.logout());
      console.log("401 === TOKEN DELETED ===")
    }
    if(status == 422 && ((data.detail == signature_failed) || (data.detail == not_enough_seg) || (data.detail == invalid_header_str))){
      instance.delete("/users/delete-cookies")
      store.dispatch(actions.logout());
      console.log("422 === TOKEN DELETED ===")
    }

    /*
     * Section when token is expired and must be refreshed
     * DO:
     * - resolve request after token expired
     * - passed in update password
     *
     * TODO:
     * - Check for more condition
     */
    if(status == 422 && data.detail == signature_exp && csrf_refresh_token){
      await instance.post("/users/refresh-token", null, refreshHeader())
        .then(() => {
          const { csrf_access_token } = parseCookies();
          let needResolve = {
            ...error.config,
            headers: {
              ...error.config.headers,
              "X-CSRF-TOKEN": csrf_access_token,
            },
          }
          console.log("=== TOKEN REFRESHED 🔫 ===")
          return instance.request(needResolve);
        })
    }

    return Promise.reject(error);
  });
}

export default instance;
