import { message } from 'antd'
import axios from "lib/axios";
import * as actionType from "./actionTypes";

message.config({ maxCount: 1 });

const searchCityDistrictStart = () => {
  return { type: actionType.SEARCH_CITY_DISTRICT_START }
}

const searchCityDistrictSuccess = (payload) => {
  return { 
    type: actionType.SEARCH_CITY_DISTRICT_SUCCESS,
    payload: payload
  }
}

const searchCityDistrictFail = (error) => {
  return {
    type: actionType.SEARCH_CITY_DISTRICT_FAIL,
    error: error
  }
}


const getShippingCostStart = () => {
  return { type: actionType.GET_SHIPPING_COST_START }
}

const getShippingCostSuccess = (payload) => {
  return {
    type: actionType.GET_SHIPPING_COST_SUCCESS,
    payload: payload
  }
}

const getShippingCostFail = (error) => {
  return {
    type: actionType.GET_SHIPPING_COST_FAIL,
    error: error
  }
}


export const searchCityDistrict = ({q, limit = 100}) => {
  return dispatch => {
    dispatch(searchCityDistrictStart())
    axios.get('/shipping/search/city-or-district', { params: {q: q, limit: limit} })
      .then(res => {
        let finalData = []
        for(let [key, val] of Object.entries(res.data)){
          finalData.push({key: key, ...val})
        }
        dispatch(searchCityDistrictSuccess(finalData))
      })
      .catch(err => {
        dispatch(searchCityDistrictFail(err.response))
      })
  }
}

export const getShippingCost = ({ 
  origin = 114, /*114 -> Kota Denpasar, Denpasar Selatan*/
  originType = 'city', 
  destination, 
  destinationType = 'subdistrict', 
  weight, 
  courier = 'jne:jet:pos:lion:tiki' 
}) => {

  const data = {
    origin: origin, 
    originType: originType, 
    destination: destination, 
    destinationType: destinationType, 
    weight: weight, 
    courier: courier
  }

  return dispatch => {
    dispatch(getShippingCostStart())
    axios.post('/shipping/get-cost', data)
      .then(res => {
        console.log(res.data)
        dispatch(getShippingCostSuccess(res.data))
      })
      .catch(err => {
        dispatch(getShippingCostFail(err.response))
      })
  }
}
