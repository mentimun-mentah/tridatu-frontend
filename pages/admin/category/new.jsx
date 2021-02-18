import { withAuth } from 'lib/withAuth'
import { useState } from 'react'
import { useDispatch, useSelector } from "react-redux";
import { Tabs, Input, Form, Select, Button, Space } from 'antd'
import { LoadingOutlined } from "@ant-design/icons";

import Card from 'react-bootstrap/Card'

import * as actions from "store/actions";
import axios, { jsonHeaderHandler, resNotification, signature_exp } from 'lib/axios'
import ErrorMessage from "components/ErrorMessage";

import { formCategories, formSubCategories, formItemSubCategories } from 'formdata/formCategories'
import { formCategoriesIsValid, formSubCategoriesIsValid, formItemSubCategoriesIsValid } from 'formdata/formCategories'

const CATEGORIES = "categories"
const SUBCATEGORIES = "sub-categories"
const ITEMSUBCATEGORIES = "item-sub-categories"

const AddCategory = () => {
  const dispatch = useDispatch()
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState(CATEGORIES)
  const [categories, setCategories] = useState(formCategories)
  const [subCategories, setSubCategories] = useState(formSubCategories)
  const [itemSubCategories, setItemSubCategories] = useState(formItemSubCategories)

  const categoriesData = useSelector(state => state.categories.categories)

  const { name: name_category } = categories
  const { category_id, name: name_sub_category } = subCategories
  const { sub_category_id, name: name_item_sub_category } = itemSubCategories

  /* CATEGORIES */
  const inputCategoriesHandler = e => {
    const data = {
      ...categories,
      name: { ...categories.name, value: e.target.value, message: null }
    }
    setCategories(data)
  }

  const submitCategoriesHandler = e => {
    e.preventDefault()
    if(formCategoriesIsValid(categories, setCategories)){
      setLoading(true)
      const data = { name: name_category.value }

      axios.post("/categories/create", data, jsonHeaderHandler())
        .then(res => {
          setLoading(false)
          setCategories(formCategories)
          resNotification("success", "Success", res.data.detail)
        })
        .catch(err => {
          const errDetail = err.response.data.detail;
          const errName = "The name has already been taken."
          if(errDetail == signature_exp){
            setLoading(false)
            setCategories(formCategories)
            resNotification("success", "Success", "Successfully add a new category.")
          } else if (typeof errDetail === "string" && errDetail === errName) {
            setLoading(false)
            const state = JSON.parse(JSON.stringify(categories));
            state.name.value = state.name.value;
            state.name.isValid = false;
            state.name.message = errDetail;
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
  /* CATEGORIES */

  /* SUB CATEGORIES */
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

      const data = { category_id: category_id.value, name: name_sub_category.value }

      axios.post("/sub-categories/create", data, jsonHeaderHandler())
        .then(res => {
          setLoading(false)
          setSubCategories(formSubCategories)
          resNotification("success", "Success", res.data.detail)
        })
        .catch(err => {
          const errDetail = err.response.data.detail;
          const errName = "The name has already been taken in sub category."
          if(errDetail == signature_exp){
            setLoading(false)
            setSubCategories(formSubCategories)
            resNotification("success", "Success", "Successfully add a new sub-category.")
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
  /* SUB CATEGORIES */

  /* ITEM SUB CATEGORIES */
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
    if(formItemSubCategoriesIsValid(itemSubCategories, setItemSubCategories)){
      setLoading(true)

      const data = { sub_category_id: sub_category_id.value, name: name_item_sub_category.value }

      axios.post("/item-sub-categories/create", data, jsonHeaderHandler())
        .then(res => {
          setLoading(false)
          setItemSubCategories(formItemSubCategories)
          resNotification("success", "Success", res.data.detail)
        })
        .catch(err => {
          const errDetail = err.response.data.detail;
          const errName = "The name has already been taken in the item sub-category."
          if(errDetail == signature_exp){
            setLoading(false)
            setItemSubCategories(formItemSubCategories)
            resNotification("success", "Success", "Successfully add a new item sub-category.")
          } else if (typeof errDetail === "string" && errDetail === errName) {
            setLoading(false)
            const state = JSON.parse(JSON.stringify(itemSubCategories));
            state.name.value = state.name.value;
            state.name.isValid = false;
            state.name.message = errDetail;
            setItemSubCategories(state)
          } else if(typeof(errDetail) === "string" && errDetail !== errName) {
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
  /* ITEM SUB CATEGORIES */

  const fetchCategories = (with_sub) => {
    dispatch(actions.getCategories(with_sub))
  }
  const resetCategoriesData = () => {
    dispatch(actions.getCategoriesSuccess([]))
  }
  const onTabClick = key => {
    resetCategoriesData()
    setActiveTab(key)
  }

  const cancelHandler = (initialState, setState) => { setState(initialState) }

  return(
    <>
      <Card className="border-0 shadow-none card-add-product">
        <Card.Body className="p-3">
          <Tabs className="order-tabs noselect" activeKey={activeTab} onTabClick={onTabClick}>

            <Tabs.TabPane tab="Tambah Kategori" key={CATEGORIES}>
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
              <Space>
                <Button type="submit" className="btn-tridatu" onClick={submitCategoriesHandler} style={{ width: 80 }} disabled={loading}>
                  {loading ? <LoadingOutlined /> : "Simpan"}
                </Button> 
                <Button onClick={() => cancelHandler(formCategories, setCategories)}>
                  Batal
                </Button>
              </Space>
            </Tabs.TabPane>



            
            <Tabs.TabPane tab="Tambah Sub Kategori" key={SUBCATEGORIES}>
              <Form form={form} layout="vertical">
                <Form.Item label="Kategori" required>
                  <Select
                    showSearch
                    className="w-100"
                    name="category_id"
                    placeholder="Pilih kategori"
                    optionFilterProp="children"
                    onFocus={() => fetchCategories(false)}
                    onBlur={resetCategoriesData}
                    value={category_id.value}
                    onChange={e => inputSubCategoriesHandler(e, "category_id")}
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {categoriesData.map(({ categories_id, categories_name }) => (
                      <Select.Option value={categories_id} key={categories_id}>{categories_name}</Select.Option>
                    ))}
                  </Select>
                  <ErrorMessage item={category_id} />
                </Form.Item>
                <Form.Item label="Nama Sub Kategori" required>
                  <Input 
                    className="h-33"
                    name="name"
                    value={name_sub_category.value}
                    onChange={e => inputSubCategoriesHandler(e)}
                    placeholder="Contoh: Baju, Celana, Jaket dll" 
                  />
                  <ErrorMessage item={name_sub_category} />
                </Form.Item>
              </Form>
              <Space>
                <Button type="submit" className="btn-tridatu" onClick={submitSubCategoriesHandler} style={{ width: 80 }} disabled={loading}>
                  {loading ? <LoadingOutlined /> : "Simpan"}
                </Button> 
                <Button onClick={() => cancelHandler(formSubCategories, setSubCategories)}>
                  Batal
                </Button>
              </Space>
            </Tabs.TabPane>



            <Tabs.TabPane tab="Tambah Item Sub Kategori" key={ITEMSUBCATEGORIES}>
              <Form form={form} layout="vertical">
                <Form.Item label="Sub Kategori" required>
                  <Select
                    showSearch
                    className="w-100"
                    name="sub_category_id"
                    placeholder="Pilih sub kategori"
                    optionFilterProp="children"
                    onFocus={() => fetchCategories(true)}
                    onBlur={resetCategoriesData}
                    value={sub_category_id.value}
                    onChange={e => inputItemSubCategoriesHandler(e, "sub_category_id")}
                    filterOption={(input, option) =>
                      option.children.toLowerCase().indexOf(input.toLowerCase()) >= 0
                    }
                  >
                    {activeTab === ITEMSUBCATEGORIES && categoriesData.map(({categories_name, sub_categories_id, sub_categories_name}) => (
                      <Select.Option value={sub_categories_id} key={sub_categories_id}>
                        {`${categories_name} / ${sub_categories_name}`}
                      </Select.Option>
                    ))}
                  </Select>
                  <ErrorMessage item={sub_category_id} />
                </Form.Item>
                <Form.Item label="Nama Item Sub Kategori" required>
                  <Input 
                    className="h-33"
                    name="name"
                    value={name_item_sub_category.value}
                    onChange={e => inputItemSubCategoriesHandler(e)}
                    placeholder="Contoh: Kemeja, Kaos, Polo dll" 
                  />
                  <ErrorMessage item={name_item_sub_category} />
                </Form.Item>
              </Form>
              <Space>
                <Button 
                  type="submit" 
                  className="btn-tridatu" 
                  onClick={submitItemSubCategoriesHandler} 
                  style={{ width: 80 }} 
                  disabled={loading}
                >
                  {loading ? <LoadingOutlined /> : "Simpan"}
                </Button> 
                <Button onClick={() => cancelHandler(formItemSubCategories, setItemSubCategories)}>
                  Batal
                </Button>
              </Space>
            </Tabs.TabPane>

          </Tabs>
        </Card.Body>
      </Card>
    </>
  )
}

export default withAuth(AddCategory)
