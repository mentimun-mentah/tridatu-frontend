import * as actionType from "store/actions/actionTypes";
import { updateObject } from "lib/utility";

const initialState = {
  discounts: {
    data: []
  },
  loading: false,
  error: null
}

const getDiscountStart = (state, _) => {
  return updateObject(state, {
    error: null,
    loading: true
  })
}

const getDiscountSuccess = (state, action) => {
  return updateObject(state, {
    discounts: action.discounts,
    loading: false
  })
}

const getDiscountFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false
  })
}


// not use yet
const nonActiveDiscountStart = (state, _) => {
  return updateObject(state, {
    error: null,
    loading: true
  })
}

const nonActiveDiscountSuccess = (state, _) => {
  return updateObject(state, {
    loading: false
  })
}

const nonActiveDiscountFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false
  })
}

const reducer = (state = initialState, action) => {
  switch(action.type){
    case actionType.GET_ALLDISCOUNT_START:
      return getDiscountStart(state, action)
    case actionType.GET_ALLDISCOUNT_SUCCESS:
      return getDiscountSuccess(state, action)
    case actionType.GET_ALLDISCOUNT_FAIL:
      return getDiscountFail(state, action)


    // not use yet
    case actionType.NON_ACTIVE_DISCOUNT_START:
      return nonActiveDiscountStart(state, action)
    case actionType.NON_ACTIVE_DISCOUNT_SUCCESS:
      return nonActiveDiscountSuccess(state, action)
    case actionType.NON_ACTIVE_DISCOUNT_FAIL:
      return nonActiveDiscountFail(state, action)

    default:
      return state
  }
}

export default reducer
