import { useState } from 'react'
import { Form, Input, Radio, InputNumber, Select, Table, Tooltip, Space, Upload, DatePicker } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'

import makeid from 'lib/makeid'
import dynamic from 'next/dynamic'
import Card from 'react-bootstrap/Card'
import Button from "antd-button-color"

import { formImage } from 'formdata/formImage'
import { imageValidation, uploadButton } from 'lib/imageUploader'
import { columnsVoucher, columnsOngkir } from 'data/voucher'

// import { productsData } from 'data/products'

import AddStyleAdmin from 'components/Admin/addStyle'
const Editor = dynamic(import('../../../components/Editor'), { ssr: false })

import EditableCell from 'components/Admin/Voucher/Cell'
import PageInfoPopover from 'components/Admin/Voucher/PageInfoPopover'

import ProductModal from 'components/Modal/Admin/Vouchers/SetupProduct'


const components = { body: { cell: EditableCell } };
const CountChar = ({children}) => <span className="text-muted noselect border-left pl-2 fs-12">{children}</span>

const NOMINAL = "NOMINAL"
const PERCENT = "PERCENT"

const initialDataVoucher = {
  code: { value: "", isValid: true, message: null },
  claim: { value: "", isValid: true, message: null },
  nominal: { value: "", isValid: true, message: null },
  minimum: { value: "", isValid: true, message: null },
  max_discount: { value: "", isValid: true, message: null },
  discount_type: { value: NOMINAL, isValid: true, message: null },
}

const ButtonAddVoucher = ({ onClick, disabled, children }) => (
  <Button
    block with="dashed" 
    type="primary" 
    className="h-35" 
    icon={<PlusCircleOutlined />} 
    onClick={disabled ? () => {} : onClick}
    disabled={disabled}
  >
    {children}
  </Button>
)

