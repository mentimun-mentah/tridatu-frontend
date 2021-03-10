import { useContext, useState, useEffect, useRef } from 'react'
import { Input, InputNumber, Form, Select } from 'antd'

const CountChar = ({children}) => <span className="text-muted noselect border-left pl-2 fs-12">{children}</span>

const NOMINAL = "NOMINAL"
const PERCENT = "PERCENT"

const VoucherCellEditable = ({ index, record, editable, onRemove, discountTypeHandler, type, children, ...restProps }) => {
  let childNode = children
  const disabled = record.voucher.discount_type.value === NOMINAL

  if(editable){
    const { voucher } = record
    childNode = (
      <Form>
        {type === "code" && (
          <Form.Item name="code" className="mb-0">
            <div>
              <Input placeholder="Kode Voucher" value={voucher[type].value} suffix={<CountChar>0/10</CountChar>} />
            </div>
          </Form.Item>
        )}
        {type === "kuota" && (
          <Form.Item name="kuota" className="mb-0" required>
            <div>
              <InputNumber
                value={voucher["claim"].value}
                placeholder="Kuota Klaim"
                className="w-100 h-33-custom-input fs-12 input-number-variant"
              />
            </div>
          </Form.Item>
        )}
        {type === "nominal" && (
          <Form.Item name="nominal" className="mb-0" required>
            <div>
              <div className="ant-input-group-wrapper">
                <div className="ant-input-wrapper ant-input-group input-group-variant" style={{ zIndex: 1 }}>
                  <span className={`ant-input-group-addon noselect fs-12 bg-transparent`}>
                    <Select 
                      value={record.voucher.discount_type.value} 
                      onChange={discountTypeHandler} 
                    >
                      <Select.Option value={NOMINAL}><span className="fs-12">Rp</span></Select.Option>
                      <Select.Option value={PERCENT}>%</Select.Option>
                    </Select>
                  </span>
                  <InputNumber
                    value={voucher[type].value}
                    placeholder={disabled ? "Nominal Diskon" : "Persentase Diskon"}
                    className="w-100 bor-left-rad-0 h-33-custom-input fs-12 input-number-variant"
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                    parser={value => value.replace(/\Rp\s?|(\.*)/g, '')}
                  />
                </div>
              </div>
              {/* <ErrorMessage item={record.product[type]} /> */}
            </div>
          </Form.Item>
        )}
        {type === "minimum" && (
          <Form.Item name="minimum" className="mb-0" required>
            <div>
              <div className="ant-input-group-wrapper">
                <div className="ant-input-wrapper ant-input-group input-group-variant" style={{ zIndex: 1 }}>
                  <span className={`ant-input-group-addon noselect fs-12 bg-transparent`}>Rp</span>
                  <InputNumber
                    value={voucher[type].value}
                    placeholder="Minimum Transaksi"
                    className="w-100 bor-left-rad-0 h-33-custom-input fs-12 input-number-variant"
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                    parser={value => value.replace(/\Rp\s?|(\.*)/g, '')}
                  />
                </div>
              </div>
              {/* <ErrorMessage item={record.product[type]} /> */}
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
                    disabled={disabled}
                    placeholder="Maximum Diskon"
                    className="w-100 bor-left-rad-0 h-33-custom-input fs-12 input-number-variant"
                    formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                    parser={value => value.replace(/\Rp\s?|(\.*)/g, '')}
                  />
                </div>
              </div>
              {/* <ErrorMessage item={record.product[type]} /> */}
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
