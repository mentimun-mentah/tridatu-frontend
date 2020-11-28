import { useState, useEffect } from 'react'
import { Modal, Button, Form, Input } from 'antd'
import { LoadingOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";

import Card from 'react-bootstrap/Card'

import * as actions from "store/actions";
import axios, { jsonHeaderHandler, resNotification, signature_exp } from 'lib/axios'
import ErrorMessage from "components/ErrorMessage";

import { formCategories, formCategoriesIsValid } from 'formdata/formCategories'

const EditCategory = ({ show, close, currentCategory }) => {
  const dispatch = useDispatch()
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState(formCategories)

  const { name_category } = categories

  const closeModalHandler = () => {
    close()
    setCategories(formCategories)
  }

  const inputCategoriesHandler = e => {
    const data = {
      ...categories,
      name_category: { ...categories.name_category, value: e.target.value, message: null }
    }
    setCategories(data)
  }

  const submitCategoriesHandler = e => {
    e.preventDefault()
    if(formCategoriesIsValid(categories, setCategories)){
      setLoading(true)
      const data = { name_category: name_category.value }

      axios.put(`/categories/update/${currentCategory.id_category}`, data, jsonHeaderHandler())
        .then(res => {
          setLoading(false)
          closeModalHandler()
          dispatch(actions.getCategories(false))
          resNotification("success", "Success", res.data.detail)
        })
        .catch(err => {
          const errDetail = err.response.data.detail;
          const errName = "The name has already been taken."
          if(errDetail == signature_exp){
            setLoading(false)
            closeModalHandler()
            dispatch(actions.getCategories(false))
            resNotification("success", "Success", "Successfully update the category.")
          } else if (typeof errDetail === "string" && errDetail === errName) {
            setLoading(false)
            const state = JSON.parse(JSON.stringify(categories));
            state.name_category.value = state.name_category.value;
            state.name_category.isValid = false;
            state.name_category.message = errDetail;
            setCategories(state);
          } else if(typeof(errDetail) === "string" && errDetail !== errName) {
            setLoading(false)
            resNotification("error", "Error", errDetail)
          } else {
            setLoading(false)
            const state = JSON.parse(JSON.stringify(categories));
            errDetail.map((data) => {
              const key = data.loc[data.loc.length - 1];
              if (state[key]) {
                state[key].value = state[key].value;
                state[key].isValid = false;
                state[key].message = data.msg;
              }
            });
            setCategories(state);
          }
        })
    }
  }

  useEffect(() => {
    setCategories(currentCategory)
  },[currentCategory])

  return(
    <>
      <Modal
        centered
        title="Update Kategori"
        visible={show}
        onOk={submitCategoriesHandler}
        onCancel={closeModalHandler}
        zIndex={3000}
        closeIcon={<i className="fas fa-times" />}
        width={600}
        className="modal-rad-10"
        footer={[
          <Button key="back" onClick={closeModalHandler}>
            Batal
          </Button>,
          <Button key="submit" type="submit" className="btn-tridatu" onClick={submitCategoriesHandler} style={{ width: 80 }} disabled={loading}>
            {loading ? <LoadingOutlined /> : "Simpan"}
          </Button>,
        ]}
      >
        <Card className="border-0">
          <Form form={form} layout="vertical">
            <Form.Item label="Nama Kategori" required>
              <Input 
                value={name_category.value}
                onChange={inputCategoriesHandler}
                className="h-33"
                placeholder="Contoh: Pria, Wanita, Anak-anak dll" 
              />
              <ErrorMessage item={name_category} />
            </Form.Item>
          </Form>
        </Card>
      </Modal>

    </>
  )
}

export default EditCategory
