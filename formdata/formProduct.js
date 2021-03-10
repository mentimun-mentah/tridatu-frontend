import isInt from 'validator/lib/isInt'
import isEmpty from 'validator/lib/isEmpty'
import isLength from 'validator/lib/isLength'
import isEquals from 'validator/lib/equals'
import isBoolean from 'validator/lib/isBoolean'

import getIndex from 'lib/getIndex'

const emptyMessage = (t) => t.sales_information.validation.empty_variant
const emptyColumnMessage = (t) => t.sales_information.validation.empty_column
const duplicateMessage = (t) => t.sales_information.validation.duplicate
const stockMessage = (t) => t.sales_information.validation.stock
const priceMessage = (t) => t.sales_information.validation.price

const ignore_whitespace = { ignore_whitespace: true }
const initStringVal = { value: "", isValid: true, message: null }

export const formInformationProduct = {
  name: initStringVal,
  desc: initStringVal,
  item_sub_category_id: { ...initStringVal, value: [] },
  brand_id: { ...initStringVal, value: [] },
  condition: { ...initStringVal, value: true },
  weight: initStringVal,
  preorder: initStringVal,
  video: initStringVal,
}

export const formNoVariant = {
  va1_id: { ...initStringVal, value: 0 },
  va1_price: initStringVal,
  va1_stock: { ...initStringVal, value: 0 },
  va1_code: initStringVal,
  va1_barcode: initStringVal,
  va1_discount: { ...initStringVal, value: 0 },
  va1_discount_active: { ...initStringVal, value: false }
}

export const isValidProductInformation = (state, setState, isPreorder, t) => {
  const name = { ...state.name }
  const desc = { ...state.desc }
  const condition = { ...state.condition }
  // const brand_id = { ...state.brand_id }
  const item_sub_category_id = { ...state.item_sub_category_id }
  const weight = { ...state.weight }
  const preorder = { ...state.preorder }
  // const video = { ...state.video }
  let isGood = true

  if(isEmpty(name.value, ignore_whitespace)){
    isGood = false;
    name.isValid = false;
    name.message = emptyColumnMessage(t);
  }
  if(!isLength(name.value, { min: 5, max: 100 })){
    isGood = false;
    name.isValid = false;
    name.message = t.sales_information.validation.name_check;
  }

  if(isEmpty(desc.value, ignore_whitespace)){
    isGood = false;
    desc.isValid = false;
    desc.message = emptyColumnMessage(t);
  }
  if(!isLength(desc.value, { min: 20, max: undefined })){
    isGood = false;
    desc.isValid = false;
    desc.message = t.sales_information.validation.description_check;
  }

  if(isEmpty(condition.value.toString(), ignore_whitespace)){
    isGood = false;
    condition.isValid = false;
    condition.message = emptyColumnMessage(t);
  }
  if(!isBoolean(condition.value.toString())){
    isGood = false;
    condition.isValid = false;
    condition.message = t.sales_information.validation.invalid_value;;
  }

  if(isEmpty(weight.value ? weight.value.toString() : "", ignore_whitespace) || weight.value == null){
    isGood = false;
    weight.isValid = false;
    weight.message = emptyColumnMessage(t);
  }
  if(!isInt(weight.value ? weight.value.toString() : "", { allow_leading_zeroes: false })){
    isGood = false;
    weight.isValid = false;
    weight.message = emptyColumnMessage(t);
  }
  if(weight.value ? weight.value.length > 18 : ""){
    isGood = false;
    weight.isValid = false;
    weight.message = t.sales_information.validation.weight_check;
  }

  if(item_sub_category_id.value.length < 1){
    isGood = false;
    item_sub_category_id.isValid = false;
    item_sub_category_id.message = emptyColumnMessage(t);
  }

  if(isPreorder && preorder.value && preorder.value == 0){
    isGood = false;
    preorder.isValid = false;
    preorder.message = t.sales_information.validation.preorder_check;
  }
  if(isPreorder && preorder.value && preorder.value == null){
    isGood = false;
    preorder.isValid = false;
    preorder.message = t.sales_information.validation.preorder_check;
  }
  if(isPreorder && preorder.value && preorder.value !== null && !isInt(preorder.value.toString(), { min: 1, max: 500 })){
    isGood = false;
    preorder.isValid = false;
    preorder.message = t.sales_information.validation.preorder_check;
  }
  if(isPreorder && isEmpty(preorder.value ? preorder.value.toString() : "")){
    isGood = false;
    preorder.isValid = false;
    preorder.message = t.sales_information.validation.preorder_check;
  }
  if(preorder.value && preorder.value == 0){
    isGood = false;
    preorder.isValid = false;
    preorder.message = t.sales_information.validation.preorder_check;
  }
  if(preorder.value && preorder.value !== null && !isInt(preorder.value.toString(), { min: 1, max: 500 })){
    isGood = false;
    preorder.isValid = false;
    preorder.message = t.sales_information.validation.preorder_check;
  }
  if(preorder.value !== "" && preorder.value !== null && !isInt(preorder.value ? preorder.value.toString() : "", { min: 1, max: 500 })){
    isGood = false;
    preorder.isValid = false;
    preorder.message = t.sales_information.validation.preorder_check;
  }

  if(!isGood) setState({ ...state, name, desc, condition, weight, item_sub_category_id, preorder })

  return isGood
}


