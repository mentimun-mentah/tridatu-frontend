import { withAuth } from 'lib/withAuth'
import { useRouter } from 'next/router'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { Tabs, Row, Col, Input, Select, Empty } from 'antd'
import { EditOutlined, EllipsisOutlined } from '@ant-design/icons'
import { AnimatePresence, motion } from 'framer-motion'

import id from 'locales/id/admin/product'
import en from 'locales/en/admin/product'

import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import ColB from 'react-bootstrap/Col'
import isEmpty from 'validator/lib/isEmpty';

import * as actions from "store/actions";
import Pagination from "components/Pagination";
import CardProductAdmin from "components/Card/Admin/Product/Card"

import { productsColumns, productsData } from 'data/productsAdmin'

const CardProductMemo = React.memo(CardProductAdmin);

const ALL = 'all'
const LIVE = 'live'
const ARCHIVE = 'archive'

const orderList = (t) => [
  { label: t.order_list.newest, value: "newest" },
  { label: t.order_list.high_price, value: "high_price", },
  { label: t.order_list.low_price, value: "low_price", }
]

const EmptyProduct = ({ loading, products, t }) => (
  <>
    {!loading && (products == null || products && products.total == 0) && (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: ".2" }}
        className="w-100"
      >
        <Empty className="my-5" description={<span className="text-secondary">{t.empty_product}</span>} />
      </motion.div>
    )}
  </>
)

const ProductComponent = ({ products, dispatch, router, t }) => (
  <>
    {products && products.data && products.data.length > 0 && products.data.map(product => (
      <Col xl={4} lg={6} md={8} sm={12} xs={24} key={product.products_id}>
        <CardProductMemo 
          t={t}
          data={product} 
          aliveArchive={(id) => dispatch(actions.aliveArchiveProduct(id))}
          deleteProduct={(id) => dispatch(actions.deleteProduct(id, router.query))}
        />
      </Col>
    ))}
  </>
)

