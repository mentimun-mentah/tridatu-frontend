import { withAuth } from 'lib/withAuth'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Radio, Select, Table, Space, Tooltip } from 'antd'
import { PlusCircleOutlined, LoadingOutlined  } from '@ant-design/icons'

import _ from 'lodash'
import makeid from 'lib/makeid'
import isIn from 'validator/lib/isIn'
import Button from "antd-button-color"
import Card from 'react-bootstrap/Card'
import isEmpty from 'validator/lib/isEmpty'
import ErrorMessage from 'components/ErrorMessage'

import { getSelectedKeys } from 'lib/voucher'
import { imageValidation, uploadButton } from 'lib/imageUploader'
import axios, { jsonHeaderHandler, resNotification, signature_exp, formErrorMessage } from 'lib/axios'
import { formTableVoucherIsValid, formTableOngkirIsValid } from 'formdata/formPromo'
import { formVoucher, formSelectedPromo, formLengthVoucher } from 'formdata/formPromo'
import { formSelectedPromoIsValid, formLengthVoucherIsValid } from 'formdata/formPromo'
import { columnsSelectedSubCategory, columnsSelectedItemSubCategory } from 'data/voucher'
import { columnsVoucher, columnsOngkir, columnsSelectedProduct, columnsSelectedBrand, columnsSelectedCategory } from 'data/voucher'

// import { productsData } from 'data/products'

import * as actions from "store/actions";
import AddStyleAdmin from 'components/Admin/addStyle'
import EditableCell from 'components/Admin/Voucher/Cell'
import ProductEditableCell from 'components/Admin/Voucher/ProductCell'

import BrandVoucherModal from 'components/Modal/Admin/Vouchers/SetupVoucherBrand'
import ProductVoucherModal from 'components/Modal/Admin/Vouchers/SetupVoucherProduct'
import CategoryVoucherModal from 'components/Modal/Admin/Vouchers/SetupVoucherCategory'
import SubCategoryVoucherModal from 'components/Modal/Admin/Vouchers/SetupVoucherSubCategory'
import ItemSubCategoryVoucherModal from 'components/Modal/Admin/Vouchers/SetupVoucherItemSubCategory'

const components = { body: { cell: EditableCell } };
const productComponents = { body: { cell: ProductEditableCell } };

const ALL_KIND = "all", SPECIFIC_BRAND = "specific_brand", SPECIFIC_PRODUCT = "specific_product", 
      CATEGORY = "category", SUB_CATEGORY = "sub_category", ITEM_SUB_CATEGORY = "item_sub_category"

const ButtonAddVoucher = ({ onClick, disabled, title, children }) => (
  <Tooltip title={title}>
    <Button block 
      with="dashed" 
      type="primary" 
      className="h-35" 
      icon={<PlusCircleOutlined />} 
      onClick={disabled ? () => {} : onClick}
      disabled={disabled}
    >
      {children}
    </Button>
  </Tooltip>
)

const tableProps = {
  className: "mt-3",
  scroll: { x:700 },
  pagination: {
    pageSize: 5,
    hideOnSinglePage: true,
  },
  components: productComponents
}

const initialTypeVoucher = { value: ALL_KIND, label: "Produk" }

const tooltipSelectPromoFirst = <small>Pilih promo terlebih dahulu</small>
const tooltipMaximumVoucher = <small>Pilih promo terlebih dahulu</small>

