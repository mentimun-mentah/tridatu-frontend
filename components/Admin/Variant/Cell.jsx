import { useContext, useState, useEffect, useRef } from 'react'
import { Input, InputNumber, Form, Tooltip } from 'antd'
import { countDiscPrice } from 'lib/utility'
import { ongoing, will_come } from 'components/Card/Admin/Product/Promo/statusType'

import isIn from 'validator/lib/isIn'
import formatNumber from "lib/formatNumber"
import ErrorTooltip from "components/ErrorMessage/Tooltip";

const EditableCell = ({
  title,
  editable,
  children,
  dataIndex,
  record,
  handleSave,
  inputType,
  currentRowValues,
  onChange,
  index,
  onBlur,
  maxCode,
  disabled,
  discountStatus,
  t,
  ...restProps
}) => {

  let childNode = children;

  if (editable) {
    const initProps = {
      onChange: onChange,
      value: record[inputType].value,
      onBlur: onBlur,
    }

    const propsTextArea = {
      ...initProps,
      autoSize: true,
      className: "h-30 fs-12 input-code-variant",
      bordered: false,
      style: { resize: "none" },
      maxLength: maxCode,
    }

    childNode = (
      <Form>
        {inputType === "price" && (
          <>
            {isIn(discountStatus, [ongoing, will_come]) && record.discount_active.value ? (
              <div className="text-muted fs-12 noselect">
                <p className="mb-0">
                  Rp.{formatNumber(countDiscPrice(record.discount.value, record[inputType].value))}
                  <Tooltip color="#fff"
                    title={<span className="text-dark fs-13 text-nowrap">{t.sales_information.no_variant.sale_text}</span>} 
                  >
                    <span className="ml-1 text-muted"><i className="far fa-info-circle" /></span>
                  </Tooltip>
                </p>
                <p className="mb-0">
                  <s>Rp.{formatNumber(record[inputType].value)}</s>
                </p>
                <p className="mb-0">
                  {record.discount.value}% {t.sales_information.no_variant.discount}
                </p>
              </div>
            ) : (
              <Form.Item 
                name="price" 
                className="mb-0 h-30 input-form-variant"
              >
                <div>
                <div className="ant-input-group-wrapper">
                  <div className="ant-input-wrapper ant-input-group input-group-variant" style={{ zIndex: 1 }}>
                    <span className={`ant-input-group-addon noselect fs-12 ${disabled ? "disabled-input-price" : "bg-transparent"}`}>Rp</span>
                    <InputNumber
                      {...initProps}
                      min={1}
                      name="price"
                      placeholder={t.sales_information.variant.placeholder.price}
                      disabled={disabled}
                      readOnly={disabled}
                      className="w-100 bor-left-rad-0 h-33-custom-input fs-12 input-number-variant"
                      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                      parser={value => value.replace(/\Rp\s?|(\.*)/g, '')}
                    />
                  </div>
                </div>
                <ErrorTooltip item={record[inputType]} />
                </div>
              </Form.Item>
            )}
          </>
        )}
        {inputType === "stock" && (
          <Form.Item 
            name="stock"
            className="mb-0 h-30 input-form-variant"
          >
            <div>
              <InputNumber 
                {...initProps}
                min={0} 
                name="stock"
                placeholder={t.sales_information.variant.placeholder.stock}
                className="w-100 fs-12 input-number-variant"
              />
              <ErrorTooltip item={record[inputType]} />
            </div>
          </Form.Item>
        )}
        {inputType === "code" && (
          <Form.Item className="mb-0" name="code">
            <div>
              <Input.TextArea 
                {...propsTextArea}
                name="code" 
                placeholder={t.sales_information.variant.code} 
              />
              <ErrorTooltip item={record[inputType]} />
            </div>
          </Form.Item>
        )}
        {inputType === "barcode" && (
          <Form.Item className="mb-0" name="barcode">
            <div>
              <Input.TextArea 
                {...propsTextArea}
                name="barcode" 
                placeholder={t.sales_information.variant.barcode} 
              />
              <ErrorTooltip item={record[inputType]} />
            </div>
          </Form.Item>
        )}
      </Form>
    ) 
  }

  return (
    <>
      <td {...restProps} className="p-2 td-input-variant">{childNode}</td>
      <style jsx>{`
        :global(.input-group-variant > .ant-input-group-addon){
          border-left: 0 !important;
          border-top: 0 !important;
          border-bottom: 0 !important;
          border-right: 1px solid #f0f0f0;
          padding: 5px;
          padding-right: 8px;
          color: #6c757d;
        }
        :global(.disabled-input-price){
          background-color: #f5f5f5 !important;
          color: #bfbfbf !important;
        }
        :global(.input-number-variant){
          border: 0 !important;
        }
        :global(.input-number-variant > .ant-input-number-handler-wrap){
          display: none !important;
        }
        :global(.input-number-variant .ant-input-number-input::-webkit-input-placeholder, .input-number-variant .ant-input-number-input, .input-code-variant){
          text-align: center;
        }
        :global(.input-code-variant){
          line-height: 23px !important;
        }
        :global(.input-code-variant::-webkit-input-placeholder){
          text-align: center;
          line-height: 2.2 !important;
        }
        :global(.input-code-variant:focus){
          box-shadow: none !important;
        }
        :global(.ant-form-item-explain-error, .ant-form-item-extra, .ant-form-item-explain){
          display: contents;
          height: 0!important;
          min-height: 0!important;
          transition: none !important;
        }
        :global(.input-form-variant.ant-form-item-has-error .ant-input-number:focus, .input-form-variant.ant-form-item-has-error .ant-input-number-focused){
          box-shadow: none !important;
        }
      `}</style>
    </>
  )
};

export default EditableCell 
