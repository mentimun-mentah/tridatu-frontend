import { useState, useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux";
import { Form, Input, InputNumber, Tooltip } from 'antd'
import { AnimatePresence, motion } from "framer-motion";

import _ from 'lodash'
import isIn from 'validator/lib/isIn'
import axios, { jsonHeaderHandler, formHeaderHandler, resNotification, signature_exp } from 'lib/axios'

import { formImage, formImageIsValid } from 'formdata/formImage'
import { imagePreview, uploadButton } from 'lib/imageUploader'
import { imageValidationProduct, multipleImageValidation } from 'lib/imageProductUploader'
import { ongoing, will_come } from 'components/Card/Admin/Product/Promo/statusType'
import { formItemLayout } from 'data/productsAdmin'
import { countDiscPrice } from 'lib/utility'

import ErrorTooltip from "components/ErrorMessage/Tooltip";
import formatNumber from "lib/formatNumber"

const NoVariant = ({ noVariant, onNoVariantChangeHandler, isActiveGrosir, discountStatus }) => {

  const { activeGrosir } = isActiveGrosir
  const { va1_price, va1_stock, va1_code, va1_barcode, va1_discount, va1_discount_active: activeDiscount } = noVariant

  const checkStatusDiscountNoVariant = () => {
    return activeDiscount.value && isIn(discountStatus, [ongoing, will_come])
  }

  return(
    <>
      <Form layout="vertical" {...formItemLayout}>
        <Form.Item 
          required
          label="Harga" 
          validateStatus={(!activeGrosir || !checkStatusDiscountNoVariant()) && !va1_price.isValid && va1_price.message && "error"}
        >
          <div className="ant-input-group-wrapper">
            <div className="ant-input-wrapper ant-input-group">
              <span className="ant-input-group-addon noselect">Rp</span>
              <InputNumber
                min={1}
                name="va1_price"
                disabled={activeGrosir || checkStatusDiscountNoVariant()}
                readOnly={activeGrosir || checkStatusDiscountNoVariant()}
                className="w-100 bor-left-rad-0 h-33-custom-input"
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                parser={value => value.replace(/\Rp\s?|(\.*)/g, '')}
                value={va1_price.value}
                onChange={(activeGrosir || checkStatusDiscountNoVariant()) ? () => {} : e => onNoVariantChangeHandler(e, "va1_price")}
              />
            </div>
          </div>
          {!activeGrosir && <ErrorTooltip item={va1_price} /> }
        </Form.Item>

        {checkStatusDiscountNoVariant() && (
          <Form.Item label="Harga Sale">
            <div className="border noselect p-2 bor-rad-25rem">
              <div className="price-sale w-100">
                <span>Rp.{formatNumber(countDiscPrice(va1_discount.value, va1_price.value))}</span>
                <span className="ml-2 fs-12 text-muted">{va1_discount.value}% DISKON</span>
                <Tooltip 
                  title={<span className="text-dark fs-13 text-nowrap noselect">Produk ini sedang dalam masa promosi</span>} 
                  color="#fff"
                >
                  <span className="ml-1 fs-12 text-muted"><i className="far fa-info-circle" /></span>
                </Tooltip>
              </div>
              <div className="price-sale">
                <small className="form-text text-left text-muted">
                  Harga tidak dapat dimodifikasi ketika promosi sedang berlangsung.
                </small>
              </div>
            </div>
          </Form.Item>
        )}

        <Form.Item 
          required
          label="Stok" 
          validateStatus={!va1_stock.isValid && va1_stock.message && "error"}
        >
          <InputNumber 
            min={0} 
            name="va1_stock"
            placeholder="Jumlah Stok"
            className="w-100 h-33-custom-input" 
            value={va1_stock.value}
            onChange={e => onNoVariantChangeHandler(e, "va1_stock")}
          />
          <ErrorTooltip item={va1_stock} />
        </Form.Item>

        <Form.Item 
          label="Kode Variasi"
          validateStatus={!va1_code.isValid && va1_code.message && "error"}
        >
          <Input 
            className="h-35" 
            name="va1_code"
            placeholder="Kode Variasi" 
            value={va1_code.value}
            onChange={e => onNoVariantChangeHandler(e)}
          />
          <ErrorTooltip item={va1_code} />
        </Form.Item>

        <Form.Item 
          label="Barcode" 
          className="mb-4"
          validateStatus={!va1_barcode.isValid && va1_barcode.message && "error"}
        >
          <Input 
            className="h-35" 
            name="va1_barcode"
            placeholder="Barcode" 
            value={va1_barcode.value}
            onChange={e => onNoVariantChangeHandler(e)}
          />
          <ErrorTooltip item={va1_barcode} />
        </Form.Item>

      </Form>

      <style jsx>{`
        .price-sale{
          line-height: 1;
        }
      `}</style>
    </>
  )
}

export default NoVariant
