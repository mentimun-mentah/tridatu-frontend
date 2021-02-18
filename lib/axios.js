import axios from "axios";
import * as actions from "store/actions";
import { parseCookies } from "nookies";
import { notification, message } from "antd";

// For refresh
export const signature_exp = "Signature has expired";

// Need logout
const not_enough_seg = "Not enough segments";
const token_rvd = "Token has been revoked";
const signature_failed ="Signature verification failed";
const csrf_not_match = "CSRF double submit tokens do not match";
const invalid_alg = "The specified alg value is not allowed";
const invalid_header_str = "Invalid header string: 'utf-8' codec can't decode byte 0xab in position 22: invalid start byte";

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
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
      return Promise.reject(error);
    }

    if(status == 404){
      return error.response;
    }

    /*
     * Section when token is invalid and must be logout
     * TODO:
     * - Check for more condition
     */
    if(status == 401 && ((data.detail == token_rvd) || (data.detail == csrf_not_match) || (data.detail == invalid_alg))){
      instance.delete("/users/delete-cookies")
      store.dispatch(actions.logout());
    }
    if(status == 422 && ((data.detail == signature_failed) || (data.detail == not_enough_seg) || (data.detail == invalid_header_str))){
      instance.delete("/users/delete-cookies")
      store.dispatch(actions.logout());
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
        .then((res) => {
          if(res.data){
            const { csrf_access_token } = parseCookies();
            const needResolve = {
              ...error.config,
              headers: {
                ...error.config.headers,
                "X-CSRF-TOKEN": csrf_access_token,
              },
            }
            console.log("=== REFRESHED 🔫 ===", csrf_access_token)
            return instance.request(needResolve);
          } else {
            instance.delete("/users/delete-cookies")
            store.dispatch(actions.logout());
          }
        })
    }

    return Promise.reject(error);
  });
}


export const resNotification = (type, title, value) => (
  notification[type]({
    closeIcon: <i className="far fa-times" />,
    message: title,
    description: value,
    placement: "bottomRight",
  })
)

export const formErrorMessage = (msg) => (
  message.error({ 
    content: msg, 
    style: { marginTop: '10vh' },
  })
);

export default instance;
