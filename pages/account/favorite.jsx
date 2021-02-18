import { withAuth } from 'lib/withAuth'
import { useState, useEffect } from 'react'
import { Input, Select, Row, Col, Empty } from 'antd'
import { useSelector, useDispatch } from "react-redux";
import { AnimatePresence, motion } from 'framer-motion'

import dynamic from 'next/dynamic'
import ColB from 'react-bootstrap/Col'
import RowB from 'react-bootstrap/Row'
import Card from 'react-bootstrap/Card'
import Form from 'react-bootstrap/Form'
import isEmpty from 'validator/lib/isEmpty';

import * as actions from "store/actions";
import Pagination from "components/Pagination";
import formFilter from "formdata/formFilter";
import CardProductLoading from "components/Card/ProductLoading";

const CardProductLoadingMemo = React.memo(CardProductLoading);
const CardProduct = dynamic(() => import("components/Card/Product"), { ssr: false, loading: () => <CardProductLoadingMemo />  })
const CardProductMemo = React.memo(CardProduct);

const sortList = [
  { value: "", label: "Terbaru" }, 
  { value: "longest", label: "Terlama" },
  { value: "high_price", label: "Harga Tertinggi" }, 
  { value: "low_price", label: "Harga Terendah" },
] 

const per_page = 10;
const Favorite = () => {
  const dispatch = useDispatch()

  const [page, setPage] = useState(1)
  const [activeFilter, setActiveFilter] = useState(formFilter);

  const user = useSelector(state => state.auth.user)
  const products = useSelector(state => state.auth.wishlist)
  const loadingProduct = useSelector(state => state.auth.loading)

  const { q, order_by } = activeFilter

  useEffect(() => {
    let queryString = {}
    if(page) queryString["page"] = page

    if(!isEmpty(q.value)) queryString["q"] = q.value
    else delete queryString["q"]

    if(order_by.value !== "") queryString["order_by"] = order_by.value
    else delete queryString["order_by"]

    dispatch(actions.getWishlist({ ...queryString, per_page: per_page }))
  }, [activeFilter, page])

  useEffect(() => {
    if(products) setPage(products.page)
  }, [products])

  const onFilterChange = (e, item) => {
    const name = !item && e.target.name
    const value = !item && e.target.value

    if(item){
      const data = {
        ...activeFilter,
        [item]: { ...activeFilter[item], value: e, isValid: true, message: null }
      }
      setActiveFilter(data)
    }
    else {
      const data = {
        ...activeFilter,
        [name]: { ...activeFilter[name], value: value, isValid: true, message: null }
      }
      setActiveFilter(data)
    }
    setPage(1)
  }

  const showPagination = products !== null && products && products.data && products.data.length > 0 && (products.next_num !== null || products.prev_num !== null);

  return(
    <>
      <Card className="card-container">
        <Card.Header className="bg-transparent border-bottom">
          <h1 className="fs-16 mt-1 mb-0">Favorit</h1>
          <small>
            Kelola item favorit Anda dari sini
          </small>
        </Card.Header>
        <Card.Body>
          <Form>
            <Form.Row>
              <Form.Group as={ColB} lg={8} md={6}>
                <Input 
                  name="q"
                  className="account-search h-100"
                  placeholder="Cari produk favoritmu" 
                  prefix={<i className="far fa-search" />}
                  value={q.value}
                  onChange={onFilterChange}
                />
              </Form.Group>
              <Form.Group as={ColB} lg={4} md={6}>
                <Select 
                  name="order_by"
                  placeholder="Urutkan" 
                  style={{ width: "100%"}}
                  className="account-search"
                  value={order_by.value}
                  onChange={(e) => onFilterChange(e, "order_by")}
                >
                  {sortList.map(sort => (
                    <Select.Option key={sort.value} value={sort.value}>{sort.label}</Select.Option>
                  ))}
                </Select>
              </Form.Group>
            </Form.Row>
          </Form>

          <AnimatePresence exitBeforeEnter>
            <Row gutter={[10, 10]}>
              {products && products.data && products.data.length > 0 && products.data.map(product => (
                <Col lg={5} md={6} sm={8} xs={12} key={product.products_id} className="modif-col">
                  <CardProductMemo data={product} />
                </Col>
              ))}
              {loadingProduct && (!user || user) && (
                <>
                  {[...Array(16)].map((_,i) => (
                    <Col lg={5} md={6} sm={8} xs={12} key={i}>
                      <CardProductLoading />
                    </Col>
                  ))}
                </>
              )}
              {!loadingProduct && products && products.data && products.data.length == 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: ".2" }}
                  className="w-100 my-5"
                >
                  <Empty className="my-5" description={<span className="text-secondary">Produk tidak tersedia</span>} />
                </motion.div>
              )}
            </Row>
          </AnimatePresence>

          {showPagination && (
            <RowB className="mt-4">
              <ColB className="align-self-center text-center">
                <Pagination 
                  total={products.total} 
                  goTo={val => setPage(val)} 
                  current={page} 
                  hideOnSinglePage 
                  pageSize={per_page}
                />
              </ColB>
            </RowB>
          )}
        </Card.Body>
      </Card>

      <style jsx>{`
        @media (min-width: 992px){
          :global(.ant-col-lg-5.modif-col){
            display: block;
            flex: 0 0 20%;
            max-width: 20%;
          }
        }
      `}</style>
    </>
  )
}

export default withAuth(Favorite)
