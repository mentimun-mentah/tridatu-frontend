import { useState, useEffect } from 'react'
import { DatePicker, Table, Modal, Form, Row, Col } from 'antd'
import { useDispatch } from "react-redux";

import { useRouter } from 'next/router';
import { formItemLayout } from 'data/productsAdmin'
import { countDiscPrice, disabledDate, disabledRangeTime } from 'lib/utility'
import { columnsProductVariant, columnsProductNoVariant } from 'data/discount'
import { initialValue, formPeriod, formPeriodIsValid, formTablePromoIsValid } from 'formdata/formDiscount'
import { not_active, will_come, ongoing } from 'components/Card/Admin/Product/Promo/statusType'

import axios, { jsonHeaderHandler, resNotification, formErrorMessage, signature_exp } from 'lib/axios'

import * as actions from "store/actions";
import moment from 'moment'
import makeid from 'lib/makeid'
import isIn from 'validator/lib/isIn'
import Button from "antd-button-color"

import ErrorMessage from "components/ErrorMessage";
import EditableCell from 'components/Card/Admin/Product/Promo/ModalCell'

const components = { body: { cell: EditableCell } };

const DiscountModal = ({ t, visible, onClose, discount, productId, discountStatus }) => {
  if(!visible && !discount && !products_variant) return null

  const { products_name, products_variant, products_discount_start, products_discount_end } = discount
  const router = useRouter()
  const dispatch = useDispatch()

  const [dataSource, setDataSource] = useState([])
  const [isDateDisable, setIsDateDisable] = useState([false, false])
  const [periode, setPeriode] = useState(formPeriod)
  const [columns, setColumns] = useState(columnsProductVariant(t))
  const [countVariant, setCountVariant] = useState(0)

  const { start, end } = periode

  useEffect(() => {
    if(discount && products_variant){
      const { va1_name, va2_name, va1_items } = products_variant

      /* NO VARIANT DATA */
      if(va1_items && !va1_name && !va2_name){ 
        let variants = []
        for(let [key, item] of Object.entries(va1_items)){
          const data = {
            va1_key: +key,
            va_option: item.va1_option,
            normal_price: item.va1_price,
            stock: item.va1_stock,
            price: { ...initialValue, value: countDiscPrice(item.va1_discount, item.va1_price) },
            discount: { ...initialValue, value: item.va1_discount },
            discount_active: { ...initialValue, value: item.va1_discount_active }
          }
          variants.push({ key: +key, product: data })
        }
        setDataSource(variants)
        setColumns(columnsProductNoVariant(t))
        setCountVariant(0)
      }

      /* ONLY ONE VARIANT DATA */
      if(va1_name && va1_items && !va2_name){
        let variants = []
        for(let [key, item] of Object.entries(va1_items)){
          const data = {
            va1_key: +key,
            va_option: item.va1_option,
            normal_price: item.va1_price,
            stock: item.va1_stock,
            price: { ...initialValue, value: countDiscPrice(item.va1_discount, item.va1_price) },
            discount: { ...initialValue, value: item.va1_discount },
            discount_active: { ...initialValue, value: item.va1_discount_active }
          }
          variants.push({ key: +key, product: data })
        }
        setDataSource(variants)
        setColumns(columnsProductVariant(t))
        setCountVariant(1)
      }

      if(va2_name){
        let variants = []
        for(let [key1, item1] of Object.entries(va1_items)){
          let variant_tmp = []
          for(let [key2, item2] of Object.entries(item1.va2_items)){
            const data = {
              va1_key: +key1,
              va2_key: +key2,
              va_option: item1.va1_option+", "+item2.va2_option,
              normal_price: item2.va2_price,
              stock: item2.va2_stock,
              price: { ...initialValue, value: countDiscPrice(item2.va2_discount, item2.va2_price) },
              discount: { ...initialValue, value: item2.va2_discount },
              discount_active: { ...initialValue, value: item2.va2_discount_active }
            }
            variant_tmp.push(data)
          }
          for(let item of variant_tmp){
            variants.push({ key: makeid(10), product: item })
          }
        }
        setDataSource(variants)
        setColumns(columnsProductVariant(t))
        setCountVariant(2)
      }
    }

    // initial periode time for setup discount
    if(isIn(not_active, [discountStatus])){
      const start = moment().add(15, "minutes").format("DD MMM YYYY HH:mm")
      const data = {
        ...periode,
        start: { value: start, isValid: true, message: null },
        end: { value: moment(start).add(1, "hours").format("DD MMM YYYY HH:mm"), isValid: true, message: null },
      }
      setPeriode(data)
    }
    if(isIn(ongoing, [discountStatus])){
      setIsDateDisable([true, false])
    } else {
      setIsDateDisable([false, false])
    }

    if(products_discount_start && products_discount_end){
      const data = {
        ...periode,
        start: { value: moment(products_discount_start).format("DD MMM YYYY HH:mm"), isValid: true, message: null },
        end: { value: moment(products_discount_end).format("DD MMM YYYY HH:mm"), isValid: true, message: null },
      }
      setPeriode(data)
    }

  }, [discount])

  const onTableChange = (e, item, index, normal_price) => {
    const newData = [...dataSource]
    if(item === "price"){
      newData[index]["product"]["price"].value = e
      newData[index]["product"]["price"].isValid = true
      newData[index]["product"]["price"].message = null

      newData[index]["product"]["discount"].value = 100 - Math.round(((e/normal_price) * 100))
      newData[index]["product"]["discount"].isValid = true
      newData[index]["product"]["discount"].message = null
    }
    if(item === "discount"){
      newData[index]["product"]["discount"].value = e || 0
      newData[index]["product"]["discount"].isValid = true
      newData[index]["product"]["discount"].message = null

      newData[index]["product"]["price"].value = countDiscPrice(e, normal_price)
      newData[index]["product"]["price"].isValid = true
      newData[index]["product"]["price"].message = null
    }
    if(item === "discount_active"){
      newData[index]["product"]["discount_active"].value = e
      newData[index]["product"]["discount_active"].isValid = true
      newData[index]["product"]["discount_active"].message = null

      if(e === false){
        newData[index]["product"]["discount"].isValid = true
        newData[index]["product"]["discount"].message = null

        newData[index]["product"]["price"].isValid = true
        newData[index]["product"]["price"].message = null
      }
    }
    setDataSource(newData)
  }

  const dateChange = (_, dateStrings) => {
    let startVal = isIn(ongoing, [discountStatus]) ? moment(products_discount_start) : dateStrings[0]
    let endVal = dateStrings[1]

    if(!isIn(ongoing, [discountStatus]) && moment(startVal) <= moment()) startVal = moment().add(15, "minute")
    if(moment(endVal) <= moment()) endVal = moment(startVal).add(1, "hour")

    const data = {
      ...periode,
      start: { value: startVal, isValid: true, message: null },
      end: { value: endVal, isValid: true, message: null },
    }
    setPeriode(data)
  }

  const onOkDateChange = (date) => {
    let startVal = isIn(ongoing, [discountStatus]) ? moment(products_discount_start) : date[0] || ""
    let endVal = date[1] || ""

    if(!isIn(ongoing, [discountStatus]) && moment(startVal) <= moment()) startVal = moment().add(15, "minute")
    if(moment(endVal) <= moment()) endVal = moment(startVal).add(1, "hour")

    const data = {
      ...periode,
      start: { value: startVal, isValid: true, message: null },
      end: { value: endVal, isValid: true, message: null },
    }
    setPeriode(data)
  }

  const columnsProduct = columns.map(col => {
    if (!col.editable) return col;
    return {
      ...col,
      onCell: (record, index) => ({
        record,
        index: index,
        type: col.type,
        editable: col.editable,
        onChange: e => onTableChange(e, col.type, index, record.product.normal_price),
        onBlur: () => formTablePromoIsValid(dataSource, setDataSource, index, t),
        t: t
      })
    }
  })

  const nonActiveDiscountHandler = e => {
    let queryString = router.query
    e.preventDefault()
    axios.delete(`/discounts/non-active/${productId}`, jsonHeaderHandler())
      .then(res => {
        const resDetail = res.data.detail
        const notFound = ["Product not found!", "Produk tidak ditemukan!"]

        if(isIn(resDetail, notFound)){
          resNotification("error", "Error", resDetail)
        } else {
          dispatch(actions.getDiscount({ ...queryString }))
          resNotification("success", "Success", resDetail)
          onClose()
        }
      })
      .catch(err => {
        const errDetail = err.response.data.detail;
        if(errDetail == signature_exp){
          dispatch(actions.getDiscount({ ...queryString }))
          resNotification("success", "Success", t.success_response_inactive)
          onClose()
        } else {
          if(typeof(errDetail) === "string" && errDetail !== signature_exp) {
            resNotification("error", "Error", errDetail)
          }
        }
      })
  }

  const onSubmitPromo = ticket_variant => {
    let queryString = router.query
    if(formPeriodIsValid(periode, setPeriode, discountStatus, products_discount_start, t)){
      const data = {
        product_id: productId,
        ticket_variant: ticket_variant,
        discount_start: moment(start.value).format("DD MMM YYYY HH:mm"),
        discount_end: moment(end.value).format("DD MMM YYYY HH:mm")
      }

      let url = "/discounts/update"
      let method = "put"
      let resMsg = t.success_response_update
      if(isIn(not_active, [discountStatus])) { 
        url = "/discounts/create"
        method = "post"
        resMsg = t.success_response_set
      }

      axios[method](url, data, jsonHeaderHandler())
        .then(res => {
          dispatch(actions.getDiscount({ ...queryString }))
          resNotification("success", "Success", res.data.detail)
          onClose()
        })
        .catch(err => {
          const errDetail = err.response.data.detail;
          const errStartTime = ["The new start time must be after the set start time.", "Waktu mulai baru harus setelah waktu mulai yang ditetapkan."]
          if(errDetail == signature_exp){
            dispatch(actions.getDiscount({ ...queryString }))
            resNotification("success", "Success", resMsg)
            onClose()
          } else if(typeof errDetail === "string" && !isIn(errDetail, errStartTime)){
            formErrorMessage(errDetail)
          } else if(typeof errDetail === "string" && isIn(errDetail, errStartTime)){
            const state = JSON.parse(JSON.stringify(periode))
            state.start.isValid = false
            state.start.message = errDetail
            setPeriode(state)
          }
          else {
            const state = JSON.parse(JSON.stringify(periode))
            errDetail.map(data => {
              const key = data.loc[data.loc.length - 1].split("_")[1];
              if(isIn(key, ["start", "end"])){
                state.start.isValid = false
                state.start.message = data.msg
              }
            })
            setPeriode(state)
          }
        })
    }
  }

  const onSubmitVariant = e => {
    e.preventDefault()

    let tableIsValid = []
    for(let i = 0; i < dataSource.length; i++){
      tableIsValid.push(formTablePromoIsValid(dataSource, setDataSource, i, t))
    }

    if(!isIn("false", tableIsValid) && formPeriodIsValid(periode, setPeriode, discountStatus, products_discount_start, t)){
      const productVariant = {...products_variant}
      const newVariant = dataSource.map(x => x.product)
      const { va2_name, va1_items } = productVariant

      for(let [idx, obj] of Object.entries(va1_items)){
        obj.va1_discount = newVariant[idx].discount.value
        obj.va1_discount_active = newVariant[idx].discount_active.value
        if(va2_name){
          delete obj.va1_discount
          delete obj.va1_discount_active
          for(let [_, obj2] of Object.entries(obj.va2_items)){
            for(let [i, val] of Object.entries(newVariant)){
              let option = val.va_option.split(", ")
              if(option[0] === obj.va1_option && option[1] === obj2.va2_option){
                obj2.va2_discount = newVariant[i].discount.value
                obj2.va2_discount_active = newVariant[i].discount_active.value
              } else {
                delete obj.va2_discount
                delete obj.va2_discount_active
              }
            }
          }
        }
      }

      axios.post("/variants/create-ticket", productVariant, jsonHeaderHandler())
        .then(res => {
          onSubmitPromo(res.data.ticket)
        })
        .catch(err => {
          const errDetail = err.response.data.detail;
          if(errDetail == signature_exp){
            axios.post("/variants/create-ticket", productVariant, jsonHeaderHandler())
              .then(res => {
                onSubmitPromo(res.data.ticket)
              })
              .catch(() => {})
          }
          else if(typeof errDetail === "string" && errDetail !== signature_exp){
            formErrorMessage(errDetail)
          }
          else{
            errDetail.map(data => {
              const key = data.loc[data.loc.length - 1];
              const idx = data.loc[data.loc.length - 2];
              if(countVariant == 1 || countVariant == 0){
                const newData = [...dataSource]
                if(isIn(key, ["va1_discount"])){
                  newData[idx]["product"]["discount"].isValid = false;
                  newData[idx]["product"]["discount"].message = data.msg;
                }
                if(isIn(key, ["va1_discount_active"])){
                  newData[idx]["product"]["discount_active"].isValid = false;
                  newData[idx]["product"]["discount_active"].message = data.msg;
                }
                setDataSource(newData)
              } 
              if(countVariant == 2){
                const newData = [...dataSource]
                const newVariant = dataSource.map(x => x.product)
                const va1_idx = data.loc[2]
                for(let [i, val] of Object.entries(newVariant)){
                  if(val.va1_key === va1_idx && val.va1_key === idx){
                    if(isIn(key, ["va2_discount"])){
                      newData[i]["product"]["discount"].isValid = false;
                      newData[i]["product"]["discount"].message = data.msg;
                    }
                    if(isIn(key, ["va2_discount_active"])){
                      newData[i]["product"]["discount_active"].isValid = false;
                      newData[i]["product"]["discount_active"].message = data.msg;
                    }
                    setDataSource(newData)
                  }
                }

              }
            })
          } // else
        })
    }
  }

  let buttonActions = [
    <Button key="back" onClick={onClose}>
      {t.modal.close}
    </Button>,
    <Button key="submit" type="primary" className="btn-tridatu" onClick={onSubmitVariant}>
      {t.modal.save}
    </Button>,
  ]

  if(isIn(discountStatus, [ongoing, will_come])){
    buttonActions.unshift(
      <Button key="cancel" className="float-left text-danger fw-500" onClick={nonActiveDiscountHandler}>
        <i className="fas fa-times mr-1" /> {t.modal.deactivate_discount}
      </Button>
    )
  }

  return(
    <>
      <Modal centered width={1000} 
        zIndex={3000} visible={visible}
        title={false} closable={false}
        onOk={onClose} onCancel={onClose}
        maskClosable={false}
        footer={buttonActions}
      >
        <Row gutter={[0,0]}>
          <Col lg={12} md={24} xs={24}>
            <h5 className="mb-3 fs-16 text-truncate">{t.set_discount} - {products_name}</h5>
          </Col>
        </Row>
        <Table 
          pagination={false} 
          scroll={{ x: 800, y: 500 }}
          components={components}
          dataSource={dataSource} 
          columns={columnsProduct} 
        />

        <h5 className="my-3 fs-16">{t.periode}</h5>

        <Form layout="vertical" {...formItemLayout} className="mb-0">
          <Form.Item
            name="DatePicker"
            validateStatus={!start.isValid && start.message && "error"}
            className="mb-0"
          >
            <div>
              <DatePicker.RangePicker 
                showTime 
                inputReadOnly
                format="DD MMM YYYY HH:mm"
                onChange={dateChange}
                onOk={onOkDateChange}
                disabled={isDateDisable}
                disabledTime={(current, type) => disabledRangeTime(current, type, start.value)}
                disabledDate={(current, start) => disabledDate(current, start, products_discount_start)}
                value={[start.value !== "" && moment(start.value), end.value !== "" && moment(end.value)]}
                onBlur={() => formPeriodIsValid(periode, setPeriode, discountStatus, products_discount_start, t)}
              /> 
              <span className="ml-2">WITA</span>
              {start.isValid ? (
                <small className="form-text text-left text-muted">
                  {t.modal.periode_note}
                </small>
              ) : (
                <ErrorMessage item={start} />
              )}
            </div>
          </Form.Item>
        </Form>

      </Modal>
    </>
  )
}

export default DiscountModal 
