import moment from 'moment'
import isIn from 'validator/lib/isIn'
import { not_active, will_come, ongoing, have_ended } from 'components/Card/Admin/Product/Promo/statusType'

export const initialValue = {value: "", isValid: true, message: null};

export const formPeriod = { 
  start: { ...initialValue }, 
  end: { ...initialValue } 
}

export const formPeriodIsValid = (state, setState, discountStatus, products_discount_start) => {
  const start = { ...state.start }
  const end = { ...state.end }
  let isGood = true

  if(start.value === "" || end.value === ""){
    isGood = false
    start.isValid = false
    start.message = "Periode promo tidak boleh kosong"
  }
  if(moment(end.value).diff(moment(start.value), "days") >= 180){
    isGood = false
    start.isValid = false
    start.message = "Periode Promo harus kurang dari 180 hari"
  }
  if(isIn(will_come, [discountStatus]) && moment(start.value) < moment(products_discount_start)){
    isGood = false
    start.isValid = false
    start.message = "Waktu mulai yang baru harus setelah waktu mulai yang sebelumnya diatur"
  }
  if(!isIn(ongoing, [discountStatus]) && moment(start.value) < moment()){
    isGood = false
    start.isValid = false
    start.message = "Waktu mulai harus setelah waktu saat ini"
  }
  if(moment(end.value).format("L") === moment(start.value).format("L") && moment(end.value).subtract(1, "hour") < moment(start.value)){
    isGood = false
    start.isValid = false
    start.message = "Waktu berakhir minimal satu jam lebih lama dari waktu mulai"
  }

  if(!isGood) setState({ ...state, start, end })

  return isGood
}

export const formTablePromoIsValid = (state, setState, idx) => {
  const newState = [...state]
  let isGood = true

  let normalPriceValue = newState[idx]["product"]["normal_price"]
  let priceValue = newState[idx]["product"]["price"].value
  let discountValue = newState[idx]["product"]["discount"].value
  let activeValue = newState[idx]["product"]["discount_active"].value

  if(priceValue < (normalPriceValue - (normalPriceValue * (95/100)))){
    isGood = false
    newState[idx]["product"]["price"].isValid = false
    newState[idx]["product"]["price"].message = "Harga promo kurang dari 95% harga awal"
  }
  if(priceValue > normalPriceValue){
    isGood = false
    newState[idx]["product"]["price"].isValid = false
    newState[idx]["product"]["price"].message = "Harga tidak valid"
  }

  if(discountValue > 95){
    isGood = false
    newState[idx]["product"]["discount"].isValid = false
    newState[idx]["product"]["discount"].message = "Diskon masksimal 95%"
  }
  if(activeValue && discountValue <= 0){
    isGood = false
    newState[idx]["product"]["discount"].isValid = false
    newState[idx]["product"]["discount"].message = "Diskon minimal 1%"
  }
  if(!activeValue && discountValue < 0 && discountValue >= 95){
    isGood = false
    newState[idx]["product"]["discount"].isValid = false
    newState[idx]["product"]["discount"].message = "Diskon tidak valid"
  }

  if(!isGood) setState(newState)

  return isGood
}