const NewPromo = () => {
  const [loading, setLoading] = useState(false)
  const [imageList, setImageList] = useState(formImage)
  const [showProduct, setShowProduct] = useState(false)
  const [typeVoucher, setTypeVoucher] = useState("all")
  const [dataVoucher, setDataVoucher] = useState([])
  const [dataFreeShipping, setDataFreeShipping] = useState([])


  const addVoucherDiscountHandler = () => {
    const data = {
      key: makeid(5),
      voucher : initialDataVoucher
    }
    setDataVoucher([...dataVoucher, data])
  }

  const removeVoucherDiscountHandler = (index) => {
    setDataVoucher(dataVoucher.filter((_, i) => i !== index))
  }

  const addFreeShippingHandler = () => {
    const data = {
      key: makeid(5),
      voucher : initialDataVoucher
    }
    setDataFreeShipping([...dataFreeShipping, data])
  }

  const removeFreeShippingHandler = (index) => {
    setDataFreeShipping(dataFreeShipping.filter((_, i) => i !== index))
  }

  const discountTypeHandler = (val, index) => {
    const newDataVoucher = [...dataVoucher]
    newDataVoucher[index] = {
      ...newDataVoucher[index], 
      voucher: {
        ...newDataVoucher[index].voucher, 
        discount_type: {
          ...newDataVoucher[index].voucher.discount_type,
          value: val 
        }
      }
    }
    setDataVoucher(newDataVoucher)
  }

  const columnsVouchers = columnsVoucher.map(col => {
    if (!col.editable) return col;
    return {
      ...col,
      onCell: (record, index) => ({
        record,
        index: index,
        type: col.type,
        editable: col.editable,
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
        onRemove: () => removeFreeShippingHandler(index)
      })
    }
  })

  const onShowProductHandler = () => {
    setShowProduct(true)
  }

  return(
    <>
      <Card className="border-0 shadow-sm card-add-product">
        <Card.Body className="p-3 border-bottom">
          <h5 className="mb-0 fs-16-s">Rincian Dasar</h5>
        </Card.Body>
        <Card.Body className="p-3">
          <Form layout="vertical">

            <Form.Item label="Pilih Promo" required>
              <Select
                showSearch
                placeholder="Pilih promo"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                <Option value="jack">Promo prdratih</Option>
                <Option value="lucy">Promo Lumix 1JT</Option>
                <Option value="tom">Promo Gratis Ongkir</Option>
              </Select>
            </Form.Item>

            <Form.Item label="Tipe Voucher" required>
              <Radio.Group value={typeVoucher} onChange={e => setTypeVoucher(e.target.value)}>
                <Radio.Button 
                  value="all" 
                  className="voucher-radio-button-wrapper noselect"
                >
                  <i className="far fa-lg fa-boxes-alt mr-1" /> Semua Produk
                </Radio.Button>
                <Radio.Button 
                  value="specific" 
                  className="voucher-radio-button-wrapper noselect"
                >
                  <i className="far fa-lg fa-box-full mr-1" /> Spesifik Produk
                </Radio.Button>
              </Radio.Group>
            </Form.Item>

            <Form.Item label="Produk yang Berlaku" required className="mb-0">
              {typeVoucher === "all" ? 
                <p className="mb-0 mt-n3 noselect">Semua Produk</p> : 
                <Button 
                  with="dashed" 
                  type="primary"
                  icon={<PlusCircleOutlined />}
                  onClick={typeVoucher !== "specific" ? () => {} : onShowProductHandler}
                >
                  Tambahkan produk
                </Button>
              }
            </Form.Item>

          </Form>
        </Card.Body>
      </Card>



      <Card className="border-0 shadow-sm card-add-product">
        <Card.Body className="p-3 border-bottom">
          <h5 className="mb-0 fs-16-s">Pengaturan Bonus</h5>
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

          {dataVoucher.length >= 0 && ((dataFreeShipping.length + dataVoucher.length) < 10) && (
            <ButtonAddVoucher 
              onClick={addVoucherDiscountHandler}
              disabled={(dataFreeShipping.length + dataVoucher.length) >= 10}
            >
              Tambah Voucher Diskon
            </ButtonAddVoucher>
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
              disabled={(dataFreeShipping.length + dataVoucher.length) >= 10}
            >
              Tambah Voucher Gratis Ongkir
            </ButtonAddVoucher>
          )}

          <Form layout="vertical" className="mt-5 d-none">
            <Form.Item label="Jenis Voucher" required>
              <Radio.Group defaultValue="potongan">
                <Radio value="diskon" className="mr-2">Diskon</Radio>
                <Radio value="gratis_ongkir">Gratis Ongkir</Radio>
              </Radio.Group>
            </Form.Item>

            <Form.Item label="Kode Voucher" required>
              <Input placeholder="Kode Voucher" suffix={<CountChar>0/10</CountChar>} />
              <small className="form-text text-left text-muted">
                Kode voucher mengandung Alfabet (A-Z) dan Angka (0-9)
              </small>
            </Form.Item>

            <Form.Item label="Kuota Klaim" required>
              <div>
                <InputNumber
                  placeholder="Kuota Klaim"
                  className="w-100 h-33-custom-input fs-12 input-number-variant"
                />
                <small className="form-text text-left text-muted">
                  Jumlah voucher dapat diklaim pengguna
                </small>
              </div>
            </Form.Item>

            <Form.Item label="Nominal" required>
              <div>
                <div className="ant-input-group-wrapper">
                  <div className="ant-input-wrapper ant-input-group input-group-variant" style={{ zIndex: 1 }}>
                    <span className={`ant-input-group-addon noselect fs-12 bg-transparent`}>Rp</span>
                    <InputNumber
                      placeholder="Nominal Diskon"
                      className="w-100 bor-left-rad-0 h-33-custom-input fs-12 input-number-variant"
                      formatter={value => `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, '.')}
                      parser={value => value.replace(/\Rp\s?|(\.*)/g, '')}
                    />
                  </div>
                </div>
                {/* <ErrorMessage item={record.product[type]} /> */}
              </div>
            </Form.Item>

            <Form.Item label="Minimum Transaksi" required>
              <div>
                <div className="ant-input-group-wrapper">
                  <div className="ant-input-wrapper ant-input-group input-group-variant" style={{ zIndex: 1 }}>
                    <span className={`ant-input-group-addon noselect fs-12 bg-transparent`}>Rp</span>
                    <InputNumber
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

          </Form>
        </Card.Body>
      </Card>






      {/*
      <Card className="border-0 shadow-sm card-add-product">
        <Card.Body className="p-3 border-bottom">
          <h5 className="mb-0 fs-16-s">Pengaturan Media</h5>
        </Card.Body>
        <Card.Body className="p-3">
          <Form layout="vertical">

            <Form.Item label="Foto Thumbnail Card Voucher (600 × 328 px)" className="mb-2" required>
              <Upload
                accept="image/*"
                listType="picture-card"
                className="avatar-uploader"
                fileList={imageList.file.value}
                beforeUpload={(file) => imageValidation(file, "www.google.com", "avatar", "formHeader")}
              >
                {imageList.file.value.length >= 1 ? null : uploadButton(loading)}
              </Upload>
            </Form.Item>

            <Form.Item label="Foto Detail Voucher (1275 × 320 px)" className="mb-0" required>
              <Upload
                accept="image/*"
                listType="picture-card"
                className="avatar-uploader"
                fileList={imageList.file.value}
                beforeUpload={(file) => imageValidation(file, "www.google.com", "avatar", "formHeader")}
              >
                {imageList.file.value.length >= 1 ? null : uploadButton(loading)}
              </Upload>
            </Form.Item>

          </Form>
        </Card.Body>
      </Card>
      */}

      <ProductModal 
        visible={showProduct}
        onClose={() => setShowProduct(false)}
      />

      <Space>
        <Button className="btn-tridatu">Simpan</Button>
        <Button>Batal</Button>
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

export default NewPromo
