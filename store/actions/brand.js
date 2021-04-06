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

export const getBrand = (q = "") => {
  let queryString = {}

  if(q !== "" && q !== undefined) queryString["q"] = q.q
  else delete queryString["q"]

  return dispatch => {
    dispatch(getBrandStart())
    axios.get("/brands/all-brands", { params: queryString })
      .then(res => {
        dispatch(getBrandSuccess(res.data))
      })
      .catch(err => {
        dispatch(getBrandFail(err.response))
      })
  }
}
