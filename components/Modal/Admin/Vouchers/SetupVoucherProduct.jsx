import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { Table, Modal, Input, Select, Empty, Space, Form, Cascader, Row, Col, Checkbox } from 'antd'

import * as actions from "store/actions";

import { columnsVoucherProduct } from 'data/voucher'

import _ from 'lodash'
import Button from 'antd-button-color'
import isIn from 'validator/lib/isIn'
import Card from 'react-bootstrap/Card'
import isEmpty from 'validator/lib/isEmpty';
import Pagination from "components/Pagination";
import renameCategory from 'lib/renameCategory'

const EmptyProduct = () => (
  <div className="w-100">
    <Empty className="my-5" description={<span className="text-secondary">Tidak ada produk</span>} />
  </div>
)

const per_page = 10
const SetupVoucherProduct = ({ typeVoucher, visible, onClose, selectedProduct, setSelectedProduct }) => {
  // if(!visible) return null
  const dispatch = useDispatch()

  /* GLOBAL STATE */
  const brandsData = useSelector(state => state.brand.brand)
  const products = useSelector(state => state.products.products)
  const allCategoriesData = useSelector(state => state.categories.allCategories)
  /* GLOBAL STATE */

  const [search, setSearch] = useState("")
  const [page, setPage] = useState(products.page)
  const [order_by, setOrderBy] = useState("")
  const [listSelected, setListSelected] = useState([])
  const [allCategoriesList, setAllCategoriesList] = useState([])
  const [dataSourceProducts, setDataSourceProduct] = useState([])

  const [isInStock, setIsInStock] = useState(true)
  const [selectedBrand, setSelectedBrand] = useState([])
  const [selectedCategory, setSelectedCategory] = useState({ keyList: [], value: [] })

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
          tmp.push({ key: val.products_id, disabled: true, products: { ...val }})
        } else {
          tmp.push({ key: val.products_id, products: { ...val }})
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
    dispatch(actions.getAllCategories())
  }, [visible])

  useEffect(() => {
    let queryString = {}

    if(page) queryString["page"] = page

    if(!isEmpty(search)) queryString["q"] = search
    else delete queryString["q"]

    if(order_by) queryString["order_by"] = order_by
    else delete queryString["order_by"]

    if(selectedBrand.length > 0) queryString["brand"] = selectedBrand.join(",")
    else delete queryString["brand"]

    if(selectedCategory.keyList.length > 0) queryString["item_sub_cat"] = selectedCategory.keyList.join(",")
    else delete queryString["item_sub_cat"]

    if(isInStock) queryString["pre_order"] = "false"
    else delete queryString["pre_order"]

    dispatch(actions.getProducts({...queryString, per_page: per_page, live: "true"}))
  },[page, order_by, search, selectedBrand, selectedCategory, isInStock])

  useEffect(() => {
    const renamedCategory = renameCategory(allCategoriesData)
    const finalCategories = [
      { key: 'all', title: 'Semua Kategori', },
      { key: 'category', title: 'Kategori', children: renamedCategory }
    ]
    setAllCategoriesList(finalCategories)
  },[allCategoriesData])

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
    setPage(1)
    setSearch("")
    setOrderBy("")
    setSelectedBrand([])
    setSelectedCategory({ keyList: [], value: [] })
    onClose()
  }

  const onSaveProduct = () => {
    setSelectedProduct(listSelected)
    setPage(1)
    setSearch("")
    setOrderBy("")
    setSelectedBrand([])
    setSelectedCategory({ keyList: [], value: [] })
    onClose()
  }

  const onSearchChange = e => {
    setSearch(e.target.value)
    setPage(1)
  }

  const onTableChange = (pagination, filters, sorter) => {
    const { order } = sorter
    let sortPrice = ""
    if(order === "ascend") sortPrice = "low_price"
    if(order === "descend") sortPrice = "high_price"

    setOrderBy(sortPrice)
    setPage(1)
  }

  const onCategoryChange = (val, child) => {
    let lastValue = val[val.length - 1]
    child = child.filter(x => x.key === lastValue)

    const getKeys = (array) => {
      let list = []
      for(let val of array){
        if(val.children){
          for(let val2 of val.children){
            if(val2.children){
              for(let val3 of val2.children){
                list.push(val3.key)
              }
            }
            else list.push(val2.key)
          }
        }
        else list.push(val.key)
      }
      return list
    }

    if(val[0] === "category" && val.length === 1){
      setSelectedCategory({ keyList: [], value: ["all"] })
    }
    else{
      setSelectedCategory({ keyList: getKeys(child), value: val })
    }
    setPage(1)
  }

  const onBrandChange = val => {
    setPage(1)
    setSelectedBrand(val)
  }

  const onResetAllFilter = e => {
    e.preventDefault()
    setSearch("")
    setSelectedBrand([])
    setSelectedCategory({ keyList: [], value: [] })
    setIsInStock(true)
  }

  const fetchBrands = () => {
    dispatch(actions.getBrand())
  }

  return(
    <>
      <Modal centered width={1000} 
        zIndex={3000} visible={visible}
        title={`Pilih ${typeVoucher.label}`} closable={false}
        maskClosable={false}
        bodyStyle={{ height: '80vh' }}
        footer={[
          <Space key="action-btn">
            {listSelected.length > 0 && <small key="info"><span className="text-tridatu">{listSelected.length} </span>Item terpilih</small>}
            <Button key="back" onClick={onCloseModal}>Batal</Button>
            <Button 
              key="submit" 
              type="submit" 
              className="btn-tridatu" 
              style={{ width: 80 }} 
              onClick={onSaveProduct}
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
                  options={allCategoriesList} 
                  expandTrigger="hover" 
                  placeholder="Pilih kategori" 
                  value={selectedCategory.value}
                  onChange={onCategoryChange}
                  fieldNames={{ label: 'title', value: 'key', children: 'children' }}
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
                  onFocus={() => fetchBrands()}
                  onChange={onBrandChange}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                >
                  {brandsData.map(data => (
                    <Select.Option value={data.id} key={data.id}>{data.name}</Select.Option>
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

        <Table 
          pagination={false} 
          onChange={onTableChange}
          rowSelection={rowSelection}
          scroll={{ x: 850, y: 350 }}
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
      :global(.select-brand .ant-select-selector){
        overflow: auto;
      }
      :global(.select-brand.ant-select-multiple .ant-select-selection-item-remove > .anticon){
        vertical-align: 0;
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
