import { useState, useEffect } from 'react'
import { Form, Modal, Space, Row, Col, InputNumber, Alert } from 'antd'
import { useSelector, useDispatch } from "react-redux";
import { AnimatePresence, motion } from "framer-motion";
import { PlusCircleOutlined } from '@ant-design/icons'

import _ from 'lodash'
import isIn from 'validator/lib/isIn'
import Card from 'react-bootstrap/Card'
import Button from "antd-button-color"
import axios, { jsonHeaderHandler, formHeaderHandler, resNotification, signature_exp } from 'lib/axios'
import ErrorTooltip from "components/ErrorMessage/Tooltip";

import { formItemLayout } from 'data/productsAdmin'
import { formImage, formImageIsValid } from 'formdata/formImage'
import { imagePreview, uploadButton } from 'lib/imageUploader'
import { ongoing, will_come } from 'components/Card/Admin/Product/Promo/statusType'
import { imageValidationProduct, multipleImageValidation } from 'lib/imageProductUploader'

import { priceMessage, priceSmallerMessage, price50SmallerMessage, priceSmallerBefore } from 'formdata/formGrosir.js'
import { validateFormGrosirPrice, validateFormGrosirQty } from 'formdata/formGrosir.js'

const Grosir = ({ 
  isActiveVariation, isActiveGrosir, setIsActiveGrosir, grosirPrice, setGrosirPrice, dataSource, setDataSource, 
  noVariant, onNoVariantChangeHandler, grosir, setGrosir, discountStatus
}) => {
  const [showModal, setShowModal] = useState(false)

  const { price } = grosirPrice
  const { va1_price, va1_discount_active: activeDiscount } = noVariant
  const { active, countVariation } = isActiveVariation
  const { activeGrosir, countGrosir } = isActiveGrosir

  const addGrosirHandler = () => {
    const initGrosirData = { min_qty: {value: "", isValid: true, message: null}, price: {value: "", isValid: true, message: null} }
    setGrosir(grosir => [...grosir, initGrosirData])
    if(countGrosir < 5) setIsActiveGrosir({ countGrosir: countGrosir + 1, activeGrosir: true })
  }

  const activeGrosirHandler = () => {
    if(active) setShowModal(true)
    else addGrosirHandler()
  }

  const deleteGrosirHandler = (idx) => {
    setGrosir(grosir.filter((_, i) => i !== idx))
    if(countGrosir == 1){
      setIsActiveGrosir({ activeGrosir: false, countGrosir: countGrosir - 1 })
      setGrosirPrice({ price: { value: "", isValid: true, message: null } })
      setGrosir([])

    } else {
      setIsActiveGrosir({ activeGrosir: true, countGrosir: countGrosir - 1 })
    }
  }

  const onPriceChangeHandler = (e) => {
    if(e < 1 || e === "" || e == null || typeof e == "string") {
      const dataPrice = {
        ...grosirPrice,
        price: { value: 1, isValid: false, message: priceMessage }
      }
      setGrosirPrice(dataPrice)
    } else {
      const dataPrice = {
        ...grosirPrice,
        price: { value: e, isValid: true, message: null }
      }
      setGrosirPrice(dataPrice)
    }
  }

  const onGrosirChangeHandler = (idx, item) => e => {
    let newGrosir = [... grosir]
    const checkPrice = active ? price.value : va1_price.value
    const initialPrice = Math.round(checkPrice/2)

    if(item == "min_qty"){
      newGrosir[idx][item].value = e
      newGrosir[idx][item].isValid = true
      newGrosir[idx][item].message = null
      if(idx == 0 && e < 2){
        newGrosir[idx][item].value = e
        newGrosir[idx][item].isValid = false
        newGrosir[idx][item].message = "Min Qty untuk grosir harus lebih dari 1"
      }
      if(idx > 0){
        const befrItemVal = newGrosir[idx - 1][item].value
        if(e <= befrItemVal){
          newGrosir[idx][item].value = e
          newGrosir[idx][item].isValid = false
          newGrosir[idx][item].message = "Min Qty harus lebih besar dari sebelumnya"
        }

      } // idx > 0
    }

    if(item == "price"){
      newGrosir[idx][item].value = e
      newGrosir[idx][item].isValid = true
      newGrosir[idx][item].message = null
      if(e >= checkPrice){
        newGrosir[idx][item].value = e
        newGrosir[idx][item].isValid = false
        newGrosir[idx][item].message = priceSmallerMessage
      }
      if(e < initialPrice){
        newGrosir[idx][item].value = e
        newGrosir[idx][item].isValid = false
        newGrosir[idx][item].message = price50SmallerMessage
      }
      if(idx > 0){
        const befrItemVal = newGrosir[idx - 1][item].value
        if(e >= befrItemVal){
          newGrosir[idx][item].value = e
          newGrosir[idx][item].isValid = false
          newGrosir[idx][item].message = priceSmallerBefore
        }
        if(newGrosir[idx + 1]){
          const nextItemVal = newGrosir[idx + 1][item].value
          if(nextItemVal !== "" && e >= nextItemVal && e < befrItemVal){
            newGrosir[idx][item].value = e
            newGrosir[idx + 1][item].isValid = false
            newGrosir[idx + 1][item].message = priceSmallerBefore
          }
          if(nextItemVal !== "" && e >= nextItemVal && e >= befrItemVal){
            newGrosir[idx][item].value = e
            newGrosir[idx][item].isValid = false
            newGrosir[idx][item].message = priceSmallerBefore
          }
        }
      } // idx > 0
    }
    setGrosir(newGrosir)
  }

  const confirmModalHandler = () => {
    addGrosirHandler()
    setShowModal(false)
  }

  useEffect(() => {
    // function for change price when set all is clicked and price column is empty
    if(active && activeGrosir){
      console.log("kesini ya?")
      const copyDataSource = [...dataSource]
      if(copyDataSource[0] && copyDataSource[0].price && copyDataSource[0].price.value){
        setGrosirPrice({ price: copyDataSource[0].price })
      }
    }
  }, [activeGrosir, dataSource])

  useEffect(() => {
    // this function is for checking the price of variant when the variant has some discount and
    // when the price is same and grosir will active and so on
    const isPriceSame = _.map(dataSource, obj => obj.price.value)
    const checkIsActiveDiscount = _.map(dataSource, obj => obj.discount_active.value.toString())
    if(_.uniqBy(isPriceSame).length > 1 && activeGrosir && isIn("true", checkIsActiveDiscount)){
      setIsActiveGrosir({ ...isActiveGrosir, activeGrosir: false })
      console.log("masuk check sini")
    } 
    if(_.uniqBy(isPriceSame).length < 2 && countGrosir > 0){
      setIsActiveGrosir({ ...isActiveGrosir, activeGrosir: true})
      console.log("masuk check sini 2")
    } 
  // }, [dataSource]) // for auto update when price is different to same in modal
  }, [countGrosir, price, dataSource])

  useEffect(() => {
    // function for changing all price in data source from input grosir price
    if(active && activeGrosir){
      const copyDataSource = [...dataSource]
      if(copyDataSource[0] && copyDataSource[0].key){
        copyDataSource.map(obj => {
          if(obj.discount_active.value){
            console.log("true discount_active")
            obj.price = { value: obj.price.value, isValid: true, message: null }
          } else {
            console.log("false discount_active")
            obj.price = { value: price.value ? price.value : copyDataSource[0].price.value, isValid: true, message: null }
          }
          return obj
        })
        // setDataSource(copyDataSource) //check again
      }
    }
  }, [price, activeGrosir, active, dataSource])

  useEffect(() => {
    if(active && !activeGrosir){
      console.log("masuk sini ketika tidak aktif")
      const copyDataSource = [...dataSource]
      if(copyDataSource[0].key){
        copyDataSource.map(obj => {
          if(obj.discount_active.value){
            obj.price = { value: obj.price.value, isValid: true, message: null }
          } else {
            obj.price = { value: price.value ? price.value : copyDataSource[0].price.value, isValid: true, message: null }
          }
          return obj
        })
        countVariation !== 1 && setDataSource(copyDataSource) 
        // klo di comment variasi 2 paling bawah ke set value ke initial 
        // klo ga dikomen pas lagi diskon ga keset valuenya && lagi active grosir && hanya di 1 variant 
        // klo ga di komen pas add new produk dan aktif 1 variasi grosir tidak bisa aktif
      }
    }
  }, [price, activeGrosir])

  useEffect(() => {
    if(activeGrosir){
      validateFormGrosirPrice(grosir, setGrosir, price, va1_price, active)
    }
  }, [noVariant, price, va1_price, activeGrosir])

  const isValidButton = () => {
    let checkMinQty = grosir.map(x => x.min_qty.isValid)
    let checkPrice = grosir.map(x => x.price.isValid)
    let checkMinQtyVal = grosir.map(x => x.min_qty.value)
    let checkPriceVal = grosir.map(x => x.price.value)
    return (isIn("false", checkMinQty.concat(checkPrice)) || isIn("", checkMinQtyVal.concat(checkPriceVal)))
  }

  const RenderGrosirButton = () => {
    const ButtonGrosirComponent = ({ disabled }) => (
      <Button
        disabled={disabled}
        block with="dashed" type="primary" 
        className="h-35" icon={<PlusCircleOutlined />}
        onClick={disabled ? () => {} : activeGrosirHandler}
      >
        Tambah Harga Grosir
      </Button>
    )

    const checkDifferencePrice = _.uniqBy(dataSource, obj => obj.price.value)
    const checkIsActiveDiscount = _.map(dataSource, obj => obj.discount_active.value.toString())

    if(checkDifferencePrice && checkDifferencePrice.length > 1 && isIn("true", checkIsActiveDiscount)){
      return <ButtonGrosirComponent disabled={true} />
    }
    else {
      return <ButtonGrosirComponent disabled={false} />
    }
  }

  const checkIsActiveDiscountVariant = _.map(dataSource, obj => obj.discount_active.value.toString())

  const checkStatusDiscountVariant = () => {
    return isIn("true", checkIsActiveDiscountVariant) && isIn(discountStatus, [ongoing, will_come])
  }

  const checkStatusDiscountNoVariant = () => {
    return activeDiscount.value && isIn(discountStatus, [ongoing, will_come])
  }

  return(
    <>
      {!activeGrosir ? (
        <Form layout="vertical" {...formItemLayout} className="mt-4">
          <Form.Item label="Grosir">
            <Card.Body className="p-0 pb-1">
              <RenderGrosirButton />
              {/* <Button */}
              {/*   block with="dashed" type="primary" */} 
              {/*   className="h-35" icon={<PlusCircleOutlined />} */}
              {/*   onClick={activeGrosirHandler} */}
              {/* > */}
              {/*   Tambah Harga Grosir */}
              {/* </Button> */}
            </Card.Body>
          </Form.Item>
        </Form>
      ) : (
        <>
          <p className="m-t-24 fs-14 mb-2 w-100">Grosir</p>

          <Card.Body className="p-3 bg-light mb-3 bor-rad-5px">
            {active && (
              <Alert banner showIcon 
                type="info" className="mb-2 shadow-sm bor-rad-5px"
                message="Semua harga variasi otomatis mengikuti harga utama jika produk memiliki harga grosir." 
              />
            )}

            <Form layout="vertical" {...formItemLayout} className="mb-4">
              {active ? (
                <Form.Item 
                  required
                  label="Harga Utama"
                  validateStatus={!price.isValid && price.message && "error"}
                >
                  <div className="ant-input-group-wrapper">
                    <div className="ant-input-wrapper ant-input-group">
                      <span className="ant-input-group-addon noselect">Rp</span>
                      <InputNumber
                        min={1}
                        disabled={checkStatusDiscountVariant()}
                        readOnly={checkStatusDiscountVariant()}
                        className="w-100 bor-left-rad-0 h-33-custom-input"
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                        parser={value => value.replace(/\Rp\s?|(\.*)/g, '')}
                        value={price.value}
                        onChange={checkStatusDiscountVariant() ? () => {} : onPriceChangeHandler}
                        // onChange={onPriceChangeHandler}
                      />
                    </div>
                  </div>
                  <ErrorTooltip item={price} />
                  {price.isValid && checkStatusDiscountVariant() && (
                    <small className="form-text text-left text-muted">
                      Harga tidak dapat dimodifikasi ketika promosi sedang berlangsung.
                    </small>
                  )}
                </Form.Item>
              ) : (
                <Form.Item 
                  required
                  label="Harga Utama"
                  validateStatus={!checkStatusDiscountNoVariant() && !va1_price.isValid && va1_price.message && "error"}
                >
                  <div className="ant-input-group-wrapper">
                    <div className="ant-input-wrapper ant-input-group">
                      <span className="ant-input-group-addon noselect">Rp</span>
                      <InputNumber
                        min={1}
                        disabled={checkStatusDiscountNoVariant()}
                        readOnly={checkStatusDiscountNoVariant()}
                        className="w-100 bor-left-rad-0 h-33-custom-input"
                        formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                        parser={value => value.replace(/\Rp\s?|(\.*)/g, '')}
                        value={va1_price.value}
                        onChange={checkStatusDiscountNoVariant() ? () => {} : e => onNoVariantChangeHandler(e, "va1_price")}
                        // onChange={e => onNoVariantChangeHandler(e, "va1_price")}
                      />
                    </div>
                  </div>
                  <ErrorTooltip item={va1_price} />
                  {va1_price.isValid && checkStatusDiscountNoVariant() && (
                    <small className="form-text text-left text-muted">
                      Harga tidak dapat dimodifikasi ketika promosi sedang berlangsung.
                    </small>
                  )}
                </Form.Item>
              )}
            </Form>

            <Row gutter={[{ xs: 8, sm: 8, md: 16 }, 0]} align="middle">
              <Col xs={10} sm={10} md={10} lg={10} xl={10}>
                <p className="fs-14 mb-2 w-100">Jumlah Min.</p>
              </Col>
              <Col xs={12} sm={12} md={12} lg={12} xl={12} offset={1}>
                <p className="fs-14 mb-2 w-100">Harga Satuan</p>
              </Col>
            </Row>

            {[...Array(countGrosir)].map((_, i) => (
              <Row gutter={[{ xs: 8, sm: 8, md: 16 }, 16]} align="middle" key={i} className="row-grosir">
                <Col xs={10} sm={10} md={10} lg={10} xl={10}>
                  <Form layout="vertical" {...formItemLayout}>
                    <Form.Item 
                      name={`min_qty_${i}`}
                      className="mb-0"
                      validateStatus={!grosir[i].min_qty.isValid && grosir[i].min_qty.message && "error"}
                    >
                      <div>
                        <div className="ant-input-group-wrapper">
                          <div className="ant-input-wrapper ant-input-group">
                            <span className="ant-input-group-addon noselect">≥</span>
                            <InputNumber
                              min={0}
                              className="w-100 bor-left-rad-0 h-33-custom-input"
                              value={grosir[i].min_qty.value} 
                              onChange={onGrosirChangeHandler(i, "min_qty")}
                              onBlur={() => validateFormGrosirQty(grosir, setGrosir)}
                              onFocus={() => validateFormGrosirQty(grosir, setGrosir)}
                            />
                          </div>
                        </div>
                        <ErrorTooltip item={grosir[i].min_qty} />
                      </div>
                    </Form.Item>
                  </Form>
                </Col>

                <Col xs={1} sm={1} md={1} lg={1} xl={1} className="text-center noselect">
                  <p className="fs-14 mb-2 w-100">=</p>
                </Col>

                <Col xs={12} sm={12} md={12} lg={12} xl={12}>
                  <Form layout="vertical" {...formItemLayout}>
                    <Form.Item 
                      name={`price_${i}`}
                      className="mb-0"
                      validateStatus={!grosir[i].price.isValid && grosir[i].price.message && "error"}
                    >
                      <div>
                        <div className="ant-input-group-wrapper">
                          <div className="ant-input-wrapper ant-input-group">
                            <span className="ant-input-group-addon noselect">Rp</span>
                            <InputNumber
                              min={1}
                              className="w-100 bor-left-rad-0 h-33-custom-input"
                              formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                              parser={value => value.replace(/\Rp\s?|(\.*)/g, '')}
                              value={grosir[i].price.value}
                              onChange={onGrosirChangeHandler(i, "price")}
                              onBlur={() => validateFormGrosirPrice(grosir, setGrosir, price, va1_price, active)}
                              onFocus={() => validateFormGrosirPrice(grosir, setGrosir, price, va1_price, active)}
                            />
                          </div>
                        </div>
                        <ErrorTooltip item={grosir[i].price} />
                      </div>
                    </Form.Item>
                  </Form>
                </Col>

                <Col xs={1} sm={1} md={1} lg={1} xl={1} className="px-1">
                  <i className="fal fa-trash-alt hover-pointer text-secondary" onClick={() => deleteGrosirHandler(i)} />
                </Col>
              </Row>
            ))}

            {countGrosir < 5 && (
              <Form.Item className="my-1">
                <Button
                  block with="dashed" type="primary" 
                  className="h-35" icon={<PlusCircleOutlined />}
                  onClick={addGrosirHandler}
                  disabled={isValidButton()}
                >
                  Tambah Harga Grosir
                </Button>
              </Form.Item>
            )}
            
          </Card.Body>
        </>
      )}


      <Modal
        centered
        visible={showModal}
        zIndex={3000}
        width={416}
        closable={false}
        footer={null}
        className="modal-rad-10 text-center"
      >
        <div className="text-dark">
          <h5 className="mb-3">Tambah Harga Grosir</h5>
          <p className="text-black-50">
            Semua harga variasi otomatis mengikuti harga produk pertama jika produk memiliki harga grosir. Lanjutkan?
          </p>

          <Space>
            <Button onClick={() => setShowModal(false)}>Tidak</Button>
            <Button type="primary" onClick={confirmModalHandler}>Ya</Button>
          </Space>
        </div>
      </Modal>

      <style jsx>{`
      :global(.row-grosir:last-child){
          margin-bottom: 0px !important;
        }
      `}</style>

    </>
  )
}

export default Grosir
