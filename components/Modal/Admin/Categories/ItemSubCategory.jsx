import { useState, useEffect } from 'react'
import { Modal, Button, Form, Input, Select } from 'antd'
import { LoadingOutlined } from "@ant-design/icons";
import { useDispatch, useSelector } from "react-redux";

import isIn from 'validator/lib/isIn'
import Card from 'react-bootstrap/Card'

import * as actions from "store/actions";
import axios, { jsonHeaderHandler, resNotification, signature_exp } from 'lib/axios'
import ErrorMessage from "components/ErrorMessage";

import { formItemSubCategories, formItemSubCategoriesIsValid } from 'formdata/formCategories'

const EditItemSubCategory = ({ t, show, close, currentItemSubCategory }) => {
  const dispatch = useDispatch()
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false)
  const [itemSubCategories, setItemSubCategories] = useState(formItemSubCategories)

  const { item_sub_categories_id, sub_category_id,  name } = itemSubCategories

  const categoriesData = useSelector(state => state.categories.categories)

  const closeModalHandler = () => {
    close()
    setItemSubCategories(formItemSubCategories)
  }

  const inputItemSubCategoriesHandler = (e, item) => {
    const name = !item && e.target.name;
    const value = !item && e.target.value;

    if(item){
      const data = {
        ...itemSubCategories,
        [item]: { ...itemSubCategories[item], value: e, isValid: true, message: null }
      }
      setItemSubCategories(data)
    }
    else {
      const data = {
        ...itemSubCategories,
        [name]: { ...itemSubCategories[name], value: value, isValid: true, message: null }
      }
      setItemSubCategories(data)
    }
  }

  const submitItemSubCategoriesHandler = e => {
    e.preventDefault()
    if(formItemSubCategoriesIsValid(itemSubCategories, setItemSubCategories, t)){
      setLoading(true)
      const data = { sub_category_id: sub_category_id.value, name: name.value }

      axios.put(`/item-sub-categories/update/${item_sub_categories_id}`, data, jsonHeaderHandler())
        .then(res => {
          setLoading(false)
          closeModalHandler()
          dispatch(actions.getAllCategories())
          resNotification("success", "Success", res.data.detail)
        })
        .catch(err => {
          const errDetail = err.response.data.detail;
          const errName = ["The name has already been taken.", "Nama sudah dipakai."]
          if(errDetail == signature_exp){
            setLoading(false)
            closeModalHandler()
            dispatch(actions.getAllCategories())
            // resNotification("success", "Success", "Successfully update the item sub-category.")
          } else if (typeof errDetail === "string" && isIn(errDetail, errName)) {
            setLoading(false)
            const state = JSON.parse(JSON.stringify(itemSubCategories));
            state.name.value = state.name.value;
            state.name.isValid = false;
            state.name.message = errDetail;
            setItemSubCategories(state)
          } else if(typeof(errDetail) === "string" && !isIn(errDetail, errName)) {
            setLoading(false)
            resNotification("error", "Error", errDetail)
          } else {
            setLoading(false)
            const state = JSON.parse(JSON.stringify(itemSubCategories));
            errDetail.map((data) => {
              const key = data.loc[data.loc.length - 1];
              if (state[key]) {
                state[key].value = state[key].value;
                state[key].isValid = false;
                state[key].message = data.msg;
              }
            });
            setItemSubCategories(state)
          }
        })
    }
  }

  const fetchCategories = (with_sub) => {
    dispatch(actions.getCategories(with_sub))
  }

  useEffect(() => {
    setItemSubCategories(currentItemSubCategory)
    if(show){
      fetchCategories(true)
    }
  },[currentItemSubCategory, show])

  return(
    <>
      <Modal
        centered
        title={`Update Item Sub ${t.category}`}
        visible={show}
        onOk={submitItemSubCategoriesHandler}
        onCancel={closeModalHandler}
        zIndex={2000}
        closeIcon={<i className="fas fa-times" />}
        width={600}
        className="modal-rad-10"
        footer={[
          <Button key="back" onClick={closeModalHandler}>
            {t.cancel}
          </Button>,
          <Button 
            key="submit" 
            type="submit" 
            className="btn-tridatu" 
            onClick={submitItemSubCategoriesHandler} 
            style={{ width: 80 }} 
            disabled={loading}
          >
            {loading ? <LoadingOutlined /> : t.save}
          </Button>,
        ]}
      >
        {show && (
          <Card className="border-0">
            <Form form={form} layout="vertical">
              <Form.Item label={`Sub ${t.category}`} required>
                <Select
                  showSearch
                  className="w-100"
                  name="sub_category_id"
                  placeholder={t.choose_sub_category}
                  optionFilterProp="children"
                  onFocus={() => fetchCategories(true)}
                  value={sub_category_id.value}
                  onChange={e => inputItemSubCategoriesHandler(e, "sub_category_id")}
                  filterOption={(input, option) =>
                    option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                  }
                  dropdownStyle={{ zIndex: 3000 }}
                >
                  {categoriesData.map(({categories_name, sub_categories_id, sub_categories_name}) => (
                    <Select.Option value={sub_categories_id} key={sub_categories_id}>
                      {`${categories_name} / ${sub_categories_name}`}
                    </Select.Option>
                  ))}
                </Select>
                <ErrorMessage item={sub_category_id} />
              </Form.Item>
              <Form.Item label={t.item_sub_category_name} required>
                <Input 
                  className="h-33"
                  name="name"
                  value={name.value}
                  onChange={e => inputItemSubCategoriesHandler(e)}
                  placeholder={t.item_sub_category_input_placeholder} 
                />
                <ErrorMessage item={name} />
              </Form.Item>
            </Form>
          </Card>
        )}
      </Modal>
    </>
  )
}

export default EditItemSubCategory
