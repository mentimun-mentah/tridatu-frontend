import { useState } from 'react'
import { Tabs, Checkbox, Row, Col, Space, Input, Select } from 'antd'
import { EditOutlined, EllipsisOutlined } from '@ant-design/icons'
import { AnimatePresence, motion } from 'framer-motion'

import Card from 'react-bootstrap/Card'
import Button from "antd-button-color"

import CardProductAdmin from "components/Card/Admin/Product/Card"

const ALL = 'all'
const LIVE = 'live'
const OUTOFSTOCK = 'outofstock'

import { productsColumns, productsData } from 'data/productsAdmin'

const selectBefore = (
  <Select defaultValue="1" className="select-before">
    <Select.Option value="1">Nama produk</Select.Option>
    <Select.Option value="2">Barcode</Select.Option>
  </Select>
);

const Products = () => {
  const [selectedProduct, setSelectedProduct] = useState([])
  const [selectAllProduct, setSelectAllProduct] = useState(false)
  const [indeterminate, setIndeterminate] = useState(false)

  const onSelectProduct = item => {
    setSelectedProduct(item)
    setIndeterminate(!!item.length && item.length < 10);
    setSelectAllProduct(item.length === 10)
  }

  const onSelectAllProduct = e => {
    setSelectedProduct(e.target.checked ? [...Array(10)].map((_,i) => i) : [])
    setIndeterminate(false);
    setSelectAllProduct(true)
  }

  return(
    <>
      <Card className="border-0 shadow-sm card-add-product">
        <Card.Body className="p-3 border-bottom">
          <Tabs className="order-tabs">
            <Tabs.TabPane tab="Semua" key={ALL}>
              
              <Input addonBefore={selectBefore} placeholder="Cari produk" />

              <Checkbox.Group value={selectedProduct} onChange={onSelectProduct} className="w-100">
                <Row gutter={[10, 10]}>
                  {[...Array(10)].map((_,i) => (
                    <Col xl={4} lg={6} md={6} sm={8} xs={12} key={i}>
                      <CardProductAdmin i={i} />
                    </Col>
                  ))}
                </Row>
              </Checkbox.Group>

              <AnimatePresence>
                {selectedProduct.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    exit={{ opacity: 0 }}
                    transition={{ duration: ".2" }}
                    className="w-100"
                  >
                    <Card className="border-0 mt-4 noselect">
                      <p className="mb-0 fw-500">
                        {selectedProduct.length} produk dipilih
                      </p>
                      <Row justify="space-between" gutter={[10, 10]}>
                        <Col className="va-sub" xl={12} lg={12} md={12} sm={12} xs={24}>
                          <span className="mb-0 va-sub">
                            <Checkbox indeterminate={indeterminate} onChange={onSelectAllProduct} checked={selectAllProduct}>
                              Pilih semua
                            </Checkbox>
                          </span>
                        </Col>
                        <Col className="va-sub" xl={12} lg={12} md={12} sm={12} xs={24}>
                          <Space align="center" className="float-product-button">
                            <Button>Hapus</Button>
                            <Button>Arsipkan</Button>
                            <Button className="btn-tridatu">Tampilkan</Button>
                          </Space>
                        </Col>
                      </Row>
                    </Card>
                  </motion.div>
                )}
              </AnimatePresence>
            </Tabs.TabPane>

            <Tabs.TabPane tab="Live" key={LIVE}>
              <p>live</p>
            </Tabs.TabPane>

            <Tabs.TabPane tab="Habis" key={OUTOFSTOCK}>
              <p>Produk Habis</p>
            </Tabs.TabPane>
          </Tabs>
        </Card.Body>
      </Card>
      <style jsx>{`
        :global(.float-product-button) {
          float: left;
        }
        @media(min-width: 576px){
          :global(.float-product-button) {
            float: right;
          }
        }
      `}</style>
    </>
  )
}

export default Products
