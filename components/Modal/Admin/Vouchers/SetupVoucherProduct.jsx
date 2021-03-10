import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Table, Modal, Input, Select, Empty, Space, Form, Cascader, Row, Col, Checkbox } from 'antd'

import * as actions from "store/actions";

import { columnsVoucherProduct } from 'data/voucher'

import _ from 'lodash'
import Button from 'antd-button-color'
import isIn from 'validator/lib/isIn'
import ColB from 'react-bootstrap/Col'
import Card from 'react-bootstrap/Card'
// import Form from 'react-bootstrap/Form'
import isEmpty from 'validator/lib/isEmpty';
import Pagination from "components/Pagination";

const EmptyProduct = () => (
  <div className="w-100">
    <Empty className="my-5" description={<span className="text-secondary">Tidak ada produk</span>} />
  </div>
)

const orderList = [
  { label: "Terbaru", value: "newest" },
  { label: "Harga Tertinggi", value: "high_price", },
  { label: "Harga Terendah", value: "low_price", }
]

const options = [
  { value: 'all', label: 'Semua Kategori', },
  { value: 'category', label: 'Kategori',
    children: [
      { value: 'pria', label: 'Pria',
        children: [
          { value: 'atasan', label: 'Atasan',
            children: [
              { value: 'kemeja', label: 'Kemeja', },
            ],
          },
          { value: 'bawahan', label: 'Celana', }
        ],
      },
    ]
  },
];

