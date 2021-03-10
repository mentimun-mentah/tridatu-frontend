import moment from 'moment'
import isIn from 'validator/lib/isIn'
import { will_come, ongoing } from 'components/Card/Admin/Product/Promo/statusType'

export const initialValue = {value: "", isValid: true, message: null};

export const formPeriod = { 
  start: { ...initialValue }, 
  end: { ...initialValue } 
}

export const formPeriodIsValid = (state, setState, discountStatus, products_discount_start, t) => {
  const start = { ...state.start }
  const end = { ...state.end }
  let isGood = true

  if(start.value === "" || end.value === ""){
    isGood = false
    start.isValid = false
    start.message = t.validation.empty
  }
  if(moment(end.value).diff(moment(start.value), "days") >= 180){
    isGood = false
    start.isValid = false
    start.message = t.modal.periode_note
  }
  if(isIn(will_come, [discountStatus]) && moment(start.value) < moment(products_discount_start)){
    isGood = false
    start.isValid = false
    start.message = t.validation.err_start_time
  }
  if(!isIn(ongoing, [discountStatus]) && moment(start.value) < moment()){
    isGood = false
    start.isValid = false
    start.message = t.validation.err_current_start_time
  }
  if(moment(end.value).format("L") === moment(start.value).format("L") && moment(end.value).subtract(1, "hour") < moment(start.value)){
    isGood = false
    start.isValid = false
    start.message = t.validation.err_end_time
  }

  if(!isGood) setState({ ...state, start, end })

  return isGood
}

export const formTablePromoIsValid = (state, setState, idx, t) => {
  const newState = [...state]
  let isGood = true

  let normalPriceValue = newState[idx]["product"]["normal_price"]
  let priceValue = newState[idx]["product"]["price"].value
  let discountValue = newState[idx]["product"]["discount"].value
  let activeValue = newState[idx]["product"]["discount_active"].value

  if(priceValue < (normalPriceValue - (normalPriceValue * (95/100)))){
    isGood = false
    newState[idx]["product"]["price"].isValid = false
    newState[idx]["product"]["price"].message = t.validation.err_price_morethan_95
  }
  if(priceValue > normalPriceValue){
    isGood = false
    newState[idx]["product"]["price"].isValid = false
    newState[idx]["product"]["price"].message = t.validation.invalid_price
  }

  if(discountValue > 95){
    isGood = false
    newState[idx]["product"]["discount"].isValid = false
    newState[idx]["product"]["discount"].message = t.validation.max_discount
  }
  if(activeValue && discountValue <= 0){
    isGood = false
    newState[idx]["product"]["discount"].isValid = false
    newState[idx]["product"]["discount"].message = t.validation.min_discount
  }
  if(!activeValue && discountValue < 0 && discountValue >= 95){
    isGood = false
    newState[idx]["product"]["discount"].isValid = false
    newState[idx]["product"]["discount"].message = t.validation.invalid_discount
  }

  if(!isGood) setState(newState)

  return isGood
}