const NewPromo = () => {
  const dispatch = useDispatch()
  /*GLOBAL STATE*/
  const listPromoName = useSelector(state => state.promo.listPromoName)
  /*GLOBAL STATE*/

  const [loading, setLoading] = useState(false)
  const [dataVoucher, setDataVoucher] = useState([])
  const [dataFreeShipping, setDataFreeShipping] = useState([])
  const [typeVoucher, setTypeVoucher] = useState(initialTypeVoucher)
  const [countVoucherLength, setCountVoucherLength] = useState(formLengthVoucher)

  /*MODAL VOUCHER*/
  const [showBrandModal, setShowBrandModal] = useState(false)
  const [showProductModal, setShowProductModal] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [showSubCategoryModal, setShowSubCategoryModal] = useState(false)
  const [showItemSubCategoryModal, setShowItemSubCategoryModal] = useState(false)

  const [selectedBrand, setSelectedBrand] = useState([])
  const [selectedProduct, setSelectedProduct] = useState([])
  const [selectedCategory, setSelectedCategory] = useState([])
  const [selectedSubCategory, setSelectedSubCategory] = useState([])
  const [selectedItemSubCategory, setSelectedItemSubCategory] = useState([])
  /*MODAL VOUCHER*/
  
  /*SEARCH PROMO*/
  const [searchName, setSearchName] = useState("")
  const [selectedPromo, setSelectedPromo] = useState(formSelectedPromo)
  const [notFound, setNotFound] = useState("Harap masukkan 1 karakter atau lebih")
  /*SEARCH PROMO*/

  const { promo_id } = selectedPromo
  const { voucher, selected } = countVoucherLength

  const onChangeCountVoucher = (add) => {
    if(add) {
      const data = {
        ...countVoucherLength,
        voucher: {
          value: countVoucherLength.voucher.value + 1,
          isValid: true, message: null
        }
      }
      setCountVoucherLength(data)
    } else {
      const data = {
        ...countVoucherLength,
        voucher: {
          value: countVoucherLength.voucher.value - 1,
          isValid: true, message: null
        }
      }
      setCountVoucherLength(data)
    }
  }

  /*FUNCTION FOR ADD NEW DISCOUNT VOUCHER*/
  const addVoucherDiscountHandler = () => {
    const newFormVoucher = JSON.parse(JSON.stringify(formVoucher))
    const data = {
      key: makeid(5),
      voucher : newFormVoucher
    }
    setDataVoucher([...dataVoucher, data])
    onChangeCountVoucher(true)
  }
  /*FUNCTION FOR ADD NEW DISCOUNT VOUCHER*/

  /*FUNCTION FOR DELETE DISCOUNT VOUCHER*/
  const removeVoucherDiscountHandler = (index) => {
    setDataVoucher(dataVoucher.filter((_, i) => i !== index))
    onChangeCountVoucher(false)
  }
  /*FUNCTION FOR DELETE DISCOUNT VOUCHER*/

  /*FUNCTION FOR ADD FREESHIP VOUCHER*/
  const addFreeShippingHandler = () => {
    const newFormVoucher = JSON.parse(JSON.stringify(formVoucher))
    newFormVoucher.kind.value = "ongkir"
    newFormVoucher.min_transaction.value = 0
    newFormVoucher.nominal.value = null
    newFormVoucher.percent.value = null
    newFormVoucher.max_discount.value = null
    const data = {
      key: makeid(5),
      voucher : newFormVoucher
    }
    setDataFreeShipping([...dataFreeShipping, data])
    onChangeCountVoucher(true)
  }
  /*FUNCTION FOR ADD FREESHIP VOUCHER*/

  /*FUNCTION FOR DELETE FREESHIP VOUCHER*/
  const removeFreeShippingHandler = (index) => {
    setDataFreeShipping(dataFreeShipping.filter((_, i) => i !== index))
    onChangeCountVoucher(false)
  }
  /*FUNCTION FOR DELETE FREESHIP VOUCHER*/

  /*FUNCTION FOR CHANGING KIND OF VOUCHER*/
  const discountTypeHandler = (val, index) => {
    const newDataVoucher = JSON.parse(JSON.stringify(dataVoucher))
    let item = "nominal"
    if(val === "discount") item = "nominal"
    if(val === "discount_up_to") item = "percent"

    newDataVoucher[index] = {
      ...newDataVoucher[index], 
      voucher: {
        ...newDataVoucher[index].voucher, 
        kind: {
          ...newDataVoucher[index].voucher.kind,
          value: val 
        },
        [item]: {
          ...newDataVoucher[index].voucher[item],
          value: "", isValid: true, message: null
        }
      }
    }
    setDataVoucher(newDataVoucher)
  }
  /*FUNCTION FOR CHANGING KIND OF VOUCHER*/

  /*FUNCTION FOR REMOVE SELECTED ITEM*/
  const removeItemHandler = (key, state, setState) => {
    const newState = [...state]
    _.remove(newState, x => x.key === key)
    setState(newState)
  }

  const removeItemChildHandler = (key, state, setState) => {
    if(key.toString().includes("~")){
      const newState = [...state]
      _.remove(newState, x => x.key === key)
      setState(newState)
    }
    else{
      const newState = [...state]
      for(let [idx,val] of Object.entries(newState)){
        _.remove(val.children, x => x.key === key)
        if(val.children.length < 1){
          newState.splice(idx, 1)
        }
      }
      setState(newState)
    }
  }
  /*FUNCTION FOR REMOVE SELECTED ITEM*/

  /*FUNCTION FOR VALIDATING DATA TABLE*/
  const onValidateTable = (e, item, index) => {
    const newData = [...dataVoucher]
    if(isIn(item, ["code", "quota"])){
      if(isEmpty(e.target.value || "", { ignore_whitespace: true })) {
        newData[index]['voucher'][item].isValid = false
        newData[index]['voucher'][item].message = "Kolom tidak boleh kosong"
      }
    }
    if(item === "nominal-percent"){
      if(newData[index]['voucher']['kind'].value === "discount"){
        if(isEmpty(e.target.value || "", { ignore_whitespace: true })) {
          newData[index]['voucher']['nominal'].isValid = false
          newData[index]['voucher']['nominal'].message = "Kolom tidak boleh kosong"
        }
      }
      if(newData[index]['voucher']['kind'].value === "discount_up_to"){
        if(isEmpty(e.target.value || "", { ignore_whitespace: true })) {
          newData[index]['voucher']['percent'].isValid = false
          newData[index]['voucher']['percent'].message = "Kolom tidak boleh kosong"
        }
      }
    }
    setDataVoucher(newData)
  }

  const onValidateTableOngkir = (e, item, index) => {
    const newData = [...dataFreeShipping]
    if(isIn(item, ["code", "quota"])){
      if(isEmpty(e.target.value || "", { ignore_whitespace: true })) {
        newData[index]['voucher'][item].isValid = false
        newData[index]['voucher'][item].message = "Kolom tidak boleh kosong"
      }
    }
    if(item === "min_transaction" && e.target.value < 0) {
      newData[index]['voucher'][item].isValid = false
      newData[index]['voucher'][item].message = "Min. Transaksi mulai dari 0"
    }
    setDataFreeShipping(newData)
  }
  /*FUNCTION FOR VALIDATING DATA TABLE*/

  /*FUNCTION FOR EDITING DATA TABLE*/
  const onTableChange = (e, item, index) => {
    const newData = [...dataVoucher]
    const listCode = newData.map(data => data.voucher.code.value)

    if(item === "code"){
      const re = /^[A-Z0-9]+$/
      if(re.test(e.target.value.toUpperCase())){
        const ss = e.target.selectionStart;
        const se = e.target.selectionEnd;
        const value = e.target.value.toUpperCase()
        e.target.value = e.target.value.toUpperCase();
        e.target.selectionStart = ss;
        e.target.selectionEnd = se;
        newData[index]['voucher'][item].value = value
        newData[index]['voucher'][item].isValid = true
        newData[index]['voucher'][item].message = null

        if(isIn(value, listCode)){
          newData[index]['voucher'][item].value = value
          newData[index]['voucher'][item].isValid = false
          newData[index]['voucher'][item].message = "Kode tidak boleh sama"
        }
      }
      if(isEmpty(e.target.value || "", { ignore_whitespace: true })) {
        newData[index]['voucher'][item].value = e.target.value
        newData[index]['voucher'][item].isValid = true
        newData[index]['voucher'][item].message = null
      }
    }
    if(item === "nominal-percent"){
      if(newData[index]['voucher']['kind'].value === "discount"){
        newData[index]['voucher']['nominal'].value = e
        newData[index]['voucher']['nominal'].isValid = true
        newData[index]['voucher']['nominal'].message = null
      }
      if(newData[index]['voucher']['kind'].value === "discount_up_to"){
        newData[index]['voucher']['percent'].value = e
        newData[index]['voucher']['percent'].isValid = true
        newData[index]['voucher']['percent'].message = null
      }
    }
    if(item !== "nominal-percent" && item !== "code"){
      newData[index]['voucher'][item].value = e
      newData[index]['voucher'][item].isValid = true
      newData[index]['voucher'][item].message = null
    }
    setDataVoucher(newData)

    const data = {
      ...countVoucherLength,
      voucher: {
        ...countVoucherLength.voucher,
        isValid: true, message: null
      }
    }
    setCountVoucherLength(data)
  }

  const onTableChangeOngkir = (e, item, index) => {
    const newData = [...dataFreeShipping]

    if(item === "code"){
      const re = /^[A-Z0-9]+$/
      if(re.test(e.target.value.toUpperCase())){
        const ss = e.target.selectionStart;
        const se = e.target.selectionEnd;
        const value = e.target.value.toUpperCase()
        e.target.value = e.target.value.toUpperCase();
        e.target.selectionStart = ss;
        e.target.selectionEnd = se;
        newData[index]['voucher'][item].value = value
        newData[index]['voucher'][item].isValid = true
        newData[index]['voucher'][item].message = null
      }
      if(isEmpty(e.target.value || "", { ignore_whitespace: true })) {
        newData[index]['voucher'][item].value = e.target.value
        newData[index]['voucher'][item].isValid = true
        newData[index]['voucher'][item].message = null
      }
    }
    if(item !== "code"){
      newData[index]['voucher'][item].value = e
      newData[index]['voucher'][item].isValid = true
      newData[index]['voucher'][item].message = null
    }
    setDataFreeShipping(newData)
  }
  /*FUNCTION FOR EDITING DATA TABLE*/

  const columnsVouchers = columnsVoucher.map(col => {
    if (!col.editable) return col;
    return {
      ...col,
      onCell: (record, index) => ({
        record,
        index: index,
        type: col.type,
        editable: col.editable,
        onBlur: e => onValidateTable(e, col.type, index),
        onChange: e => onTableChange(e, col.type, index),
        onRemove: () => removeVoucherDiscountHandler(index),
        discountTypeHandler: val => discountTypeHandler(val, index),
      })
    }
  })

  const columnsShipping = columnsOngkir.map(col => {
    if (!col.editable) return col;
    return {
      ...col,
      onCell: (record, index) => ({
        record,
        index: index,
        type: col.type,
        editable: col.editable,
        onBlur: e => onValidateTableOngkir(e, col.type, index),
        onChange: e => onTableChangeOngkir(e, col.type, index),
        onRemove: () => removeFreeShippingHandler(index)
      })
    }
  })

  const columnsProduct = columnsSelectedProduct.map(col => {
    if (!col.editable) return col;
    return {
      ...col,
      onCell: (record, index) => ({
        record,
        index: index,
        type: col.type,
        editable: col.editable,
        onRemove: () => removeItemHandler(record.key, selectedProduct, setSelectedProduct)
      })
    }
  })

  const columnsBrand = columnsSelectedBrand.map(col => {
    if(!col.editable) return col;
    return {
      ...col,
      onCell: (record, index) => ({
        record,
        index: index,
        type: col.type,
        editable: col.editable,
        onRemove: () => removeItemHandler(record.key, selectedBrand, setSelectedBrand)
      })
    }
  })

  const columnsCategory = columnsSelectedCategory.map(col => {
    if(!col.editable) return col;
    return {
      ...col,
      onCell: (record, index) => ({
        record,
        index: index,
        type: col.type,
        editable: col.editable,
        onRemove: () => removeItemHandler(record.key, selectedCategory, setSelectedCategory)
      })
    }
  })

  const columnsSubCategory = columnsSelectedSubCategory.map(col => {
    if(!col.editable) return col;
    return {
      ...col,
      onCell: (record, index) => ({
        record,
        index: index,
        type: col.type,
        editable: col.editable,
        onRemove: () => removeItemHandler(record.key, selectedSubCategory, setSelectedSubCategory)
      })
    }
  })

  const columnsItemSubCategory = columnsSelectedItemSubCategory.map(col => {
    if(!col.editable) return col;
    return {
      ...col,
      onCell: (record, index) => ({
        record,
        index: index,
        type: col.type,
        editable: col.editable,
        onRemove: () => removeItemChildHandler(record.key, selectedItemSubCategory, setSelectedItemSubCategory)
      })
    }
  })
  
  const onShowModalHandler = (type) => {
    switch(type){
      case SPECIFIC_BRAND:
        return setShowBrandModal(true)
      case SPECIFIC_PRODUCT:
        return setShowProductModal(true)
      case CATEGORY:
        return setShowCategoryModal(true)
      case SUB_CATEGORY:
        return setShowSubCategoryModal(true)
      case ITEM_SUB_CATEGORY:
        return setShowItemSubCategoryModal(true)
      default:
        return () => {}
    }
  }

  const selectTypeVoucherHandler = e => {
    setTypeVoucher({
      value: e.target.value, 
      label: e.target.label
    })
  }

  useEffect(() => {
    setSelectedBrand([])
    setSelectedProduct([])
    setSelectedCategory([])
    setSelectedSubCategory([])
    setSelectedItemSubCategory([])
  }, [typeVoucher])

  const getSelectedProductId = () => {
    const newSelected = JSON.parse(JSON.stringify(selectedProduct))
    const listId = newSelected.map(x => x.products.products_id)
    return listId
  }

  const getSelectedBrandId = () => {
    const newSelected = JSON.parse(JSON.stringify(selectedBrand))
    const listId = newSelected.map(x => x.brand.id.toString())
    return listId
  }

  const getSelectedCategoryId = () => {
    const newSelected = JSON.parse(JSON.stringify(selectedCategory))
    const listId = newSelected.map(x => x.category.categories_id.toString())
    return listId
  }

  const getSelectedSubCategoryId = () => {
    const newSelected = JSON.parse(JSON.stringify(selectedSubCategory))
    const listId = newSelected.map(x => x.category.sub_categories_id.toString())
    return listId
  }

  const getSelectedItemSubCategoryId = () => {
    const newSelected = JSON.parse(JSON.stringify(selectedItemSubCategory))
    const listId = getSelectedKeys(newSelected).map(x => x.toString())
    return listId
  }

  const getListIdHandler = (type) => {
    switch(type){
      case SPECIFIC_BRAND:
        return getSelectedBrandId()
      case SPECIFIC_PRODUCT:
        return getSelectedProductId()
      case CATEGORY:
        return getSelectedCategoryId()
      case SUB_CATEGORY:
        return getSelectedSubCategoryId()
      case ITEM_SUB_CATEGORY:
        return getSelectedItemSubCategoryId()
      default:
        return () => {}
    }
  }

  /*FUNCTION FOR RESET DATA STATE*/
  const resetAllData = () => {
    setSelectedPromo(formSelectedPromo)
    setSelectedBrand([])
    setSelectedProduct([])
    setSelectedCategory([])
    setSelectedSubCategory([])
    setSelectedItemSubCategory([])
    setTypeVoucher(initialTypeVoucher)
    setDataVoucher([])
    setDataFreeShipping([])
    setCountVoucherLength(formLengthVoucher)
  }
  /*FUNCTION FOR RESET DATA STATE*/

  /*SEARCH PROMO NAME FUNCTION*/
  const fetchPromoName = val => {
    setSearchName(val)
    dispatch(actions.searchPromoName({ q: val }))
  }
  /*SEARCH PROMO NAME FUNCTION*/

  /*FUNCTION FOR SELECTING PROMO ID*/
  const onSelectPromoId = val => {
    const data = {
      ...selectedPromo,
      promo_id: { value: val.value, isValid: true, message: null }
    }
    setSelectedPromo(data)
    const countVoucher = {
      ...countVoucherLength,
      voucher: {
        value: val.total_code,
        isValid: true, message: null
      }
    }
    setCountVoucherLength(countVoucher)
  }
  /*FUNCTION FOR SELECTING PROMO ID*/

  /*FUNCTION FORMATING TO VOUCHER*/
  const formatingVoucher = () => {
    const listVoucher = []
    const newDataVoucher = [...dataVoucher]
    const newDataOngkir = [...dataFreeShipping]

    if(newDataVoucher.length){
      for(let val of newDataVoucher){
        const { code, kind, max_discount, min_transaction, nominal, percent, quota } = val.voucher
        const init = {
          code: code.value,
          quota: +quota.value,
          kind: kind.value,
          min_transaction: +min_transaction.value || 0,
        }
        if(kind.value === "discount"){
          const data = {
            ...init,
            nominal: +nominal.value,
            percent: null,
            max_discount: null
          }
          listVoucher.push(data)
        }
        if(kind.value === "discount_up_to"){
          const data = {
            ...init,
            nominal: null,
            percent: percent.value,
            max_discount: +max_discount.value
          }
          listVoucher.push(data)
        }
      }
    }

    if(newDataOngkir.length){
      for(let val of newDataOngkir){
        const { code, kind, min_transaction, quota } = val.voucher
        const init = {
          code: code.value,
          quota: +quota.value,
          kind: kind.value,
          min_transaction: +min_transaction.value || 0,
        }
        if(kind.value === "ongkir"){
          const data = {
            ...init,
            nominal: null,
            percent: null,
            max_discount: null
          }
          listVoucher.push(data)
        }
      }
    }
    return listVoucher
  }
  /*FUNCTION FORMATING TO VOUCHER*/

  const onSubmitHandler = e => {
    e.preventDefault()
    let tableIsValid = []
    let tableOngkirIsValid = []
    for(let i = 0; i < dataVoucher.length; i++){
      tableIsValid.push(formTableVoucherIsValid(dataVoucher, setDataVoucher, i))
    }
    for(let i = 0; i < dataFreeShipping.length; i++){
      tableOngkirIsValid.push(formTableOngkirIsValid(dataFreeShipping, setDataFreeShipping, i))
    }
    if(
      formSelectedPromoIsValid(selectedPromo, setSelectedPromo) && 
      formLengthVoucherIsValid(countVoucherLength, setCountVoucherLength, typeVoucher.value) &&
      !isIn("false", tableIsValid) && !isIn("false", tableOngkirIsValid)
    ){
      const data = {
        promo_id: promo_id.value,
        applicable_promo: {
          list_id: getListIdHandler(typeVoucher.value),
          kind: typeVoucher.value
        },
        voucher: formatingVoucher()
      }
      setLoading(true)
      axios.post("/promo-codes/create", data, jsonHeaderHandler())
        .then(res => {
          setLoading(false)
          resetAllData()
          resNotification("success", "Success", res.data.detail)
        })
        .catch(err => {
          setLoading(false)
          const errDetail = err.response.data.detail
          if(errDetail == signature_exp){
            resetAllData()
            resNotification("success", "Success", "Successfully add a new promo-code.")
          }
          if(typeof errDetail === "string" && errDetail !== signature_exp){
            formErrorMessage(errDetail)
          }
          if(typeof errDetail === "object"){
            const stateCountVoucherLength = JSON.parse(JSON.stringify(countVoucherLength))
            const listIndex = errDetail.map(data => data.loc[data.loc.length - 2])
            errDetail.map(data => {
              const key = data.loc[data.loc.length - 1];
              const idx = data.loc[data.loc.length - 2];
              if(key === "promo_id"){
                const state = JSON.parse(JSON.stringify(selectedPromo))
                if(state[key]){
                  state[key].value = state[key].value
                  state[key].isValid = false
                  state[key].message = data.msg
                }
                setSelectedPromo(state)
              }
              if(isIn(key, ["voucher", "list_id"])){
                if(stateCountVoucherLength[key]){
                  stateCountVoucherLength[key].value = stateCountVoucherLength[key].value
                  stateCountVoucherLength[key].isValid = false
                  stateCountVoucherLength[key].message = data.msg
                }
                if(key === "list_id"){
                  stateCountVoucherLength["selected"].value = stateCountVoucherLength["selected"].value
                  stateCountVoucherLength["selected"].isValid = false
                  stateCountVoucherLength["selected"].message = data.msg
                }
                setCountVoucherLength(stateCountVoucherLength)
              }
              if(isIn(key, ["code", "quota", "min_transaction", "nominal", "percent", "max_discount"])){
                const newDataVoucher = [...dataVoucher]
                const newDataOngkir = [...dataFreeShipping]

                if(idx === listIndex[listIndex.length - 1]){
                  if(newDataOngkir.length){
                    newDataOngkir[0]["voucher"][key].value = newDataOngkir[0]["voucher"][key].value
                    newDataOngkir[0]["voucher"][key].isValid = false
                    newDataOngkir[0]["voucher"][key].message = data.msg
                    setDataFreeShipping(newDataOngkir)
                  }
                  else{
                    newDataVoucher[idx]["voucher"][key].value = newDataVoucher[idx]["voucher"][key].value
                    newDataVoucher[idx]["voucher"][key].isValid = false
                    newDataVoucher[idx]["voucher"][key].message = data.msg
                  }
                }
                else{
                  newDataVoucher[idx]["voucher"][key].value = newDataVoucher[idx]["voucher"][key].value
                  newDataVoucher[idx]["voucher"][key].isValid = false
                  newDataVoucher[idx]["voucher"][key].message = data.msg
                }
                setDataVoucher(newDataVoucher)
              }
            })
          }
        })
    }
  }


  useEffect(() => {
    if(searchName.length && listPromoName.length <= 0){
      setNotFound("Hasil tidak ditemukan")
    }
    if(searchName.length <= 0){
      setNotFound("Harap masukkan 1 karakter atau lebih")
    }
  }, [listPromoName])

  useEffect(() => {
    const combineSelected = [...selectedBrand, ...selectedProduct, ...selectedCategory, ...selectedSubCategory, ...selectedItemSubCategory]
    const data = {
      ...countVoucherLength,
      selected: {
        value: combineSelected.length,
        isValid: true, message: null
      }
    }
    setCountVoucherLength(data)
  }, [selectedBrand, selectedProduct, selectedCategory, selectedSubCategory, selectedItemSubCategory])


  return(
    <>
      <Card className="border-0 shadow-sm card-add-product">
        <Card.Body className="p-3 border-bottom">
          <h5 className="mb-0 fs-16-s">Rincian Dasar</h5>
        </Card.Body>
        <Card.Body className="p-3">
          <Form layout="vertical">

            <Form.Item required
              label="Pilih Promo"
              validateStatus={!promo_id.isValid && promo_id.message && "error"}
            >
              <Select
                showSearch
                placeholder="Pilih promo"
                optionFilterProp="children"
                value={promo_id.value}
                onSearch={fetchPromoName}
                defaultActiveFirstOption={false}
                onChange={(_, value) => onSelectPromoId(value)}
                notFoundContent={
                  <p className="text-center mb-2">
                    <i className="fad fa-badge-percent fs-35 text-center d-block my-2" />
                    <span className="text-center">{notFound}</span>
                  </p>
                }
              >
                {listPromoName.map(data => (
                  <Select.Option value={data.id} total_code={data.total_code} key={data.id}>{data.name}</Select.Option>
                ))}
              </Select>
              <ErrorMessage item={promo_id} />
            </Form.Item>

            <Form.Item label="Tipe Voucher" required>
              <Radio.Group value={typeVoucher.value} onChange={selectTypeVoucherHandler}>
                <Radio.Button value={ALL_KIND} label="Produk" className="voucher-radio-button-wrapper noselect">
                  <i className="far fa-lg fa-boxes-alt mr-1" /> Semua Produk
                </Radio.Button>
                <Radio.Button value={SPECIFIC_PRODUCT} label="Produk" className="voucher-radio-button-wrapper noselect">
                  <i className="far fa-lg fa-box-full mr-1" /> Spesifik Produk
                </Radio.Button>
                <Radio.Button value={SPECIFIC_BRAND} label="Brand" className="voucher-radio-button-wrapper noselect">
                  <i className="far fa-lg fa-layer-group mr-1" /> Spesifik Brand
                </Radio.Button>
                <br className="d-none d-md-block" />
                <Radio.Button value={CATEGORY} label="Kategori" className="voucher-radio-button-wrapper noselect">
                  <i className="far fa-lg fa-sitemap mr-1" /> Kategori
                </Radio.Button>
                <Radio.Button value={SUB_CATEGORY} label="Sub Kategori" className="voucher-radio-button-wrapper noselect">
                  <i className="far fa-lg fa-folder-tree mr-1" /> Sub Kategori
                </Radio.Button>
                <Radio.Button value={ITEM_SUB_CATEGORY} label="Item Sub Kategori" className="voucher-radio-button-wrapper noselect">
                  <i className="far fa-lg fa-folder mr-1" /> Item Sub Kategori
                </Radio.Button>
              </Radio.Group>
            </Form.Item>

            <Form.Item label={`${typeVoucher.label} yang Berlaku`} required className="mb-0">
              {typeVoucher.value === ALL_KIND ? 
                <p className="mb-0 mt-n3 noselect">Semua Produk</p> : 
                <>
                <Button with="dashed" type="primary"
                  icon={<PlusCircleOutlined />}
                  onClick={typeVoucher.value === ALL_KIND ? () => {} : () => onShowModalHandler(typeVoucher.value)}
                >
                  Tambahkan {typeVoucher.label}
                </Button>
                <ErrorMessage item={selected} />
                </>
              }
            </Form.Item>

            {selectedProduct.length > 0 && typeVoucher.value === SPECIFIC_PRODUCT && (
              <Table {...tableProps} columns={columnsProduct} dataSource={selectedProduct} />
            )}

            {selectedBrand.length > 0 && typeVoucher.value === SPECIFIC_BRAND && (
              <Table {...tableProps} columns={columnsBrand} dataSource={selectedBrand} />
            )}

            {selectedCategory.length > 0 && typeVoucher.value === CATEGORY && (
              <Table {...tableProps} columns={columnsCategory} dataSource={selectedCategory} />
            )}

            {selectedSubCategory.length > 0 && typeVoucher.value === SUB_CATEGORY && (
              <Table {...tableProps} columns={columnsSubCategory} dataSource={selectedSubCategory} />
            )}

            {selectedItemSubCategory.length > 0 && typeVoucher.value === ITEM_SUB_CATEGORY && (
              <Table {...tableProps} scroll={{ x:700, y:300 }} expandable={{ defaultExpandAllRows: true }} columns={columnsItemSubCategory} dataSource={selectedItemSubCategory} />
            )}

          </Form>
        </Card.Body>
      </Card>



      <Card className="border-0 shadow-sm card-add-product">
        <Card.Body className="p-3 border-bottom">
          <h5 className="mb-0 fs-16-s">Pengaturan Bonus</h5>
          <small className="text-muted">{10 - voucher.value} voucher tersisa</small>
        </Card.Body>

        <Card.Body className="p-3">
          <p className="fs-15 mb-3 w-100 fw-500">
            Voucher Diskon
          </p>
          {dataVoucher.length > 0 && (
            <Table
              pagination={false}
              scroll={{ x: 1000 }}
              components={components}
              dataSource={dataVoucher}
              columns={columnsVouchers}
            />
          )}

          {dataVoucher.length >= 0 && (
            <>
              <ButtonAddVoucher 
                onClick={addVoucherDiscountHandler}
                disabled={voucher.value >= 10 || !Boolean(promo_id.value.length)}
                title={(!Boolean(promo_id.value.length) && tooltipSelectPromoFirst) || (voucher.value >= 10 && tooltipMaximumVoucher)}
              >
                Tambah Voucher Diskon
              </ButtonAddVoucher>
              <span className="fs-14">
                <ErrorMessage item={voucher} />
              </span>
            </>
          )}

          <p className="fs-15 my-3 w-100 fw-500">
            Voucher Gratis Ongkir
          </p>
          {dataFreeShipping.length > 0 && (
            <Table
              pagination={false}
              components={components}
              dataSource={dataFreeShipping}
              columns={columnsShipping}
            />
          )}

          {dataFreeShipping.length >= 0 && dataFreeShipping.length < 1 && (
            <ButtonAddVoucher 
              onClick={addFreeShippingHandler}
              disabled={voucher.value >= 10 || !Boolean(promo_id.value.length)}
              title={(!Boolean(promo_id.value.length) && tooltipSelectPromoFirst) || (voucher.value >= 10 && tooltipMaximumVoucher)}
            >
              Tambah Voucher Gratis Ongkir
            </ButtonAddVoucher>
          )}

        </Card.Body>
      </Card>


      <ProductVoucherModal
        typeVoucher={typeVoucher}
        visible={showProductModal}
        onClose={() => setShowProductModal(false)}
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}
      />

      <BrandVoucherModal
        typeVoucher={typeVoucher}
        visible={showBrandModal}
        onClose={() => setShowBrandModal(false)}
        selectedBrand={selectedBrand}
        setSelectedBrand={setSelectedBrand}
      />

      <CategoryVoucherModal
        typeVoucher={typeVoucher}
        visible={showCategoryModal}
        onClose={() => setShowCategoryModal(false)}
        selectedCategory={selectedCategory}
        setSelectedCategory={setSelectedCategory}
      />

      <SubCategoryVoucherModal
        typeVoucher={typeVoucher}
        visible={showSubCategoryModal}
        onClose={() => setShowSubCategoryModal(false)}
        selectedSubCategory={selectedSubCategory}
        setSelectedSubCategory={setSelectedSubCategory}
      />

      <ItemSubCategoryVoucherModal
        typeVoucher={typeVoucher}
        visible={showItemSubCategoryModal}
        onClose={() => setShowItemSubCategoryModal(false)}
        selectedItemSubCategory={selectedItemSubCategory}
        setSelectedItemSubCategory={setSelectedItemSubCategory}
      />

      <Space>
        <Button className="btn-tridatu" onClick={onSubmitHandler} style={{ width: 80 }} disabled={loading}>
          {loading ? <LoadingOutlined /> : "Simpan"}
        </Button>
        <Button onClick={resetAllData}>Batal</Button>
      </Space>

      <style jsx>{AddStyleAdmin}</style>
      <style jsx>{`
        :global(.voucher-radio-button-wrapper, .voucher-radio-button-wrapper:first-child, .ant-radio-button-wrapper:last-child){
          margin-right: 8px;
          margin-bottom: 8px;
          border-radius: .25rem;
          border-left-width: 1px!important;
          height: auto;
          padding: 5px 15px;
        }
        :global(.ant-radio-button-wrapper:last-child){
          margin-right: 0px;
        }
        :global(.voucher-radio-button-wrapper:hover){
          color: rgba(0, 0, 0, 0.85);
          box-shadow: rgb(49 53 59 / 16%) 0px 2px 6px 0px;
        }
        :global(
          .voucher-radio-button-wrapper:not(:first-child)::before, 
          .voucher-radio-button-wrapper.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled)::before
        ){
          width: 0px;
        }
        :global(.voucher-radio-button-wrapper.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled):focus-within){
          box-shadow: 0 0 0 3px #ff434412;
        }
        :global(.voucher-radio-button-wrapper.ant-radio-button-wrapper-checked:not([class*=' ant-radio-button-wrapper-disabled']).ant-radio-button-wrapper:first-child) {
          border-right-color: #d63031;
        }
        :global(.voucher-radio-button-wrapper.ant-radio-button-wrapper-checked:not(.ant-radio-button-wrapper-disabled)){
          color: #d63031;
          background: #d630310a;
          border-color: #d63031;
        }
        :global(.voucher-radio-button-wrapper.ant-radio-button-wrapper-disabled:hover){
          color: rgba(0, 0, 0, 0.25);
          box-shadow: unset;
        }
      `}</style>
    </>
  )
}

export default withAuth(NewPromo)
