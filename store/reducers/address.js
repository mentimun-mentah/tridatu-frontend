import * as actionType from "store/actions/actionTypes";
import { updateObject } from "lib/utility";

const initialState = {
  address: null,
  error: null,
  loading: false
};

const getAddressStart = (state, _) => {
  return updateObject(state, {
    error: null,
    loading: true
  });
};

const getAddressSuccess = (state, action) => {
  return updateObject(state, {
    address: action.address,
    loading: false
  });
};

const getAddressFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false
  });
};

const reducer = (state = initialState, action) => {
  switch(action.type){
    case actionType.GET_ADDRESS_START:
      return getAddressStart(state, action)
    case actionType.GET_ADDRESS_SUCCESS:
      return getAddressSuccess(state, action)
    case actionType.GET_ADDRESS_FAIL:
      return getAddressFail(state, action)

    default:
      return state;
  }
}

export default reducer
