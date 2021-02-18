import axios, { jsonHeaderHandler, signature_exp, resNotification } from "lib/axios";
import * as actionType from "./actionTypes";

const getDiscountStart = () => {
  return { type: actionType.GET_ALLDISCOUNT_START }
}

const getDiscountSuccess = (payload) => {
  return {
    type: actionType.GET_ALLDISCOUNT_SUCCESS,
    discounts: payload
  }
}

const getDiscountFail = (error) => {
  return {
    type: actionType.GET_ALLDISCOUNT_FAIL,
    error: error
  }
}


const nonActiveDiscountStart = () => {
  return { type: actionType.NON_ACTIVE_DISCOUNT_START }
}

const nonActiveDiscountSuccess = () => {
  return { type: actionType.NON_ACTIVE_DISCOUNT_SUCCESS }
}

const nonActiveDiscountFail = (error) => {
  return {
    type: actionType.NON_ACTIVE_DISCOUNT_FAIL,
    error: error
  }
}


export const getDiscount = ({ page = 1, per_page = 10, q, status }) => {
  let queryString = {}
  if(page) queryString["page"] = page
  if(per_page) queryString["per_page"] = per_page

  if(q !== "" && q !== undefined) queryString["q"] = q
  else delete queryString["q"]

  if(status !== "") queryString["status"] = status
  else delete queryString["status"]

  return dispatch => {
    dispatch(getDiscountStart())
    axios.get(`/discounts/all-discounts`, { params: queryString })
      .then(res => {
        dispatch(getDiscountSuccess(res.data))
      })
      .catch(err => {
        if(err.response.data.detail === signature_exp){
          axios.get(`/discounts/all-discounts`, { params: queryString })
            .then(res => {
              dispatch(getDiscountSuccess(res.data))
            })
            .catch(() => {})
        }
        else {
          dispatch(getDiscountFail(err.response))
        }
      })
  }
}


export const nonActiveDiscount = (id, router) => {
  return dispatch => {
    dispatch(nonActiveDiscountStart())
    axios.delete(`/discounts/non-active/${id}`, jsonHeaderHandler())
      .then(res => {
        const resDetail = res.data.detail
        const notFound = "Product not found!"

        if(resDetail === notFound){
          resNotification("error", "Error", resDetail)
          dispatch(nonActiveDiscountFail(resDetail))
        } else {
          resNotification("success", "Success", resDetail)
          dispatch(getDiscount({ ...router }))
          dispatch(nonActiveDiscountSuccess())
        }
      })
      .catch(err => {
        const errDetail = err.response.data.detail;
        if(errDetail == signature_exp){
          resNotification("success", "Success", "Successfully unset discount on the product.")
          dispatch(getDiscount({ ...router }))
        } else {
          if(typeof(errDetail) === "string" && errDetail !== signature_exp) {
            resNotification("error", "Error", errDetail)
            dispatch(nonActiveDiscountFail(errDetail))
          }
        }
      })
  }
}
