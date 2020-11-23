import { withAuth } from 'lib/withAuth'
import { useDispatch, useSelector } from "react-redux";
import { Row, Col, Empty } from 'antd'
import { AnimatePresence, motion } from 'framer-motion'

import Card from 'react-bootstrap/Card'

import axios, { jsonHeaderHandler, resNotification, signature_exp } from 'lib/axios'
import * as actions from "store/actions";
import CardBrand from "components/Card/Admin/Brands/Card"

const Brand = () => {
  const dispatch = useDispatch()
  const brands = useSelector(state => state.brand.brand)
  
  const deleteBrandHandler = id => {
    axios.delete(`/brands/delete/${id}`, jsonHeaderHandler())
      .then(res => {
        dispatch(actions.getBrand())
        resNotification("success", "Success", res.data.detail)
      })
      .catch(err => {
        const errDetail = err.response.data.detail
        if(errDetail == signature_exp){
          dispatch(actions.getBrand())
          resNotification("success", "Success", "Successfully delete the brand.")
        } else if(typeof(errDetail) === "string") {
          resNotification("error", "Error", errDetail)
        } else {
          resNotification("error", "Error", errDetail[0].msg)
        }
      })
  }

  return(
    <>
      <Card className="border-0 shadow-none card-add-product">
        <Card.Body className="p-3 border-bottom">
          <h5 className="mb-0 fs-16-s">Kelola Brand</h5>
        </Card.Body>
        <Card.Body className="p-3">
          {brands && brands.length > 0 ? (
            <Row gutter={[16, 16]}>
              <AnimatePresence>
                {brands.map(data => (
                  <Col xl={4} lg={6} md={8} sm={8} xs={12} key={data.id_brand} >
                    <CardBrand data={data} deleteHandler={() => deleteBrandHandler(data.id_brand)} />
                  </Col>
                ))}
              </AnimatePresence>
            </Row>
          ) : (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: ".2" }}
            >
              <Empty className="my-5" description={<span className="text-secondary">Kamu belum memiliki brand</span>} /> 
            </motion.div>
          )}
        </Card.Body>
      </Card>

      <style jsx>{`
        :global(.card-img-brand){
          height: 200px;
          object-fit: cover;
        }
        :global(.card-body-brand > div){
          margin-left: auto;
          margin-right: auto;
        }
      `}</style>
    </>
  )
}

Brand.getInitialProps = async ctx => {
  let res = await axios.get("/brands/all-brands")
  ctx.store.dispatch(actions.getBrandSuccess(res.data))
}
export default withAuth(Brand)
