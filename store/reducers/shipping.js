import * as actionType from "store/actions/actionTypes";
import { updateObject } from "lib/utility";

const initialState = {
  listLocation: [],
  shippingCosts: {
    origin_detail: "",
    destination_detail: "",
    min_cost: 0,
    max_cost: 0,
    costs_shipping: []
  },
  loading: false,
  error: null,
};

const searchCityDistrictStart = (state, _) => {
  return updateObject(state, {
    error: null,
    loading: false
  });
}

const searchCityDistrictSuccess = (state, action) => {
  return updateObject(state, {
    listLocation: action.payload,
    loading: false
  });
}

const searchCityDistrictFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false
  });
}


const getShippingCostStart = (state, _) => {
  return updateObject(state, {
    error: null,
    loading: true
  });
}

const getShippingCostSuccess = (state, action) => {
  return updateObject(state, {
    shippingCosts: action.payload,
    loading: false
  });
}

const getShippingCostFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false
  });
}


const reducer = (state = initialState, action) => {
  switch(action.type){
    case actionType.SEARCH_CITY_DISTRICT_START:
      return searchCityDistrictStart(state, action)
    case actionType.SEARCH_CITY_DISTRICT_SUCCESS:
      return searchCityDistrictSuccess(state, action)
    case actionType.SEARCH_CITY_DISTRICT_FAIL:
      return searchCityDistrictFail(state, action)

    case actionType.GET_SHIPPING_COST_START:
      return getShippingCostStart(state, action)
    case actionType.GET_SHIPPING_COST_SUCCESS:
      return getShippingCostSuccess(state, action)
    case actionType.GET_SHIPPING_COST_FAIL:
      return getShippingCostFail(state, action)

    default:
      return state;
  }
}

export default reducer
