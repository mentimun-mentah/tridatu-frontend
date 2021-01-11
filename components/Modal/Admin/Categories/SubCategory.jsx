import { useState, useEffect } from 'react'
import { Modal, Button, Form, Input, Select } from 'antd'
import { LoadingOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";

import Card from 'react-bootstrap/Card'

import * as actions from "store/actions";
import axios, { jsonHeaderHandler, resNotification, signature_exp } from 'lib/axios'
import ErrorMessage from "components/ErrorMessage";

import { formSubCategories } from 'formdata/formCategories'
import { formSubCategoriesIsValid } from 'formdata/formCategories'

const EditSubCategory = ({ show, close, currentSubCategory }) => {
  const dispatch = useDispatch()
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false)
  const [categories, setCategories] = useState([])
  const [subCategories, setSubCategories] = useState(formSubCategories)

  const { category_id, id_sub_category, name } = subCategories

  const closeModalHandler = () => {
    close()
    setSubCategories(formSubCategories)
  }

  const inputSubCategoriesHandler = (e, item) => {
    const name = !item && e.target.name;
    const value = !item && e.target.value;

    if(item){
      const data = {
        ...subCategories,
        [item]: { ...subCategories[item], value: e, isValid: true, message: null }
      }
      setSubCategories(data)
    }
    else {
      const data = {
        ...subCategories,
        [name]: { ...subCategories[name], value: value, isValid: true, message: null }
      }
      setSubCategories(data)
    }
  }

  const submitSubCategoriesHandler = e => {
    e.preventDefault()
    if(formSubCategoriesIsValid(subCategories, setSubCategories)){
      setLoading(true)

      const data = { category_id: category_id.value, name: name.value }

      axios.put(`/sub-categories/update/${id_sub_category}`, data, jsonHeaderHandler())
        .then(res => {
          setLoading(false)
          closeModalHandler()
          dispatch(actions.getCategories(true))
          resNotification("success", "Success", res.data.detail)
        })
        .catch(err => {
          const errDetail = err.response.data.detail;
          const errName = "The name has already been taken in sub category."
          if(errDetail == signature_exp){
            setLoading(false)
            closeModalHandler()
            dispatch(actions.getCategories(true))
            resNotification("success", "Success", "Successfully update the sub-category.")
          } else if (typeof errDetail === "string" && errDetail === errName) {
            setLoading(false)
            const state = JSON.parse(JSON.stringify(subCategories));
            state.name.value = state.name.value;
            state.name.isValid = false;
            state.name.message = errDetail;
            setSubCategories(state)
          } else if(typeof(errDetail) === "string" && errDetail !== errName) {
            setLoading(false)
            resNotification("error", "Error", errDetail)
          } else {
            setLoading(false)
            const state = JSON.parse(JSON.stringify(subCategories));
            errDetail.map((data) => {
              const key = data.loc[data.loc.length - 1];
              if (state[key]) {
                state[key].value = state[key].value;
                state[key].isValid = false;
                state[key].message = data.msg;
              }
            });
            setSubCategories(state)
          }
        })
    }
  }

  const fetchCategories = (with_sub) => {
    axios.get(`/categories/all-categories?with_sub=${with_sub}`)
      .then(res => {
        setCategories(res.data)
      })
      .catch(() => {})
  }

  const resetCategories = () => { setCategories([]) }

  useEffect(() => {
    setSubCategories(currentSubCategory)
    fetchCategories(false)
  },[currentSubCategory])

  return(
    <>
      <Modal
        centered
        title="Update Sub Kategori"
        visible={show}
        onOk={submitSubCategoriesHandler}
        onCancel={closeModalHandler}
        zIndex={2000}
        closeIcon={<i className="fas fa-times" />}
        width={600}
        className="modal-rad-10"
        footer={[
          <Button key="back" onClick={closeModalHandler}>
            Batal
          </Button>,
          <Button key="submit" type="submit" className="btn-tridatu" onClick={submitSubCategoriesHandler} style={{ width: 80 }} disabled={loading}>
            {loading ? <LoadingOutlined /> : "Simpan"}
          </Button>,
        ]}
      >
        <Card className="border-0">
          <Form form={form} layout="vertical">
            <Form.Item label="Kategori" required>
              <Select
                showSearch
                className="w-100"
                name="category_id"
                placeholder="Pilih kategori"
                optionFilterProp="children"
                onFocus={() => fetchCategories(false)}
                onBlur={resetCategories}
                value={category_id.value}
                onChange={e => inputSubCategoriesHandler(e, "category_id")}
                filterOption={(input, option) =>
                  option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                }
                dropdownStyle={{ zIndex: 3000 }}
              >
                {categories.map(({categories_id, categories_name})=> (
                  <Select.Option value={categories_id} key={categories_id}>{categories_name}</Select.Option>
                ))}
              </Select>
              <ErrorMessage item={category_id} />
            </Form.Item>
            <Form.Item label="Nama Sub Kategori" required>
              <Input 
                className="h-33"
                name="name"
                value={name.value}
                onChange={e => inputSubCategoriesHandler(e)}
                placeholder="Contoh: Baju, Celana, Jaket dll" 
              />
              <ErrorMessage item={name} />
            </Form.Item>
          </Form>
        </Card>
      </Modal>
    </>
  )
}

export default EditSubCategory
