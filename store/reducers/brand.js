import * as actionType from "store/actions/actionTypes";
import { updateObject } from "lib/utility";

const initialState = {
  brand: [],
  loading: false,
  error: null,
};

const getBrandStart = (state, _) => {
  return updateObject(state, {
    error: null,
    loading: true,
  });
};

const getBrandSuccess = (state, action) => {
  return updateObject(state, {
    brand: action.brand,
    loading: false,
  });
};

const getBrandFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false,
  });
};

const reducer = (state = initialState, action) => {
  switch(action.type){
    case actionType.GET_BRAND_START:
      return getBrandStart(state, action)
    case actionType.GET_BRAND_SUCCESS:
      return getBrandSuccess(state, action)
    case actionType.GET_BRAND_FAIL:
      return getBrandFail(state, action)

    default:
      return state
  }
}

export default reducer
