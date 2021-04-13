import { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Form, Input, Radio, InputNumber, Select, Table, Space, Card as CardAnt, Row, Col, Divider } from 'antd'
import { PlusCircleOutlined, SettingOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'

import _ from 'lodash'
import makeid from 'lib/makeid'
import formatNumber from 'lib/formatNumber'
import Card from 'react-bootstrap/Card'
import Button from "antd-button-color"

import { imageValidation, uploadButton } from 'lib/imageUploader'
import { columnsVoucher, columnsVoucherUpdate, columnsOngkir, columnsOngkirUpdate, columnsSelectedProduct, columnsSelectedBrand, columnsSelectedCategory } from 'data/voucher'
import { columnsSelectedSubCategory, columnsSelectedItemSubCategory } from 'data/voucher'

// import { productsData } from 'data/products'

import Pagination from 'components/Pagination'
import AddStyleAdmin from 'components/Admin/addStyle'
import EditableCell from 'components/Admin/Voucher/CellUpdatePromo'
import ProductEditableCell from 'components/Admin/Voucher/ProductCell'

import BrandVoucherModal from 'components/Modal/Admin/Update/Vouchers/SetupVoucherBrand'
import ProductVoucherModal from 'components/Modal/Admin/Update/Vouchers/SetupVoucherProduct'
import CategoryVoucherModal from 'components/Modal/Admin/Update/Vouchers/SetupVoucherCategory'
import SubCategoryVoucherModal from 'components/Modal/Admin/Update/Vouchers/SetupVoucherSubCategory'
import ItemSubCategoryVoucherModal from 'components/Modal/Admin/Update/Vouchers/SetupVoucherItemSubCategory'
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

const dataVoucherUpdate = [
  {
    key: "9eK9l",
    voucher: {
      code: { value: "", isValid: true, message: null },
      claim: { value: "", isValid: true, message: null },
      nominal: { value: "", isValid: true, message: null },
      minimum: { value: 0, isValid: true, message: null },
      max_discount: { value: "", isValid: true, message: null },
      discount_type: { value: "NOMINAL", isValid: true, message: null },
    },
  }
];

const dataShippingUpdate = [
  {
    key: "AFjZF",
    voucher: {
      code: { value: "", isValid: true, message: null },
      claim: { value: "", isValid: true, message: null },
      nominal: { value: "", isValid: true, message: null },
      minimum: { value: 0, isValid: true, message: null },
      max_discount: { value: "", isValid: true, message: null },
      discount_type: { value: "NOMINAL", isValid: true, message: null },
    },
  },
];

const sp1 = [
  {
    key: "23",
    products: {
      products_id: "23",
      products_name: "BAJU KAOS DEUS EX MACHINA COMBED'S PREMIUM",
      products_slug: "baju-kaos-deus-ex-machina-combed-s-premium",
      products_image_product: "0342dec78b514d04a31180d22e464cbb.jpeg",
      products_live: true,
      products_love: false,
      products_wholesale: true,
      products_discount_status: "not_active",
      products_created_at: "2021-03-10T15:47:16.766994",
      products_updated_at: "2021-03-10T15:47:31.249121",
      variants_min_price: "270000",
      variants_max_price: "270000",
      variants_discount: 0,
      stock: 30,
    },
  },
];

const sp2 = [
  {
    key: "20",
    products: {
      products_id: "20",
      products_name: "Blouse asuka kotak",
      products_slug: "blouse-asuka-kotak",
      products_image_product: "7b0ba9113f1b40368ea0ef65875d3ceb.jpeg",
      products_live: true,
      products_love: false,
      products_wholesale: false,
      products_discount_status: "not_active",
      products_created_at: "2021-03-10T15:47:03.557804",
      products_updated_at: "2021-03-10T15:47:29.686861",
      variants_min_price: "100000",
      variants_max_price: "100000",
      variants_discount: 0,
      stock: 30,
    },
  },
];

const sp3 = [
  {
    key: "14",
    products: {
      products_id: "14",
      products_name: "Variant 1 - DAYA DRESS",
      products_slug: "variant-1-daya-dress",
      products_image_product: "cdaf1f3055ef413fb593b1ae6ab97ec3.jpeg",
      products_live: true,
      products_love: false,
      products_wholesale: false,
      products_discount_status: "not_active",
      products_created_at: "2021-03-10T15:46:41.986916",
      products_updated_at: "2021-03-10T15:47:26.540311",
      variants_min_price: "155000",
      variants_max_price: "155000",
      variants_discount: 0,
      stock: 30,
    },
  },
];

const dataSourcePromoCode = [
  {
    key: '1',
    promoCode: {
      value: 'vd1',
      kuota: 100,
      kind: 'Diskon',
      code: 'MIROUTER44',
      min_transaction: 100000,
      applicable_promo: 'Spesifik Produk'
    }
  },
  {
    key: '2',
    promoCode: {
      value: 'vd2',
      kuota: 150,
      kind: 'Diskon',
      code: 'MISECCAM24',
      min_transaction: 150000,
      applicable_promo: 'Spesifik Produk'
    }
  },
  {
    key: '3',
    promoCode: {
      value: 'freeship',
      kuota: 200,
      kind: 'Free Ongkir',
      code: 'MIFREEONGKIR',
      min_transaction: 275000,
      applicable_promo: 'Spesifik Produk'
    }
  },
];

const columnsPromoCode = (setState) => [
  {
    key: 'code',
    dataIndex: 'promoCode',
    title: 'Kode',
    render: item => <span>{item.code}</span>
  },
  {
    key: 'kuota',
    dataIndex: 'promoCode',
    title: 'Kuota',
    render: (item) => <span>{item.kuota}</span>
  },
  {
    key: 'min_transaction',
    dataIndex: 'promoCode',
    title: 'Min. Transaksi',
    render: (item) => <span>Rp.{formatNumber(item.min_transaction)}</span>
  },
  {
    key: 'kind',
    dataIndex: 'promoCode',
    title: 'Jenis',
    render: (item) => <span>{item.kind}</span> // discount, discount_up_to, ongkir
  },
  {
    key: 'applicable_promo',
    dataIndex: 'promoCode',
    title: 'Promo Berlaku',
    render: () => <span>Spesifik Produk</span> // all | specific_product | specific_brand | category | sub_category | item_sub_category
  },
  {
    key: 'actions',
    dataIndex: 'promoCode',
    title: 'Aksi',
    align: 'center',
    render: (item) => (
      <Space>
        <Button type="primary" ghost icon={<EditOutlined />} onClick={() => setState(item.value)}>
          Edit
        </Button>
        <Button className="btn-tridatu" icon={<DeleteOutlined />}>
          Delete
        </Button>
      </Space>
    )
  }
]


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

const promoCodeList = [
  {code: "MIROUTER44", key: "vd1"},
  {code: "MISECCAM24", key: "vd2"},
  {code: "MIFREEONGKIR", key: "freeship"},
]

const UpdateVoucher = () => {
  const [typeVoucher, setTypeVoucher] = useState({value: "all", label: "Produk"})
  const [dataVoucher, setDataVoucher] = useState(dataVoucherUpdate)
  const [dataFreeShipping, setDataFreeShipping] = useState(dataShippingUpdate)

  /*MODAL VOUCHER*/
  const [showBrandModal, setShowBrandModal] = useState(false)
  const [showProductModal, setShowProductModal] = useState(false)
  const [showCategoryModal, setShowCategoryModal] = useState(false)
  const [showSubCategoryModal, setShowSubCategoryModal] = useState(false)
  const [showItemSubCategoryModal, setShowItemSubCategoryModal] = useState(false)

  const [selectedPromo, setSelectedPromo] = useState("")
  const [selectedBrand, setSelectedBrand] = useState([])
  const [selectedProduct, setSelectedProduct] = useState([])
  const [selectedCategory, setSelectedCategory] = useState([])
  const [selectedSubCategory, setSelectedSubCategory] = useState([])
  const [selectedItemSubCategory, setSelectedItemSubCategory] = useState([])
  const [listPromoCode, setListPromoCode] = useState(promoCodeList)
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

  const columnsVouchers = columnsVoucherUpdate.map(col => {
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

  const columnsShipping = columnsOngkirUpdate.map(col => {
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
    // setSelectedProduct([])
    setSelectedCategory([])
    setSelectedSubCategory([])
    setSelectedItemSubCategory([])
  }, [typeVoucher])

  useEffect(() => {
    if(selectedPromo === "vd1"){
      const data = {
        key: "9eK9l",
        voucher: {
          code: { value: "MIROUTER44", isValid: true, message: null },
          claim: { value: 50, isValid: true, message: null },
          nominal: { value: 50000, isValid: true, message: null },
          minimum: { value: 100000, isValid: true, message: null },
          max_discount: { value: "", isValid: true, message: null },
          discount_type: { value: "NOMINAL", isValid: true, message: null },
        },
      }
      setDataVoucher([data])
      setSelectedProduct(sp1)
      setTypeVoucher({ value: "specific_product", label: "Produk" })
    }
    if(selectedPromo === "vd2"){
      const data = {
        key: "9eK9l",
        voucher: {
          code: { value: "MISECCAM2K", isValid: true, message: null },
          claim: { value: 100, isValid: true, message: null },
          nominal: { value: 50000, isValid: true, message: null },
          minimum: { value: 100000, isValid: true, message: null },
          max_discount: { value: "", isValid: true, message: null },
          discount_type: { value: "NOMINAL", isValid: true, message: null },
        },
      }
      setDataVoucher([data])
      setSelectedProduct(sp2)
      setTypeVoucher({ value: "specific_product", label: "Produk" })
    }
    if(selectedPromo === "freeship"){
      const data = {
        key: "9eK9l",
        voucher: {
          code: { value: "MIFREEONGKIR", isValid: true, message: null },
          claim: { value: 250, isValid: true, message: null },
          nominal: { value: 50000, isValid: true, message: null },
          minimum: { value: 230000, isValid: true, message: null },
          max_discount: { value: "", isValid: true, message: null },
          discount_type: { value: "NOMINAL", isValid: true, message: null },
        },
      }
      setDataFreeShipping([data])
      setSelectedProduct(sp3)
      setTypeVoucher({ value: "specific_product", label: "Produk" })
    }
    
  }, [selectedPromo])

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
                disabled
                showSearch
                value="jack"
                placeholder="Pilih promo"
                optionFilterProp="children"
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                <Select.Option value="jack">Beli Xiaomi Terbaru Hematnya Gak Pake Tanggung! Cashback s.d Rp50 Ribu</Select.Option>
              </Select>
            </Form.Item>

            {/*
            <Form.Item label="Pilih Kode Promo" required>
              <Select
                showSearch
                placeholder="Pilih kode promo"
                optionFilterProp="children"
                value={selectedPromo}
                onChange={val => setSelectedPromo(val)}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
              >
                <Select.Option value="vd1">MIROUTER44</Select.Option>
                <Select.Option value="vd2">MISECCAM24</Select.Option>
                <Select.Option value="freeship">MIFREEONGKIR</Select.Option>
              </Select>
            </Form.Item>
            */}

            <Form.Item label="Daftar Kode Promo">
              <Table 
                pagination={false}
                columns={columnsPromoCode(setSelectedPromo)}
                dataSource={dataSourcePromoCode}
              />
            </Form.Item>

            {selectedPromo && (
              <>
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
              </>
            )}

          </Form>
        </Card.Body>
      </Card>



      {selectedPromo && (
      <Card className="border-0 shadow-sm card-add-product">
        <Card.Body className="p-3 border-bottom">
          <h5 className="mb-0 fs-16-s">Pengaturan Bonus</h5>
        </Card.Body>

        <Card.Body className="p-3">
          {selectedPromo === "" && (
            <h4 className="text-center">Pilih kode promo terlebih dahulu</h4>
          )}
          {(selectedPromo === "vd1" || selectedPromo === "vd2") && (
            <>
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
            </>
          )}

          {/*
          <>
            {dataVoucher.length >= 0 && ((dataFreeShipping.length + dataVoucher.length) < 10) && (
              <ButtonAddVoucher 
                onClick={addVoucherDiscountHandler}
                disabled={(dataFreeShipping.length + dataVoucher.length) >= 10}
              >
                Tambah Voucher Diskon
              </ButtonAddVoucher>
            )}
          </>
          */}


          {selectedPromo === "freeship" && (
            <>
              <p className="fs-15 mb-3 w-100 fw-500">
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
            </>
          )}

        </Card.Body>
      </Card>
      )}



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

      {selectedPromo && (
        <Space>
          <Button className="btn-tridatu">Simpan</Button>
          <Button>Batal</Button>
        </Space>
      )}

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
        :global(.list-card-promo .ant-card-actions > li){
          margin: 6px 0;
        }
      `}</style>
    </>
  )
}

export default UpdateVoucher
