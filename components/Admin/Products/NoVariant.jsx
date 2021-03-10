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

const NoVariant = ({ t, noVariant, onNoVariantChangeHandler, isActiveGrosir, discountStatus }) => {

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
          label={t.sales_information.no_variant.price}
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
          <Form.Item label={t.sales_information.no_variant.sale_price}>
            <div className="border noselect p-2 bor-rad-25rem">
              <div className="price-sale w-100">
                <span>Rp.{formatNumber(countDiscPrice(va1_discount.value, va1_price.value))}</span>
                <span className="ml-2 fs-12 text-muted">{va1_discount.value}% {t.sales_information.no_variant.discount}</span>
                <Tooltip 
                  title={<span className="text-dark fs-13 text-nowrap noselect">{t.sales_information.no_variant.sale_text}</span>} 
                  color="#fff"
                  overlayClassName="ant-tooltip-width"
                >
                  <span className="ml-1 fs-12 text-muted"><i className="far fa-info-circle" /></span>
                </Tooltip>
              </div>
              <div className="price-sale">
                <small className="form-text text-left text-muted">
                  {t.sales_information.no_variant.sale_info}
                </small>
              </div>
            </div>
          </Form.Item>
        )}

        <Form.Item 
          required
          label={t.sales_information.no_variant.stock}
          validateStatus={!va1_stock.isValid && va1_stock.message && "error"}
        >
          <InputNumber 
            min={0} 
            name="va1_stock"
            placeholder={t.sales_information.no_variant.placeholder.stock}
            className="w-100 h-33-custom-input" 
            value={va1_stock.value}
            onChange={e => onNoVariantChangeHandler(e, "va1_stock")}
          />
          <ErrorTooltip item={va1_stock} />
        </Form.Item>

        <Form.Item 
          label={t.sales_information.no_variant.variant_code}
          validateStatus={!va1_code.isValid && va1_code.message && "error"}
        >
          <Input 
            className="h-35" 
            name="va1_code"
            placeholder={t.sales_information.no_variant.variant_code}
            value={va1_code.value}
            onChange={e => onNoVariantChangeHandler(e)}
          />
          <ErrorTooltip item={va1_code} />
        </Form.Item>

        <Form.Item 
          label={t.sales_information.no_variant.barcode} 
          className="mb-4"
          validateStatus={!va1_barcode.isValid && va1_barcode.message && "error"}
        >
          <Input 
            className="h-35" 
            name="va1_barcode"
            placeholder={t.sales_information.no_variant.barcode}
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
        :global(.ant-tooltip-width .ant-tooltip-inner){
          width: fit-content;
        }
      `}</style>
    </>
  )
}

export default NoVariant