// variant validation
export const formNoVariantIsValid = (state, setState, t) => {
  const va1_price = { ...state.va1_price }
  const va1_stock = { ...state.va1_stock }
  const va1_code = { ...state.va1_code }
  const va1_barcode = { ...state.va1_barcode }
  let isGood = true

  if(va1_price.value < 1){
    isGood = false;
    va1_price.isValid = false;
    va1_price.message = priceMessage(t);
  }
  if(!isInt(va1_price.value ? va1_price.value.toString() : "")){
    isGood = false;
    va1_price.isValid = false;
    va1_price.message = emptyColumnMessage(t);
  }

  if(va1_stock.value < 0){
    isGood = false;
    va1_stock.isValid = false;
    va1_stock.message = stockMessage(t);
  }
  if(va1_stock.value !== 0 && !isInt(va1_stock.value ? va1_stock.value.toString() : "")){
    isGood = false;
    va1_stock.isValid = false;
    va1_stock.message = emptyColumnMessage(t);
  }

  if(va1_code.value !== "" && isEmpty(va1_code.value, ignore_whitespace)){
    isGood = false;
    va1_code.isValid = false;
    va1_code.message = emptyColumnMessage(t);
  }

  if(!isLength(va1_code.value, { min: 0, max: 50 })){
    isGood = false;
    va1_code.isValid = false;
    va1_code.message = t.sales_information.validation.code_barcode_check;
  }

  if(va1_barcode.value !== "" && isEmpty(va1_barcode.value, ignore_whitespace)){
    isGood = false;
    va1_barcode.isValid = false;
    va1_barcode.message = emptyColumnMessage(t);
  }

  if(!isLength(va1_barcode.value, { min: 0, max: 50 })){
    isGood = false;
    va1_barcode.isValid = false;
    va1_barcode.message = t.sales_information.validation.code_barcode_check;
  }

  if(!isGood) setState({ ...state, va1_price, va1_stock, va1_code, va1_barcode })

  return isGood
}

export const formVariantTitleIsValid = (state, setState, t) => {
  const newColumns = [...state]
  const idx = getIndex("va1_option", state, 'key')
  let isGood = true

  if(isEmpty(newColumns[idx].title == t.sales_information.variant.name ?  "" : newColumns[idx].title, ignore_whitespace)){
    isGood = false
    newColumns[idx].isValid = false
    newColumns[idx].message = emptyMessage(t)
  }

  if(!isGood) setState(newColumns)

  return isGood
}

