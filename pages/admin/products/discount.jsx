import { withAuth } from 'lib/withAuth'
import { useRouter } from 'next/router';
import { useState, useEffect  } from 'react'
import { Table, Input, Select, Empty } from 'antd'
import { useSelector, useDispatch } from "react-redux";

import { orderList, columns } from 'data/discount'

import id from 'locales/id/admin/product/discount'
import en from 'locales/en/admin/product/discount'

import axios, { signature_exp, resNotification } from "lib/axios";
import * as actions from "store/actions";
import ColB from 'react-bootstrap/Col'
import Form from 'react-bootstrap/Form'
import Card from 'react-bootstrap/Card'
import isEmpty from 'validator/lib/isEmpty';

import formFilter from "formdata/formFilter";
import Pagination from "components/Pagination";

import EditableCell from 'components/Card/Admin/Product/Promo/Cell'
import PromoModal from 'components/Modal/Admin/Products/SetupPromo'

const components = { body: { cell: EditableCell } };
const per_page = 10

const EmptyProduct = ({t}) => (
  <div className="w-100">
    <Empty className="my-5" description={<span className="text-secondary">{t.empty_product}</span>} />
  </div>
)

const Discount = ({ searchQuery }) => {
  const router = useRouter()
  const dispatch = useDispatch()

  const { locale } = router
  const t = locale === "en" ? en : id

  const discounts = useSelector(state => state.discounts.discounts)

  const [show, setShow] = useState(false)
  const [productId, setProductId] = useState(null)
  const [discount, setDiscount] = useState({})
  const [discountStatus, setDiscountStatus] = useState("")
  const [dataSourceProducts, setDataSourceProducts] = useState([])
  const [page, setPage] = useState(discounts.page)
  const [filter, setFilter] = useState(formFilter)

  const { q, status } = filter

  const getDiscountHandler = (product_id) => {
    axios.get(`/discounts/get-discount/${product_id}`)
      .then(res => {
        const resDetail = res.data.detail
        if(res.status == 404) resNotification("error", "Error", resDetail)
        else {
          setDiscount(res.data)
          setProductId(product_id)
          if(res.data && product_id) setShow(true)
        }
      })
      .catch(err => {
        const errDetail = err.response.data.detail;
        if(errDetail == signature_exp) getDiscountHandler(product_id)
      })
  }

  const closeModalSetPromoHandler = () => {
    let queryString = router.query
    dispatch(actions.getDiscount({ ...queryString }))
    setShow(false)
    setDiscount({})
    setProductId(null)
    setDiscountStatus("")
  }

  const columnsProductList = columns(t).map(col => {
    if(!col.action) return col
    let queryString = router.query
    return {
      ...col,
      onCell: (record, index) => ({
        record,
        index: index,
        action: col.action,
        onGetDiscount: (product_id) => getDiscountHandler(product_id),
        onSetDiscountStatus: (sts) => setDiscountStatus(sts),
        onNonActiveDiscount: (product_id) => dispatch(actions.nonActiveDiscount(product_id, { ...queryString })),
        t: t
      })
    }
  })

  useEffect(() => {
    if(discounts && discounts.data){
      setPage(discounts.page)
    }
  }, [discounts])

  useEffect(() => {
    if(discounts && discounts.data && discounts.data.length >= 0){
      let tmp = []
      for(let val of discounts.data){
        tmp.push({ key: val.products_id, products: val })
      }
      setDataSourceProducts(tmp)
    }
  }, [discounts])

  const onFilterChange = (e, item) => {
    const name = !item && e.target.name;
    const value = !item && e.target.value;
    setPage(1)
    if(item){
      const data = {
        ...filter,
        [item]: { ...filter[item], value: e, isValid: true, message: null }
      }
      setFilter(data)
    }
    else{
      const data = {
        ...filter,
        [name]: { ...filter[name], value: value, isValid: true, message: null }
      }
      setFilter(data)
    }
  }

  useEffect(() => {
    let queryString = router.query
    if(page) queryString["page"] = page
    if(queryString["page"] == ""){
      delete queryString["page"]
    }

    if(status.value[0] !== "" && status.value !== "" ) queryString["status"] = status.value
    else delete queryString["status"]

    if(!isEmpty(q.value)) queryString["q"] = q.value
    else delete queryString["q"]

    router.replace({
      pathname: router.pathname,
      query: queryString
    })
  }, [filter, page])

  useEffect(() => {
    if(!searchQuery) return
    const state = JSON.parse(JSON.stringify(filter))
    if(searchQuery.hasOwnProperty("page")) {
      if(searchQuery.page) {
        setPage(searchQuery.page)
      }
    }
    if(searchQuery.hasOwnProperty("q")){
      state.q.value = searchQuery.q
    }
    if(searchQuery.hasOwnProperty("status")) {
      state.status.value = [searchQuery.status]
    }
    setFilter(state)
  }, [])

  return(
    <>
      <Card className="border-0 shadow-sm card-add-product">
        <Card.Body className="p-3 border-bottom">
          <h5 className="mb-0 fs-16-s">{t.dicount_list}</h5>
        </Card.Body>
        <Card.Body className="p-3 border-bottom">
          <Form>
            <Form.Row>
              <Form.Group as={ColB} lg={8} md={6}>
                <Input 
                  className="h-35"
                  name="q"
                  placeholder={t.search_placeholder} 
                  prefix={<i className="far fa-search" />}
                  value={q.value}
                  onChange={e => onFilterChange(e)}
                />
              </Form.Group>
              <Form.Group as={ColB} lg={4} md={6}>
                <Select 
                  placeholder="Urutkan" 
                  style={{ width: "100%"}}
                  className="product-search-select"
                  defaultValue=""
                  value={status.value}
                  onChange={e => onFilterChange(e, "status")}
                >
                  {orderList(t).map((list, i) => (
                    <Select.Option key={i} value={list.value}>{list.label}</Select.Option>
                  ))}
                </Select>
              </Form.Group>
            </Form.Row>
          </Form>

          <Table 
            pagination={false}
            scroll={{ x: 1000 }}
            components={components}
            columns={columnsProductList} 
            dataSource={dataSourceProducts}
            locale={{ emptyText: <EmptyProduct t={t} /> }}
          />

          <Card.Body className="text-right">
            <Pagination 
              current={page} 
              hideOnSinglePage 
              pageSize={per_page}
              total={discounts.total} 
              goTo={val => setPage(val)} 
            />
          </Card.Body>
        </Card.Body>
      </Card>


      <PromoModal 
        t={t}
        visible={show}
        onClose={closeModalSetPromoHandler}
        discount={discount}
        productId={productId}
        discountStatus={discountStatus}
      />


      <style jsx>{`
        :global(.product-list-admin:not(:last-of-type)){
          margin-bottom: .5rem !important;
        }
        :global(.ant-picker-dropdown){
          z-index: 3010;
        }
        :global(.date-discount){
          margin-bottom: 0;
          line-height: 1;
        }
      `}</style>
    </>
  )
}

Discount.getInitialProps = async ctx => {
  const searchQuery = ctx.query
  await ctx.store.dispatch(actions.getDiscount({ ...searchQuery, per_page: per_page }))
  return { searchQuery: searchQuery }
}

export default withAuth(Discount)
