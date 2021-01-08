import isInt from 'validator/lib/isInt'
import isEmpty from 'validator/lib/isEmpty'
import isLength from 'validator/lib/isLength'
import isEquals from 'validator/lib/equals'
import getIndex from 'lib/getIndex'

const emptyMessage = "Variasi tidak boleh kosong"
const emptyColumnMessage = "Kolom tidak boleh kosong"
const duplicateMessage = "Pilihan variasi harus berbeda."
const stockMessage = "Stok tidak boleh kurang dari 0."
const priceMessage = "Harga harus lebih dari 1."

const nameTitle1 = "Masukkan Nama Variasi, contoh: Warna, dll."
const nameTitle2 = "Masukkan Nama Variasi, contoh: Ukuran, dll."
const nameVariant1 = "Masukkan Pilihan Variasi, contoh: Merah, dll."
const nameVariant2 = "Masukkan Pilihan Variasi, contoh: S, M, dll."

const ignore_whitespace = { ignore_whitespace: true }
const initStringVal = { value: "", isValid: true, message: null }

export const formInformationProduct = {
  name: initStringVal,
  desc: initStringVal,
  item_sub_category_id: { ...initStringVal, value: [] },
  brand_id: { ...initStringVal, value: [] },
  condition: { ...initStringVal, value: true },
  weight: initStringVal,
  video: initStringVal,
}

export const formNoVariant = {
  va1_price: initStringVal,
  va1_stock: { ...initStringVal, value: 0 },
  va1_code: initStringVal,
  va1_barcode: initStringVal
}

export const formNoVariantIsValid = (state, setState) => {
  const va1_price = { ...state.va1_price }
  const va1_stock = { ...state.va1_stock }
  const va1_code = { ...state.va1_code }
  const va1_barcode = { ...state.va1_barcode }
  let isGood = true

  if(va1_price.value < 1){
    isGood = false;
    va1_price.isValid = false;
    va1_price.message = priceMessage;
  }
  if(!isInt(va1_price.value ? va1_price.value.toString() : "")){
    isGood = false;
    va1_price.isValid = false;
    va1_price.message = emptyColumnMessage;
  }

  if(va1_stock.value < 0){
    isGood = false;
    va1_stock.isValid = false;
    va1_stock.message = stockMessage;
  }
  if(va1_stock.value !== 0 && !isInt(va1_stock.value ? va1_stock.value.toString() : "")){
    isGood = false;
    va1_stock.isValid = false;
    va1_stock.message = emptyColumnMessage;
  }

  if(va1_code.value !== "" && isEmpty(va1_code.value, ignore_whitespace)){
    isGood = false;
    va1_code.isValid = false;
    va1_code.message = emptyColumnMessage;
  }

  if(!isLength(va1_code.value, { min: 0, max: 50 })){
    isGood = false;
    va1_code.isValid = false;
    va1_code.message = "Value tidak boleh lebih dari 50 karakter";
  }

  if(va1_barcode.value !== "" && isEmpty(va1_barcode.value, ignore_whitespace)){
    isGood = false;
    va1_barcode.isValid = false;
    va1_barcode.message = emptyColumnMessage;
  }

  if(!isLength(va1_barcode.value, { min: 0, max: 50 })){
    isGood = false;
    va1_barcode.isValid = false;
    va1_barcode.message = "Value tidak boleh lebih dari 50 karakter";
  }

  if(!isGood) setState({ ...state, va1_price, va1_stock, va1_code, va1_barcode })

  return isGood
}

export const formVariantTitleIsValid = (state, setState) => {
  const newColumns = [...state]
  const idx = getIndex("va1_option", state, 'key')
  let isGood = true

  if(isEmpty(newColumns[idx].title == "Nama" ?  "" : newColumns[idx].title, ignore_whitespace)){
    isGood = false
    newColumns[idx].isValid = false
    newColumns[idx].message = emptyMessage
  }

  if(!isGood) setState(newColumns)

  return isGood
}

