import { withAuth } from 'lib/withAuth'
import { useState, useEffect } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { Form, Upload, Row, Col, Empty } from 'antd'
import { AnimatePresence, motion } from 'framer-motion'

import Card from 'react-bootstrap/Card'

import { formImage } from 'formdata/formImage'
import { imageValidation, uploadButton } from 'lib/imageUploader'

import axios, { jsonHeaderHandler, resNotification, signature_exp } from 'lib/axios'
import * as actions from "store/actions";
import CardOutlet from "components/Card/Admin/Outlets/Card"
import AddStyleAdmin from 'components/Admin/addStyle'

const OutletInformation = () => {
  const dispatch = useDispatch()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [imageList, setImageList] = useState(formImage)

  const outlets = useSelector(state => state.outlet.outlet)

  const { file } = imageList

  const deleteOutletHandler = id => {
    axios.delete(`/outlets/delete/${id}`, jsonHeaderHandler())
      .then(res => {
        dispatch(actions.getOutlet())
        resNotification("success", "Success", res.data.detail)
      })
      .catch(err => {
        const errDetail = err.response.data.detail
        if(errDetail == signature_exp){
          dispatch(actions.getOutlet())
          resNotification("success", "Success", "Successfully delete the outlet.")
        } else if(typeof(errDetail) === "string") {
          resNotification("error", "Error", errDetail)
        } else {
          resNotification("error", "Error", errDetail[0].msg)
        }
      })
  }

  useEffect(() => {
    dispatch(actions.getOutlet())
  }, [dispatch])

  return(
    <>
      <Card className="border-0 shadow-sm card-add-product">
        <Card.Body className="p-3 border-bottom">
          <h5 className="mb-0 fs-16-s">Tambah Informasi Outlet</h5>
        </Card.Body>
        <Card.Body className="p-3">

          <Form form={form} layout="vertical">
            <Form.Item label={<p className="mb-0">Foto Outlet <small className="text-muted fs-12">(200 × 200 px)</small></p>} className="mb-0" required>
              <Upload
                accept="image/*"
                listType="picture-card"
                className="avatar-uploader"
                fileList={file.value}
                beforeUpload={(file) => imageValidation(file, "file", "/outlets/create", "post", setLoading, () => dispatch(actions.getOutlet()), "Successfully add a new outlet.")}
              >
                {file.value.length >= 1 ? null : uploadButton(loading)}
              </Upload>
            </Form.Item>

            <small className="text-muted fs-12">
              Image format .jpg. jpeg .png<br/>
              Maximum image size is 4 MB
            </small>
          </Form>

        </Card.Body>
      </Card>

      <section className="outlet-section">
        <h5 className="fs-16-s">Daftar Outlet</h5>
        {outlets && outlets.length > 0 ? (
          <Row gutter={[16, 16]}>
            <AnimatePresence>
              {outlets.map(data => (
                <Col xl={4} lg={6} md={8} sm={8} xs={12} key={data.id}>
                  <CardOutlet data={data} deleteHandler={() => deleteOutletHandler(data.id)} />
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
            <Empty className="my-5" description={<span className="text-secondary">Kamu belum memiliki outlet</span>} /> 
          </motion.div>
        )}
      </section>

      <style jsx>{`
        @media(max-width: 767px) {
          :global(.outlet-section){
            padding: 16px;
          }
        }
      `}</style>
      <style jsx>{AddStyleAdmin}</style>
    </>
  )
}

export default withAuth(OutletInformation)
