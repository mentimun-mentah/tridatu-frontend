import * as actionType from "store/actions/actionTypes";
import { updateObject } from "lib/utility";

const initialState = {
  outlet: [],
  loading: false,
  error: null,
};

const getOutletStart = (state, _) => {
  return updateObject(state, {
    error: null,
    loading: true,
  });
};

const getOutletSuccess = (state, action) => {
  return updateObject(state, {
    outlet: action.outlet,
    loading: false,
  });
};

const getOutletFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false,
  });
};

const reducer = (state = initialState, action) => {
  switch(action.type){
    case actionType.GET_OUTLET_START:
      return getOutletStart(state, action)
    case actionType.GET_OUTLET_SUCCESS:
      return getOutletSuccess(state, action)
    case actionType.GET_OUTLET_FAIL:
      return getOutletFail(state, action)

    default:
      return state
  }
}

export default reducer
