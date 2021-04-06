import { useContext, useState, useEffect, useRef } from 'react'
import { Input, InputNumber, Form, Select } from 'antd'

import ErrorTooltip from "components/ErrorMessage/Tooltip"

const CountChar = ({children}) => <span className="text-muted noselect border-left pl-2 fs-12">{children}</span>

const DISCOUNT = "discount"
const PERCENT = "discount_up_to"

const VoucherCellEditable = ({ index, record, editable, onBlur, onChange, onRemove, discountTypeHandler, type, children, ...restProps }) => {
  let childNode = children
  const disabled = record.voucher.kind.value === DISCOUNT

  if(editable){
    childNode = (
      <Form>
        {type === "code" && (
          <Form.Item name="code" className="mb-0">
            <div>
              <Input 
                maxLength={10}
                onBlur={onBlur}
                onChange={onChange}
                placeholder="Kode Voucher" 
                value={record.voucher[type].value}
                suffix={<CountChar>{record.voucher[type].value.length}/10</CountChar>} 
              />
              <ErrorTooltip item={record.voucher[type]} />
            </div>
          </Form.Item>
        )}
        {type === "quota" && (
          <Form.Item name="kuota" className="mb-0" required>
            <div>
              <InputNumber
                min={1}
                max={10000000}
                onBlur={onBlur}
                onChange={onChange}
                placeholder="Kuota Klaim"
                value={record.voucher[type].value}
                className="w-100 h-33-custom-input fs-12 input-number-variant"
                formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                parser={value => value.replace(/\Rp\s?|(\.*)/g, '')}
              />
              <ErrorTooltip item={record.voucher[type]} />
            </div>
          </Form.Item>
        )}
        {type === "nominal-percent" && (
          <Form.Item name="nominal-percent" className="mb-0" required>
            <div>
              <div className="ant-input-group-wrapper">
                <div className="ant-input-wrapper ant-input-group input-group-variant" style={{ zIndex: 1 }}>
                  <span className={`ant-input-group-addon noselect fs-12 bg-transparent`}>
                    <Select 
                      onChange={discountTypeHandler} 
                      value={record.voucher.kind.value} 
                    >
                      <Select.Option value={DISCOUNT}><span className="fs-12">Rp</span></Select.Option>
                      <Select.Option value={PERCENT}>%</Select.Option>
                    </Select>
                  </span>
                  <InputNumber
                    min={1}
                    onBlur={onBlur}
                    onChange={onChange}
                    step={disabled ? 1 : 0.1}
                    max={!disabled ? 95 : 10000000}
                    value={record.voucher[disabled ? 'nominal' : 'percent'].value}
                    placeholder={disabled ? "Nominal Diskon" : "Persentase Diskon"}
                    className="w-100 bor-left-rad-0 h-33-custom-input fs-12 input-number-variant"
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                    parser={value => value.replace(/\Rp\s?|(\.*)/g, '')}
                  />
                </div>
              </div>
              <ErrorTooltip item={record.voucher[disabled ? 'nominal' : 'percent']} />
            </div>
          </Form.Item>
        )}
        {type === "min_transaction" && (
          <Form.Item name="min_transaction" className="mb-0" required>
            <div>
              <div className="ant-input-group-wrapper">
                <div className="ant-input-wrapper ant-input-group input-group-variant" style={{ zIndex: 1 }}>
                  <span className={`ant-input-group-addon noselect fs-12 bg-transparent`}>Rp</span>
                  <InputNumber
                    min={0}
                    max={10000000}
                    onBlur={onBlur}
                    onChange={onChange}
                    placeholder="Minimum Transaksi"
                    value={record.voucher[type].value}
                    className="w-100 bor-left-rad-0 h-33-custom-input fs-12 input-number-variant"
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                    parser={value => value.replace(/\Rp\s?|(\.*)/g, '')}
                  />
                </div>
              </div>
              <ErrorTooltip item={record.voucher[type]} />
            </div>
          </Form.Item>
        )}
        {type === "max_discount" && (
          <Form.Item name="max_discount" className="mb-0" required>
            <div>
              <div className="ant-input-group-wrapper">
                <div className="ant-input-wrapper ant-input-group input-group-variant" style={{ zIndex: 1 }}>
                  <span 
                    className={`ant-input-group-addon noselect fs-12 ${disabled ? "disabled-input-price" : "bg-transparent"}`}>Rp</span>
                  <InputNumber
                    max={100000000}
                    onBlur={onBlur}
                    disabled={disabled}
                    onChange={onChange}
                    placeholder="Maximum Diskon"
                    value={record.voucher[type].value}
                    className="w-100 bor-left-rad-0 h-33-custom-input fs-12 input-number-variant"
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                    parser={value => value.replace(/\Rp\s?|(\.*)/g, '')}
                  />
                </div>
              </div>
              <ErrorTooltip item={record.voucher[type]} />
            </div>
          </Form.Item>
        )}
        {type === "action" && (
          <a onClick={onRemove}><i className="fal fa-trash-alt text-center" /></a>
        )}
      </Form>
    )
  }
  
  return (
    <>
      <td {...restProps} className="p-2">{childNode}</td>
      <style jsx>{`
        :global(.disabled-input-price){
          background-color: #f5f5f5 !important;
          color: #bfbfbf !important;
        }
      `}</style>
    </>
  )
}

export default VoucherCellEditable
