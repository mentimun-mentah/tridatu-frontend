import { useState } from 'react'
import { withAuth } from 'lib/withAuth'
import { useRouter } from 'next/router'
import { useDispatch } from "react-redux";
import { Form, Input, Button, Space, Upload } from 'antd'
import { LoadingOutlined } from "@ant-design/icons";

import id from 'locales/id/admin/brand'
import en from 'locales/en/admin/brand'

import _ from 'lodash'
import isIn from 'validator/lib/isIn'
import Card from 'react-bootstrap/Card'

import { formImage, formImageIsValid } from 'formdata/formImage'
import { formBrand, formBrandIsValid } from 'formdata/formBrand'
import { imageValidation, imagePreview, uploadButton } from 'lib/imageUploader'

import axios, { formHeaderHandler, resNotification, signature_exp } from 'lib/axios'
import * as actions from "store/actions";
import ErrorMessage from "components/ErrorMessage";

import AddStyleAdmin from 'components/Admin/addStyle'

const NewBrand = () => {
  const router = useRouter()

  const { locale } = router
  const t = locale === "en" ? en : id

  const dispatch = useDispatch()
  const [form] = Form.useForm()
  const [loading, setLoading] = useState(false)
  const [brand, setBrand] = useState(formBrand)
  const [imageList, setImageList] = useState(formImage)

  const { file } = imageList
  const { name } = brand

  const inputChangeHandler = e => {
    const name = e.target.name;
    const value = e.target.value;

    const data = {
      ...brand,
      [name] : { ...brand[name], value: value, isValid: true, message: null }
    }

    setBrand(data)
  }

  // Function for image changing
  const imageChangeHandler = ({ fileList: newFileList }) => {
    const data = {
      ...imageList,
      file: { value: newFileList, isValid: true, message: null }
    }
    setImageList(data)
  };

  const onCancelHandler = e => {
    e.preventDefault()
    setBrand(formBrand)
    setImageList(formImage)
  }

  const onSubmitHandler = e => {
    e.preventDefault()
    if(formBrandIsValid(brand, setBrand, t) && formImageIsValid(imageList, setImageList, t.validation.empty_img)){
      setLoading(true)
      const formData = new FormData()
      _.forEach(file.value, file => {
        formData.append('file', file.originFileObj)
      })
      formData.append("name", name.value);

      axios.post("/brands/create", formData, formHeaderHandler())
        .then(res => {
          setLoading(false)
          resNotification("success", "Success", res.data.detail)
          setBrand(formBrand)
          setImageList(formImage)
        })
        .catch(err => {
          console.log(err)
          const errDetail = err.response.data.detail;
          const errName = ["The name has already been taken.", "Nama sudah dipakai."]
          if(errDetail == signature_exp){
            setLoading(false)
            setBrand(formBrand)
            setImageList(formImage)
            resNotification("success", "Success", t.success_response)
          }
          else if(typeof(errDetail) === "string" && isIn(errDetail, errName)) {
            setLoading(false)
            const state = JSON.parse(JSON.stringify(brand));
            state.name.value = state.name.value
            state.name.isValid = false
            state.name.message = errDetail
            setBrand(state)
          }
          else if(typeof(errDetail) === "string" && !isIn(errDetail, errName)) {
            setLoading(false)
            resNotification("error", "Error", errDetail)
          }
          else {
            setLoading(false)
            const brandState = JSON.parse(JSON.stringify(brand));
            const imageState = JSON.parse(JSON.stringify(imageList));
            errDetail.map((data) => {
              const key = data.loc[data.loc.length - 1];
              if (brandState[key]) {
                brandState[key].value = brandState[key].value;
                brandState[key].isValid = false;
                brandState[key].message = data.msg;
              }
              if (imageState[key]) {
                imageState[key].value = imageState[key].value;
                imageState[key].isValid = false;
                imageState[key].message = data.msg;
              }
            });
            setBrand(brandState);
            setImageList(imageState);
          }
        })
    }
  }

  return(
    <>
      <Card className="border-0 shadow-sm card-add-product">
        <Card.Body className="p-3 border-bottom">
          <h5 className="mb-0 fs-16-s">{t.add_brand}</h5>
        </Card.Body>
        <Card.Body className="p-3">

          <Form form={form} layout="vertical">
            <Form.Item label={t.brand_name} required>
              <Input 
                name="name" 
                placeholder={t.brand_name} 
                value={name.value}
                onChange={inputChangeHandler}
              />
              <ErrorMessage item={name} />
            </Form.Item>

            <Form.Item label={<p className="mb-0">{t.brand_photo} <small className="text-muted fs-12">(200 × 200 px)</small></p>} className="mb-0" required>
              <Upload
                accept="image/*"
                listType="picture-card"
                className="brand-uploader"
                disabled={loading}
                fileList={file.value}
                onPreview={imagePreview}
                onChange={imageChangeHandler}
                beforeUpload={(file) => imageValidation(file, "file", "/brands/create", "post", setLoading, () => dispatch(actions.getBrand()), t.success_response)}
              >
                {file.value.length >= 1 ? null : uploadButton(loading)}
              </Upload>
              <ErrorMessage item={file} />
            </Form.Item>
            <small className="text-muted fs-12">
              {t.validation.img_format} .jpg .jpeg .png<br/>
              {t.validation.img_size} 4 MB
            </small>

          </Form>

        </Card.Body>
      </Card>

      <Space>
        <Button className="btn-tridatu" onClick={onSubmitHandler} style={{ width: 80 }} disabled={loading}>
          {loading ? <LoadingOutlined /> : t.save}
        </Button>
        <Button onClick={onCancelHandler}>{t.cancel}</Button>
      </Space>

      <style jsx>{`
        :global(.brand-uploader button.ant-upload-list-item-card-actions-btn){
          border: 0 !important;
        }
        :global(.brand-uploader .ant-upload.ant-upload-select-picture-card){
          margin-bottom: 0;
        }
      `}</style>
      <style jsx>{AddStyleAdmin}</style>
    </>
  )
}

export default withAuth(NewBrand)
