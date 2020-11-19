import axios, { signature_exp } from "lib/axios";
import * as actionType from "./actionTypes";

/*
 * GET ADDRESS ACTIONS
 */
export const getAddressStart = () => {
  return {
    type: actionType.GET_ADDRESS_START,
  };
};
export const getAddressSuccess = address => {
  return {
    type: actionType.GET_ADDRESS_SUCCESS,
    address: address,
  };
};
export const getAddressFail = error => {
  return {
    type: actionType.GET_ADDRESS_FAIL,
    error: error,
  };
};

export const getAddress = (per_page, page) => {
  return dispatch => {
    dispatch(getAddressStart())
    axios.get(`/address/my-address?per_page=${per_page}&page=${page}`)
      .then((res) => {
        dispatch(getAddressSuccess(res.data))
      })
      .catch((err) => {
        if(err.response.data.detail === signature_exp){
          axios.get(`/address/my-address?per_page=${per_page}&page=${page}`)
            .then(res => {
              dispatch(getAddressSuccess(res.data))
            })
            .catch(() => {})
        }
        else {
          axios.delete("/users/delete-cookies")
          dispatch(getAddressFail(err.response))
        }
      })
  }
}
