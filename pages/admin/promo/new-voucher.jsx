import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Input, Radio, InputNumber, Select, Table, Space } from 'antd'
import { PlusCircleOutlined } from '@ant-design/icons'

import _ from 'lodash'
import makeid from 'lib/makeid'
import Card from 'react-bootstrap/Card'
import Button from "antd-button-color"

import { imageValidation, uploadButton } from 'lib/imageUploader'
import { columnsVoucher, columnsOngkir, columnsSelectedProduct, columnsSelectedBrand, columnsSelectedCategory } from 'data/voucher'
import { columnsSelectedSubCategory, columnsSelectedItemSubCategory } from 'data/voucher'

// import { productsData } from 'data/products'

import Pagination from 'components/Pagination'
import AddStyleAdmin from 'components/Admin/addStyle'
import EditableCell from 'components/Admin/Voucher/Cell'
import ProductEditableCell from 'components/Admin/Voucher/ProductCell'

import BrandVoucherModal from 'components/Modal/Admin/Vouchers/SetupVoucherBrand'
import ProductVoucherModal from 'components/Modal/Admin/Vouchers/SetupVoucherProduct'
import CategoryVoucherModal from 'components/Modal/Admin/Vouchers/SetupVoucherCategory'
import SubCategoryVoucherModal from 'components/Modal/Admin/Vouchers/SetupVoucherSubCategory'
import ItemSubCategoryVoucherModal from 'components/Modal/Admin/Vouchers/SetupVoucherItemSubCategory'
import {useEffect} from 'react'


const components = { body: { cell: EditableCell } };
const productComponents = { body: { cell: ProductEditableCell } };
const CountChar = ({children}) => <span className="text-muted noselect border-left pl-2 fs-12">{children}</span>

const NOMINAL = "NOMINAL"
// const PERCENT = "PERCENT"

const initialDataVoucher = {
  code: { value: "", isValid: true, message: null },
  claim: { value: "", isValid: true, message: null },
  nominal: { value: "", isValid: true, message: null },
  minimum: { value: 0, isValid: true, message: null },
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

const tableProps = {
  className: "mt-3",
  scroll: { x:700 },
  pagination: {
    pageSize: 5,
    hideOnSinglePage: true,
  },
  components: productComponents
}

const NewPromo = () => {
  const [typeVoucher, setTypeVoucher] = useState({value: "all", label: "Produk"})
  const [dataVoucher, setDataVoucher] = useState([])
  const [dataFreeShipping, setDataFreeShipping] = useState([])

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
      case 'specific_brand':
        return setShowBrandModal(true)
      case 'specific_product':
        return setShowProductModal(true)
      case 'category':
        return setShowCategoryModal(true)
      case 'sub_category':
        return setShowSubCategoryModal(true)
      case 'item_sub_category':
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
                <Select.Option value="jack">Promo prdratih</Select.Option>
                <Select.Option value="lucy">Promo Lumix 1JT</Select.Option>
                <Select.Option value="tom">Promo Gratis Ongkir</Select.Option>
              </Select>
            </Form.Item>

            <Form.Item label="Tipe Voucher" required>
              <Radio.Group value={typeVoucher.value} onChange={selectTypeVoucherHandler}>
                <Radio.Button value="all" label="Produk" className="voucher-radio-button-wrapper noselect">
                  <i className="far fa-lg fa-boxes-alt mr-1" /> Semua Produk
                </Radio.Button>
                <Radio.Button value="specific_product" label="Produk" className="voucher-radio-button-wrapper noselect">
                  <i className="far fa-lg fa-box-full mr-1" /> Spesifik Produk
                </Radio.Button>
                <Radio.Button value="specific_brand" label="Brand" className="voucher-radio-button-wrapper noselect">
                  <i className="far fa-lg fa-layer-group mr-1" /> Spesifik Brand
                </Radio.Button>
                <br/>
                <Radio.Button value="category" label="Kategori" className="voucher-radio-button-wrapper noselect">
                  <i className="far fa-lg fa-sitemap mr-1" /> Kategori
                </Radio.Button>
                <Radio.Button value="sub_category" label="Sub Kategori" className="voucher-radio-button-wrapper noselect">
                  <i className="far fa-lg fa-folder-tree mr-1" /> Sub Kategori
                </Radio.Button>
                <Radio.Button value="item_sub_category" label="Item Sub Kategori" className="voucher-radio-button-wrapper noselect">
                  <i className="far fa-lg fa-folder mr-1" /> Item Sub Kategori
                </Radio.Button>
              </Radio.Group>
            </Form.Item>

            <Form.Item label={`${typeVoucher.label} yang Berlaku`} required className="mb-0">
              {typeVoucher.value === "all" ? 
                <p className="mb-0 mt-n3 noselect">Semua Produk</p> : 
                <Button with="dashed" type="primary"
                  icon={<PlusCircleOutlined />}
                  onClick={typeVoucher.value === "all" ? () => {} : () => onShowModalHandler(typeVoucher.value)}
                >
                  Tambahkan {typeVoucher.label}
                </Button>
              }
            </Form.Item>

            {selectedProduct.length > 0 && typeVoucher.value === "specific_product" && (
              <Table {...tableProps} columns={columnsProduct} dataSource={selectedProduct} />
            )}

            {selectedBrand.length > 0 && typeVoucher.value === "specific_brand" && (
              <Table {...tableProps} columns={columnsBrand} dataSource={selectedBrand} />
            )}

            {selectedCategory.length > 0 && typeVoucher.value === "category" && (
              <Table {...tableProps} columns={columnsCategory} dataSource={selectedCategory} />
            )}

            {selectedSubCategory.length > 0 && typeVoucher.value === "sub_category" && (
              <Table {...tableProps} columns={columnsSubCategory} dataSource={selectedSubCategory} />
            )}

            {selectedItemSubCategory.length > 0 && typeVoucher.value === "item_sub_category" && (
              <Table {...tableProps} scroll={{ x:700, y:300 }} expandable={{ defaultExpandAllRows: true }} columns={columnsItemSubCategory} dataSource={selectedItemSubCategory} />
            )}

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
        <Button className="btn-tridatu">Simpan</Button>
        <Button>Batal</Button>
      </Space>

      <div className="d-none">
        <Pagination />
      </div>

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