const per_page = 10
const SetupVoucherProduct = ({ typeVoucher, visible, onClose, selectedProduct, setSelectedProduct }) => {
  // if(!visible) return null
  const dispatch = useDispatch()

  /* GLOBAL STATE */
  const products = useSelector(state => state.products.products)
  /* GLOBAL STATE */


  const [search, setSearch] = useState("")
  const [page, setPage] = useState(products.page)
  const [order_by, setOrderBy] = useState(orderList[0].value)
  const [dataSourceProducts, setDataSourceProduct] = useState([])
  const [listSelected, setListSelected] = useState([])

  const [isInStock, setIsInStock] = useState(true)
  const [selectedBrand, setSelectedBrand] = useState([])
  const [selectedCategory, setSelectedCategory] = useState([])

  useEffect(() => {
    if(typeVoucher.value === "specific_product" && visible){
      dispatch(actions.getProducts({per_page: per_page, order_by: order_by, live: "true"}))
    }
  }, [visible])

  useEffect(() => {
    if(products && products.data && products.data.length >= 0){
      let tmp = []
      for(let val of products.data){
        if(isIn(val.products_id, _.map(selectedProduct, o => o.key))){
          tmp.push({ key: val.products_id, disabled: true, products: { ...val, stock: 30 }})
        } else {
          tmp.push({ key: val.products_id, products: { ...val, stock: 30 }})
        }
      }
      setDataSourceProduct(tmp)
    }
  }, [products.data])

  useEffect(() => {
    if(products && products.data){
      setPage(products.page)
    }
  }, [products])

  useEffect(() => {
    if(visible){
      setListSelected(selectedProduct)
    }
  }, [visible])

  useEffect(() => {
    let queryString = {}

    if(page) queryString["page"] = page

    if(!isEmpty(search)) queryString["q"] = search
    else delete queryString["q"]

    if(order_by) queryString["order_by"] = order_by
    else delete queryString["order_by"]

    dispatch(actions.getProducts({...queryString, per_page: per_page, live: "true"}))
  },[page, order_by, search])

  const onSelectAllRow = (_, record) => {
    if(record.length) {
      if(listSelected.length){
        const newRecord = (arr) => {
          for(let val of arr){
            record.filter(obj => obj.key !== val.key)
          }
          return record
        }

        const mergeRecord = listSelected.concat(newRecord(listSelected))
        const newMerge = Array.from(new Set(mergeRecord.map(a => a.key))).map(id => mergeRecord.find(a => a.key === id)) // remove duplicate

        let found = []
        for(let i = 0; i < newMerge.length; i++){
          for(let j = 0; j < dataSourceProducts.length; j++){
            if(newMerge[i].key == dataSourceProducts[j].key){
              found.push(newMerge[i].key)
              break;
            }
          }
        }

        let del = []
        for(let j = 0; j < found.length; j++){
          if(!record.map(x => x.key).includes(found[j])){
            del.push(found[j])
          }
        }
        del = [...new Set(del)]

        let fix = []
        for(let i = 0; i < newMerge.length; i++){
          if(!del.includes(newMerge[i].key)){
            fix.push(newMerge[i])
          }
        }
        fix = [...new Set(fix)]

        if(fix.length){
          setListSelected(fix)
        }
        else{
          setListSelected(newMerge)
        }
      } else {
        setListSelected(state => [...state, ...record])
      }
    }
    else {
      let copyListSelected = [...listSelected]
      let newDataSource = [...dataSourceProducts]
      let newData = copyListSelected.filter(ar => !newDataSource.find(rm => (rm.key === ar.key && ar.key === rm.key) ))
      setListSelected(newData)
    }
  };

  const rowSelection = {
    selectedRowKeys: _.map(listSelected, obj => obj.key),
    onChange: onSelectAllRow,
    getCheckboxProps: (record) => ({
      disabled: record.disabled,
      key: record.key
    })
  };

  const onCloseModal = () => {
    setSelectedProduct(listSelected)
    setPage(1)
    setSearch("")
    setOrderBy(orderList[0].value)
    onClose()
  }

  const onSearchChange = e => {
    setSearch(e.target.value)
    setPage(1)
  }

  const onOrderChange = val => {
    setOrderBy(val)
    setPage(1)
  }

  const onTableChange = (pagination, filters, sorter) => {
    const { order } = sorter
    let sortPrice = ""
    if(order === "ascend") sortPrice = "low_price"
    if(order === "descend") sortPrice = "high_price"

    setOrderBy(sortPrice)
    setPage(1)
    console.log(sortPrice)
  }

  const onCategoryChange = val => {

    if(val[0] === "category" && val.length === 1){
      setSelectedCategory(["all"])
    }
    else{
      setSelectedCategory(val)
    }

  }

  const onResetAllFilter = e => {
    e.preventDefault()
    setSearch("")
    setSelectedBrand([])
    setSelectedCategory([])
    setIsInStock(true)
  }

  return(
    <>
      <Modal centered width={1000} 
        zIndex={3000} visible={visible}
        title={`Pilih ${typeVoucher.label}`} closable={false}
        maskClosable={false}
        footer={[
          <Space key="action-btn">
            {listSelected.length > 0 && <small key="info"><span className="text-tridatu">{listSelected.length} </span>Item terpilih</small>}
            <Button key="back" onClick={onCloseModal}>Batal</Button>
            <Button 
              key="submit" 
              type="submit" 
              className="btn-tridatu" 
              style={{ width: 80 }} 
              onClick={onCloseModal}
            >
              Simpan
            </Button>
          </Space>
        ]}
      >

        <Form layout="vertical">
          <Row gutter={[16, 8]}>
            <Col xl={8} lg={8} md={8} sm={24} xs={24}>
              <Form.Item label="Kategori" className="mb-0">
                <Cascader 
                  changeOnSelect 
                  options={options} 
                  expandTrigger="hover" 
                  placeholder="Pilih kategori" 
                  value={selectedCategory}
                  onChange={onCategoryChange}
                />
              </Form.Item>
            </Col>
            <Col xl={8} lg={8} md={8} sm={24} xs={24}>
              <Form.Item label="Brand" className="mb-0">
                <Select 
                  mode="multiple" 
                  placeholder="Pilih brand" 
                  className="select-brand w-100"
                  value={selectedBrand}
                  onChange={val => setSelectedBrand(val)}
                >
                  {['Adidas', 'Bilabong', 'Converse', 'Deus', 'Gap', 'Giordano', 'Nike'].map(x => (
                    <Select.Option key={x}>{x}</Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xl={8} lg={8} md={8} sm={24} xs={24}>
              <Form.Item label="Cari produk" className="mb-2">
                <Input 
                  value={search} 
                  className="h-35" 
                  onChange={onSearchChange}
                  placeholder="Cari berdasarkan nama produk" 
                />
              </Form.Item>
            </Col>
          </Row>
          <Row gutter={[16, 16]} justify="space-between" align="middle">
            <Col xs={{ order: 2, span: 24 }} sm={{ order: 1, span: 8 }}>
              <Button className="btn-tridatu" onClick={onResetAllFilter}>Atur ulang</Button>
            </Col>
            <Col xs={{ order: 1, span: 24 }} sm={{ order: 2, span: 16 }}>
              <Checkbox 
                checked={isInStock} 
                className="noselect float-right-md"
                onChange={e => setIsInStock(e.target.checked)}
              >
                Hanya menampilkan produk yang tersedia
              </Checkbox>
            </Col>
          </Row>
        </Form>

        {/*
        <Form>
          <Form.Row>
            <Form.Group as={ColB} lg={8} md={6}>
              <Input 
                name="q"
                placeholder="Cari berdasarkan nama" 
                prefix={<i className="far fa-search" />}
                className="h-35"
                value={search}
                onChange={onSearchChange}
              />
            </Form.Group>
            <Form.Group as={ColB} lg={4} md={6}>
              <Select 
                placeholder="Urutkan" 
                style={{ width: "100%"}}
                className="product-search-select"
                dropdownClassName="idx-3010"
                value={order_by}
                onChange={onOrderChange}
              >
                {orderList.map((list, i) => (
                  <Select.Option key={i} value={list.value}>{list.label}</Select.Option>
                ))}
              </Select>
            </Form.Group>
          </Form.Row>
        </Form>
        */}

        <Table 
          pagination={false} 
          onChange={onTableChange}
          rowSelection={rowSelection}
          scroll={{ x: 850, y: 400 }}
          columns={columnsVoucherProduct} 
          dataSource={dataSourceProducts}
          locale={{ emptyText: <EmptyProduct /> }}
          rowClassName={record => isIn(record.key, _.map(selectedProduct, o => o.key)) ? "disabled-row" : "modif-row"}
        />

        <Card.Body className="text-right pb-0">
          <Pagination 
            current={page} 
            hideOnSinglePage 
            pageSize={per_page}
            total={products.total} 
            goTo={val => setPage(val)} 
          />
        </Card.Body>

      </Modal>

      <style jsx>{`
      :global(.disabled-row){
        opacity: .6;
        background-color: white;
        pointer-events: none;
        cursor: not-allowed;
      }
      :global(.ant-table-tbody > tr.disabled-row.ant-table-row-selected > td, 
              .ant-table-tbody > tr.modif-row.ant-table-row-selected > td){
        background-color: white;
        border-bottom: 1px solid #f0f0f0;
      }
      :global(.ant-table-tbody > tr.disabled-row:hover > td, .ant-table-tbody > tr.modif-row:hover > td){
        background-color: #fafafa;
      }
      :global(.idx-3010){
        z-index: 3010;
      }
      :global(.select-brand .ant-select-selector){
        height: 35px;
        border-radius: 0.25rem !important;
      }
      :global(.ant-table-column-sorter-up.active, .ant-table-column-sorter-down.active){
        color: #ff4d4e;
      }
      :global(.ant-cascader-menus, .ant-select-dropdown){
        z-index: 3010;
      }
      @media screen and (min-width: 576px) {
        :global(.float-right-md){
          float: right;
        }
      }
      `}</style>
    </>
  )
}

export default SetupVoucherProduct
