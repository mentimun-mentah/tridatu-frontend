import axios from "lib/axios";
import * as actionType from "./actionTypes";

const getOutletStart = () => {
  return { type: actionType.GET_OUTLET_START };
};

export const getOutletSuccess = (outlet) => {
  return {
    type: actionType.GET_OUTLET_SUCCESS,
    outlet: outlet,
  };
};

const getOutletFail = (error) => {
  return {
    type: actionType.GET_OUTLET_FAIL,
    error: error
  }
}

export const getOutlet = () => {
  return dispatch => {
    dispatch(getOutletStart())
    axios.get("/outlets/all-outlets")
      .then(res => {
        dispatch(getOutletSuccess(res.data))
      })
      .catch(err => {
        dispatch(getOutletFail(err.response))
      })
  }
}
