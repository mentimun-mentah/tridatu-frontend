import { message } from 'antd'
import axios, { jsonHeaderHandler, signature_exp, resNotification } from "lib/axios";
import * as actionType from "./actionTypes";

const searchPromoNameStart = () => {
  return { type: actionType.SEARCH_PROMO_NAME_START }
}

const searchPromoNameSuccess = payload => {
  return {
    type: actionType.SEARCH_PROMO_NAME_SUCCESS,
    payload: payload
  }
}

const searchPromoNameFail = (error) => {
  return {
    type: actionType.SEARCH_PROMO_NAME_FAIL,
    error: error
  }
}

const getPromoStart = () => {
  return { type: actionType.GET_PROMO_START }
}

const getPromoSuccess = (payload) => {
  return { 
    type: actionType.GET_PROMO_SUCCESS,
    payload: payload
  }
}

const getPromoFail = (error) => {
  return { 
    type: actionType.GET_PROMO_FAIL,
    error: error
  }
}

export const getPromos = ({
  page = 1, per_page = 10, q, status
}) => {

  let queryString = {}
  if(page) queryString["page"] = page
  if(per_page) queryString["per_page"] = per_page

  if(q !== "" && q !== undefined) queryString["q"] = q
  else delete queryString["q"]

  if(status) queryString["status"] = status
  else delete queryString["status"]

  return dispatch => {
    dispatch(getPromoStart())
    axios.get('/promos/all-promos', { params: queryString })
      .then(res => {
        dispatch(getPromoSuccess(res.data))
      })
      .catch(err => {
        if(err.response.data.detail === signature_exp){
          axios.get('/promos/all-promos', { params: queryString })
            .then(res => {
              dispatch(getPromoSuccess(res.data))
            })
            .catch(() => {})
        }
        else{
          dispatch(getPromoFail(err.response))
        }
      })
  }
}


export const searchPromoName = ({ q, limit = 10 }) => {
  let queryString = { q: q, limit: limit }

  return dispatch => {
    dispatch(searchPromoNameStart())
    axios.get('/promos/search-by-name', { params: queryString })
      .then(res => {
        dispatch(searchPromoNameSuccess(res.data))
      })
      .catch(err => {
        dispatch(searchPromoNameSuccess([]))
        dispatch(searchPromoNameFail(err.response))
      })
  }
}
