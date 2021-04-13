import isEmpty from 'validator/lib/isEmpty'

export const formPromo = {
  name: { value: "", isValid: true, message: null },
  desc: { value: "", isValid: true, message: null },
  seen: { value: true, isValid: true, message: null },
  period_start: { value: "", isValid: true, message: null },
  period_end: { value: "", isValid: true, message: null },
}

export const formTermsCondition = {
  terms_condition: { value: "", isValid: true, message: null },
}

export const formLengthVoucher = {
  voucher: { value: 0, isValid: true, message: null },
  selected: { value: 0, isValid: true, message: null }
}

export const formVoucher = {
  code: { value: "", isValid: true, message: null },
  quota: { value: "", isValid: true, message: null }, // lebih besar dari 0
  min_transaction: { value: 0, isValid: true, message: null },
  nominal: { value: "", isValid: true, message: null },
  percent: { value: "", isValid: true, message: null }, // lebih besar dari 0
  max_discount: { value: "", isValid: true, message: null }, // lebih besar dari 0
  kind: { value: "discount", isValid: true, message: null }, // 'discount', 'discount_up_to', 'ongkir'
}

export const formSelectedPromo = {
  promo_id: { value: [], isValid: true, message: null }
}

export const formLengthVoucherIsValid = (state, setState, kind, t) => {
  const voucher = { ...state.voucher }
  const selected = { ...state.selected}
  let isGood = true

  if(voucher.value <= 0){
    isGood = false
    voucher.isValid = false
    voucher.message = t.validation.empty_voucher
  }

  if(kind !== "all"){
    if(selected.value <= 0){
      isGood = false
      selected.isValid = false
      selected.message = t.validation.empty_voucher
    }
  }

  if(!isGood) setState({ ...state, voucher, selected })

  return isGood
}

export const formSelectedPromoIsValid = (state, setState, t) => {
  const promo_id = { ...state.promo_id }
  let isGood = true

  if(promo_id.value.length <= 0){
    isGood = false
    promo_id.isValid = false
    promo_id.message = t.validation.empty_promo
  }

  if(!isGood) setState({ ...state, promo_id })

  return isGood
}

export const formPromoIsValid = (state, setState, state2, setState2, t) => {
  const name = { ...state.name }
  const seen = { ...state.seen }
  const desc = { ...state.desc }
  const period_start = { ...state.period_start }
  const period_end = { ...state.period_end }
  const terms_condition = { ...state2.terms_condition }
  let isGood = true

  if(isEmpty(name.value)){
    isGood = false
    name.isValid = false
    name.message = t.validation.empty
  }

  if(isEmpty(seen.value.toString())){
    isGood = false
    seen.isValid = false
    seen.message = t.validation.empty
  }

  if(isEmpty(period_start.value.toString())){
    isGood = false
    period_start.isValid = false
    period_start.message = t.validation.empty
  }

  if(isEmpty(period_end.value.toString())){
    isGood = false
    period_end.isValid = false
    period_end.message = t.validation.empty
  }

  if(seen.value){
    if(isEmpty(desc.value)){
      isGood = false
      desc.isValid = false
      desc.message = t.validation.empty
    }
    let plainText = terms_condition.value.replace(/<[^>]+>/g, '');
    let finalText = plainText.replace(/&nbsp;/g, " ");
    if(isEmpty(finalText)){
      isGood = false
      terms_condition.isValid = false
      terms_condition.message = t.validation.empty
    }
  }

  if(!isGood){
    setState2({ ...state2, terms_condition })
    setState({ ...state, name, seen, desc, period_start, period_end })
  }

  return isGood
}

export const formTableVoucherIsValid = (state, setState, idx, t) => {
  const newState = [...state]
  let isGood = true

  let codeValue = newState[idx]["voucher"].code.value
  let kindValue = newState[idx]["voucher"].kind.value
  let nominalValue = newState[idx]["voucher"].nominal.value
  let percentValue = newState[idx]["voucher"].percent.value
  let quotaValue = newState[idx]["voucher"].quota.value || ""
  let maxDiscountValue = newState[idx]["voucher"].max_discount.value
  let minTransactionValue = newState[idx]["voucher"].min_transaction.value

  if(isEmpty(codeValue)){
    isGood = false
    newState[idx]["voucher"].code.isValid = false
    newState[idx]["voucher"].code.message = t.validation.empty_column
  }

  if(isEmpty(quotaValue && quotaValue.toString())){
    isGood = false
    newState[idx]["voucher"].quota.isValid = false
    newState[idx]["voucher"].quota.message = t.validation.empty_column
  }

  if((kindValue === "discount") && isEmpty(minTransactionValue && minTransactionValue.toString() || "")){
    if(minTransactionValue < 0){
      isGood = false
      newState[idx]["voucher"].min_transaction.isValid = false
      newState[idx]["voucher"].min_transaction.message = t.validation.min_transaction
    }
  }

  if((kindValue === "discount") && isEmpty(nominalValue && nominalValue.toString() || "")){
    isGood = false
    newState[idx]["voucher"].nominal.isValid = false
    newState[idx]["voucher"].nominal.message = t.validation.empty_column
  }

  if((kindValue === "discount_up_to") && isEmpty(percentValue && percentValue.toString() || "")){
    isGood = false
    newState[idx]["voucher"].percent.isValid = false
    newState[idx]["voucher"].percent.message = t.validation.empty_column
  }

  if((kindValue === "discount_up_to") && isEmpty(maxDiscountValue && maxDiscountValue.toString() || "")){
    isGood = false
    newState[idx]["voucher"].max_discount.isValid = false
    newState[idx]["voucher"].max_discount.message = t.validation.empty_column
  }

  if(!isGood) setState(newState)

  return isGood
}

export const formTableOngkirIsValid = (state, setState, idx, t) => {
  const newState = [...state]
  let isGood = true

  let codeValue = newState[idx]["voucher"].code.value
  let quotaValue = newState[idx]["voucher"].quota.value || ""
  let minTransactionValue = newState[idx]["voucher"].min_transaction.value

  if(isEmpty(codeValue)){
    isGood = false
    newState[idx]["voucher"].code.isValid = false
    newState[idx]["voucher"].code.message = t.validation.empty_column
  }

  if(isEmpty(quotaValue && quotaValue.toString())){
    isGood = false
    newState[idx]["voucher"].quota.isValid = false
    newState[idx]["voucher"].quota.message = t.validation.empty_column
  }

  if(minTransactionValue < 0){
    isGood = false
    newState[idx]["voucher"].min_transaction.isValid = false
    newState[idx]["voucher"].min_transaction.message = t.validation.min_transaction
  }

  if(!isGood) setState(newState)

  return isGood
}