export const formTitleIsValid = (state, setState) => {
  const newColumns = [...state]
  const idx1 = getIndex("va1_option", state, 'key')
  const idx2 = getIndex("va2_option", state, 'key')
  let isGood = true

  if(isEmpty(newColumns[idx1].title == "Nama" ?  "" : newColumns[idx1].title, ignore_whitespace)){
    isGood = false
    newColumns[idx1].isValid = false
    newColumns[idx1].message = emptyMessage
  }

  if(isEmpty(newColumns[idx2].title == "Nama" ?  "" : newColumns[idx2].title, ignore_whitespace)){
    isGood = false
    newColumns[idx2].isValid = false
    newColumns[idx2].message = emptyMessage
  }

  if(newColumns[idx1].title !== "Nama" || newColumns[idx2].title !== "Nama"){
    if(isEquals(newColumns[idx1].title, newColumns[idx2].title)){
      isGood = false
      newColumns[idx2].isValid = false
      newColumns[idx2].message = duplicateMessage
    }
  }

  if(!isGood) setState(newColumns)

  return isGood
}

export const formVa1OptionSingleVariantIsValid = (state, setState, idx) => {
  const newVaOption = [...state[`va1Option`]]
  let isGood = true

  if(!isLength(newVaOption[idx][`va1_option`].value, { min: 1, max: 20 })){
    isGood = false;
    newVaOption[idx][`va1_option`].isValid = false;
    newVaOption[idx][`va1_option`].message = emptyMessage;
  }

  if(!isGood) setState({ ...state, va1Option: newVaOption })

  return isGood
}

export const formVa2OptionDoubleVariantIsValid = (state, setState, idx) => {
  const newVaOption = [...state[`va2Option`]]
  let isGood = true

  if(!isLength(newVaOption[idx][`va2_option`].value, { min: 1, max: 20 })){
    isGood = false;
    newVaOption[idx][`va2_option`].isValid = false;
    newVaOption[idx][`va2_option`].message = emptyMessage;
  }

  if(!isGood) setState({ ...state, va2Option: newVaOption })

  return isGood
}

export const formTableIsValid = (state, setState, idx) => {
  const newDataSource = [...state]
  let isGood = true

  if(newDataSource[idx].price.value < 1){
    isGood = false;
    newDataSource[idx].price.isValid = false;
    newDataSource[idx].price.message = priceMessage;
  }
  if(newDataSource[idx].price.value !== 0 && 
     isEmpty(newDataSource[idx].price.value ? newDataSource[idx].price.value.toString() : "", ignore_whitespace)) {
    isGood = false;
    newDataSource[idx].price.isValid = false;
    newDataSource[idx].price.message = emptyColumnMessage;
  }

  if(newDataSource[idx].stock.value < 0){
    isGood = false;
    newDataSource[idx].stock.isValid = false;
    newDataSource[idx].stock.message = stockMessage;
  }
  if(newDataSource[idx].stock.value !== 0 && !isInt(newDataSource[idx].stock.value ? newDataSource[idx].stock.value.toString() : "")){
    isGood = false;
    newDataSource[idx].stock.isValid = false;
    newDataSource[idx].stock.message = emptyColumnMessage;
  }

  if(newDataSource[idx].code.value !== "" && isEmpty(newDataSource[idx].code.value, ignore_whitespace)){
    isGood = false;
    newDataSource[idx].code.isValid = false;
    newDataSource[idx].code.message = emptyColumnMessage;
  }
  if(!isLength(newDataSource[idx].code.value, { min: 0, max: 50 })){
    isGood = false;
    newDataSource[idx].code.isValid = false;
    newDataSource[idx].code.message = "Value tidak boleh lebih dari 50 karakter";
  }

  if(newDataSource[idx].barcode.value !== "" && isEmpty(newDataSource[idx].barcode.value, ignore_whitespace)){
    isGood = false;
    newDataSource[idx].barcode.isValid = false;
    newDataSource[idx].barcode.message = emptyColumnMessage;
  }
  if(!isLength(newDataSource[idx].barcode.value, { min: 0, max: 50 })){
    isGood = false;
    newDataSource[idx].barcode.isValid = false;
    newDataSource[idx].barcode.message = "Value tidak boleh lebih dari 50 karakter";
  }

  if(!isGood){
    setState(newDataSource)
  }

  return isGood
}
