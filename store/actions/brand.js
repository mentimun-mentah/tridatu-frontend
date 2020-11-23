import axios from "lib/axios";
import * as actionType from "./actionTypes";

const getBrandStart = () => {
  return { type: actionType.GET_BRAND_START };
};

export const getBrandSuccess = (brand) => {
  return {
    type: actionType.GET_BRAND_SUCCESS,
    brand: brand,
  };
};

const getBrandFail = (error) => {
  return {
    type: actionType.GET_BRAND_FAIL,
    error: error
  }
}

export const getBrand = () => {
  return dispatch => {
    dispatch(getBrandStart())
    axios.get("/brands/all-brands")
      .then(res => {
        dispatch(getBrandSuccess(res.data))
      })
      .catch(err => {
        dispatch(getBrandFail(err.response))
      })
  }
}