export const formTitleIsValid = (state, setState, t) => {
  const newColumns = [...state]
  const idx1 = getIndex("va1_option", state, 'key')
  const idx2 = getIndex("va2_option", state, 'key')
  let isGood = true

  if(isEmpty(newColumns[idx1].title == t.sales_information.variant.name ?  "" : newColumns[idx1].title, ignore_whitespace)){
    isGood = false
    newColumns[idx1].isValid = false
    newColumns[idx1].message = emptyMessage(t)
  }

  if(isEmpty(newColumns[idx2].title == t.sales_information.variant.name ?  "" : newColumns[idx2].title, ignore_whitespace)){
    isGood = false
    newColumns[idx2].isValid = false
    newColumns[idx2].message = emptyMessage(t)
  }

  if(newColumns[idx1].title !== t.sales_information.variant.name || newColumns[idx2].title !== t.sales_information.variant.name){
    if(isEquals(newColumns[idx1].title, newColumns[idx2].title)){
      isGood = false
      newColumns[idx2].isValid = false
      newColumns[idx2].message = duplicateMessage(t)
    }
  }

  if(!isGood) setState(newColumns)

  return isGood
}

export const formVa1OptionSingleVariantIsValid = (state, setState, idx, t) => {
  const newVaOption = [...state[`va1Option`]]
  let isGood = true

  if(!isLength(newVaOption[idx][`va1_option`].value, { min: 1, max: 20 })){
    isGood = false;
    newVaOption[idx][`va1_option`].isValid = false;
    newVaOption[idx][`va1_option`].message = emptyMessage(t);
  }

  if(!isGood) setState({ ...state, va1Option: newVaOption })

  return isGood
}

export const formVa2OptionDoubleVariantIsValid = (state, setState, idx, t) => {
  const newVaOption = [...state[`va2Option`]]
  let isGood = true

  if(!isLength(newVaOption[idx][`va2_option`].value, { min: 1, max: 20 })){
    isGood = false;
    newVaOption[idx][`va2_option`].isValid = false;
    newVaOption[idx][`va2_option`].message = emptyMessage(t);
  }

  if(!isGood) setState({ ...state, va2Option: newVaOption })

  return isGood
}

export const formTableIsValid = (state, setState, idx, t) => {
  const newDataSource = [...state]
  let isGood = true

  if(newDataSource[idx].price.value < 1){
    isGood = false;
    newDataSource[idx].price.isValid = false;
    newDataSource[idx].price.message = priceMessage(t);
  }
  if(newDataSource[idx].price.value !== 0 && 
     isEmpty(newDataSource[idx].price.value ? newDataSource[idx].price.value.toString() : "", ignore_whitespace)) {
    isGood = false;
    newDataSource[idx].price.isValid = false;
    newDataSource[idx].price.message = emptyColumnMessage(t);
  }

  if(newDataSource[idx].stock.value < 0){
    isGood = false;
    newDataSource[idx].stock.isValid = false;
    newDataSource[idx].stock.message = stockMessage(t);
  }
  if(newDataSource[idx].stock.value !== 0 && !isInt(newDataSource[idx].stock.value ? newDataSource[idx].stock.value.toString() : "")){
    isGood = false;
    newDataSource[idx].stock.isValid = false;
    newDataSource[idx].stock.message = emptyColumnMessage(t);
  }

  if(newDataSource[idx].code.value !== "" && isEmpty(newDataSource[idx].code.value, ignore_whitespace)){
    isGood = false;
    newDataSource[idx].code.isValid = false;
    newDataSource[idx].code.message = emptyColumnMessage(t);
  }
  if(!isLength(newDataSource[idx].code.value, { min: 0, max: 50 })){
    isGood = false;
    newDataSource[idx].code.isValid = false;
    newDataSource[idx].code.message = t.sales_information.validation.code_barcode_check;
  }

  if(newDataSource[idx].barcode.value !== "" && isEmpty(newDataSource[idx].barcode.value, ignore_whitespace)){
    isGood = false;
    newDataSource[idx].barcode.isValid = false;
    newDataSource[idx].barcode.message = emptyColumnMessage(t);
  }
  if(!isLength(newDataSource[idx].barcode.value, { min: 0, max: 50 })){
    isGood = false;
    newDataSource[idx].barcode.isValid = false;
    newDataSource[idx].barcode.message = t.sales_information.validation.code_barcode_check;
  }

  if(!isGood){
    setState(newDataSource)
  }

  return isGood
}