const per_page = 18;
const Products = ({ searchQuery }) => {
  const dispatch = useDispatch();
  const router = useRouter();

  const { locale } = router
  const t = locale === "en" ? en : id

  const loading = useSelector(state => state.products.loading)
  const aliveArchiving = useSelector(state => state.products.aliveArchiving)
  const products = useSelector(state => state.products.products)
  
  const [activeTab, setActiveTab] = useState(ALL)
  const [page, setPage] = useState(products.page)
  const [live, setLive] = useState("")
  const [search, setSearch] = useState("")
  const [order_by, setOrderBy] = useState("newest")

  const onTabClick = key => {
    setActiveTab(key)
    setPage(1)
    setSearch("")
    setOrderBy(orderList(t)[0].value)
    if(key === ALL) setLive("")
    if(key === LIVE) setLive("true")
    if(key === ARCHIVE) setLive("false")
  }

  const pageChange = page => {
    setPage(page)
  }

  useEffect(() => {
    let queryString = router.query

    if(page) queryString["page"] = page

    if(!isEmpty(search)) queryString["q"] = search
    else delete queryString["q"]

    if(order_by !== "") queryString["order_by"] = order_by
    else delete queryString["order_by"]

    if(!isEmpty(live)) queryString["live"] = live
    else delete queryString["live"]

    router.replace({
      pathname: "/admin/products",
      query: queryString
    })
  },[page, order_by, live, search])

  useEffect(() => {
    if(!searchQuery) return
    if(searchQuery.hasOwnProperty("page")) {
      setPage(+searchQuery.page)
    }
    if(searchQuery.hasOwnProperty("live")) {
      setLive(searchQuery.live)
    }
    if(searchQuery.hasOwnProperty("order_by")) {
      setOrderBy([searchQuery.order_by])
    }
  }, [])

  useEffect(() => {
    let queryString = router.query
    dispatch(actions.getProducts({ ...queryString, per_page: per_page }))
  }, [aliveArchiving])

  useEffect(() => {
    if(products && products.data && !router.query.hasOwnProperty("page")){
      setPage(products.page)
    }
    if(products && router.query.hasOwnProperty("page")){
      setPage(+router.query.page)
    }
    if(products && router.query.hasOwnProperty("order_by") && (router.query.hasOwnProperty("order_by") !== order_by)) {
      setOrderBy(order_by)
    }
  }, [products])

  const onSearchChange = e => {
    setSearch(e.target.value)
    setPage(1)
  }

  const onOrderChange = val => {
    setOrderBy(val)
    setPage(1)
  }

  const showPagination = products !== null && products && products.data && products.data.length > 0 && (products.next_num !== null || products.prev_num !== null);

  return(
    <>
      <Card className="border-0 shadow-sm card-add-product">
        <Card.Body className="p-3">
          <Tabs className="order-tabs" activeKey={activeTab} onTabClick={onTabClick}>
            <Tabs.TabPane tab={t.tabs.all} key={ALL}>
              
              <Form>
                <Form.Row>
                  <Form.Group as={ColB} lg={8} md={6}>
                    <Input 
                      placeholder={t.search_placeholder} 
                      prefix={<i className="far fa-search" />}
                      value={search}
                      onChange={onSearchChange}
                    />
                  </Form.Group>
                  <Form.Group as={ColB} lg={4} md={6}>
                    <Select 
                      placeholder={t.sort_placeholder} 
                      style={{ width: "100%"}}
                      className="product-search-select"
                      value={order_by}
                      onChange={onOrderChange}
                    >
                      {orderList(t).map((list, i) => (
                        <Select.Option key={i} value={list.value}>{list.label}</Select.Option>
                      ))}
                    </Select>
                  </Form.Group>
                </Form.Row>
              </Form>

              <Row gutter={[10, 10]}>
                <ProductComponent products={products} dispatch={dispatch} router={router} t={t} />
                <EmptyProduct loading={loading} products={products} t={t} />
              </Row>

              {showPagination && (
                <Card.Body className="text-center">
                  <Pagination 
                    total={products.total} 
                    goTo={pageChange} 
                    current={page} 
                    hideOnSinglePage 
                    pageSize={per_page}
                  />
                </Card.Body>
              )}
            </Tabs.TabPane>


            <Tabs.TabPane tab={t.tabs.live} key={LIVE}>
              <Form>
                <Form.Row>
                  <Form.Group as={ColB} lg={8} md={6}>
                    <Input 
                      placeholder={t.search_placeholder} 
                      prefix={<i className="far fa-search" />}
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group as={ColB} lg={4} md={6}>
                    <Select 
                      placeholder={t.sort_placeholder} 
                      style={{ width: "100%"}}
                      className="product-search-select"
                      value={order_by}
                      onChange={e => setOrderBy(e)}
                    >
                      {orderList(t).map((list, i) => (
                        <Select.Option key={i} value={list.value}>{list.label}</Select.Option>
                      ))}
                    </Select>
                  </Form.Group>
                </Form.Row>
              </Form>

              <AnimatePresence>
                <Row gutter={[10, 10]}>
                  <ProductComponent products={products} dispatch={dispatch} router={router} t={t} />
                  <EmptyProduct loading={loading} products={products} t={t} />
                </Row>
              </AnimatePresence>

              {showPagination && (
                <Card.Body className="text-center">
                  <Pagination 
                    total={products.total} 
                    goTo={pageChange} 
                    current={page} 
                    hideOnSinglePage 
                    pageSize={per_page}
                  />
                </Card.Body>
              )}
            </Tabs.TabPane>


            <Tabs.TabPane tab={t.tabs.archived} key={ARCHIVE}>
              <Form>
                <Form.Row>
                  <Form.Group as={ColB} lg={8} md={6}>
                    <Input 
                      placeholder={t.search_placeholder} 
                      prefix={<i className="far fa-search" />}
                      value={search}
                      onChange={e => setSearch(e.target.value)}
                    />
                  </Form.Group>
                  <Form.Group as={ColB} lg={4} md={6}>
                    <Select 
                      placeholder={t.sort_placeholder} 
                      style={{ width: "100%"}}
                      className="product-search-select"
                      value={order_by}
                      onChange={e => setOrderBy(e)}
                    >
                      {orderList(t).map((list, i) => (
                        <Select.Option key={i} value={list.value}>{list.label}</Select.Option>
                      ))}
                    </Select>
                  </Form.Group>
                </Form.Row>
              </Form>

              <Row gutter={[10, 10]}>
                <ProductComponent products={products} dispatch={dispatch} router={router} t={t} />
                <EmptyProduct loading={loading} products={products} t={t} />
              </Row>

              {showPagination && (
                <Card.Body className="text-center">
                  <Pagination 
                    total={products.total} 
                    goTo={pageChange} 
                    current={page} 
                    hideOnSinglePage 
                    pageSize={per_page}
                  />
                </Card.Body>
              )}
            </Tabs.TabPane>
          </Tabs>
        </Card.Body>
      </Card>
      <style jsx>{`
        :global(.product-search-select > .ant-select-selector){
          height: 33px !important;
        }
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

Products.getInitialProps = async ctx => {
  const searchQuery = ctx.query
  await ctx.store.dispatch(actions.getProducts({ ...searchQuery, per_page: per_page }))
  return { searchQuery: searchQuery }
}

export default withAuth(Products)
