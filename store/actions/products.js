import { message } from 'antd'
import axios, { jsonHeaderHandler, signature_exp, resNotification } from "lib/axios";
import * as actionType from "./actionTypes";
import isBoolean from 'validator/lib/isBoolean';

message.config({ maxCount: 1 });

export const getProductStart = () => {
  return { type: actionType.GET_ALLPRODUCTS_START }
}

export const getProductSuccess = (products) => {
  return { 
    type: actionType.GET_ALLPRODUCTS_SUCCESS,
    products: products
  }
}

const getProductFail = (error) => {
  return {
    type: actionType.GET_ALLPRODUCTS_FAIL,
    error: error
  }
}


const aliveArchiveProductStart = () => {
  return { type: actionType.ALIVE_ARCHIVE_START }
}

const aliveArchiveProductSuccess = () => {
  return { type: actionType.ALIVE_ARCHIVE_SUCCESS, }
}

const aliveArchiveProductFail = (error) => {
  return {
    type: actionType.ALIVE_ARCHIVE_FAIL,
    error: error
  }
}


const loveProductStart = () => {
  return { type: actionType.LOVE_PRODUCT_START }
}

const loveProductSuccess = () => {
  return { type: actionType.LOVE_PRODUCT_SUCCESS }
}

const loveProductFail = (error) => {
  return { 
    type: actionType.LOVE_PRODUCT_FAIL,
    error: error
  }
}

const unloveProductStart = () => {
  return { type: actionType.UNLOVE_PRODUCT_START }
}

const unloveProductSuccess = () => {
  return { type: actionType.UNLOVE_PRODUCT_SUCCESS }
}

const unloveProductFail = (error) => {
  return { 
    type: actionType.UNLOVE_PRODUCT_FAIL,
    error: error
  }
}


const searchNameStart = () => {
  return { type: actionType.SEARCH_NAME_START }
}

const searchNameSuccess = (searchName) => {
  return {
    type: actionType.SEARCH_NAME_SUCCESS,
    searchName: searchName
  }
}

const searchNameFail = (error) => {
  return {
    type: actionType.SEARCH_NAME_FAIL,
    error: error
  }
}


const deleteProductStart = () => {
  return { type: actionType.DELETE_PRODUCTS_START }
}

const deleteProductSuccess = () => {
  return { type: actionType.DELETE_PRODUCTS_SUCCESS }
}

const deleteProductFail = (error) => {
  return { 
    type: actionType.DELETE_PRODUCTS_FAIL,
    error: error
  }
}


export const getProductSlugStart = () => {
  return { type: actionType.GET_PRODUCT_SLUG_START }
}

export const getProductSlugSuccess = (product) => {
  return {
    type: actionType.GET_PRODUCT_SLUG_SUCCESS,
    productSlug: product
  }
}

export const getProductSlugFail = (error) => {
  return {
    type: actionType.GET_PRODUCT_SLUG_FAIL,
    error: error
  }
}


export const getProducts = ({ 
  page = 1, per_page = 10, q, live, order_by = "visitor", p_min, p_max, item_sub_cat, brand, pre_order, condition, wholesale, is_discount
}) => {

  let queryString = {}
  if(page) queryString["page"] = page
  if(per_page) queryString["per_page"] = per_page

  if(q !== "" && q !== undefined) queryString["q"] = q
  else delete queryString["q"]

  if(live && isBoolean(live.toString())) queryString["live"] = live
  else delete queryString["live"]

  if(order_by) queryString["order_by"] = order_by

  if(p_min) queryString["p_min"] = p_min
  else delete queryString["p_min"]

  if(p_max) queryString["p_max"] = p_max
  else delete queryString["p_max"]

  if(item_sub_cat) queryString["item_sub_cat"] = item_sub_cat
  else delete queryString["item_sub_cat"]

  if(brand) queryString["brand"] = brand
  else delete queryString["brand"]

  if(pre_order && isBoolean(pre_order.toString())) queryString["pre_order"] = pre_order
  else delete queryString["pre_order"]

  if(condition && isBoolean(condition.toString())) queryString["condition"] = condition
  else delete queryString["condition"]

  if(wholesale && isBoolean(wholesale.toString())) queryString["wholesale"] = wholesale
  else delete queryString["wholesale"]

  if(is_discount) queryString["is_discount"] = is_discount
  else delete queryString["is_discount"]

  return dispatch => {
    dispatch(getProductStart())
    axios.get(`/products/all-products`, { params: queryString })
      .then(res => {
        dispatch(getProductSuccess(res.data))
      })
      .catch(err => {
        if(err.response.data.detail === signature_exp){
          axios.get(`/products/all-products`, { params: queryString })
            .then(res => {
              dispatch(getProductSuccess(res.data))
            })
            .catch(() => {})
        }
        else {
          dispatch(getProductFail(err.response))
        }
      })
  }
}

export const aliveArchiveProduct = id => {
  return dispatch => {
    dispatch(aliveArchiveProductStart())
    axios.put(`/products/alive-archive/${id}`, null, jsonHeaderHandler())
      .then((res) => {
        message.success({ 
          content: res.data.detail, 
          style: { marginTop: '10vh' },
        });
        dispatch(aliveArchiveProductSuccess())
      })
      .catch(err => {
        dispatch(aliveArchiveProductFail(err.response))
      })
  }
}

export const loveProduct = id => {
  return dispatch => {
    dispatch(loveProductStart())
    axios.post(`/wishlists/love/${id}`, null, jsonHeaderHandler())
      .then(res => {
        if(res.status >= 400 && res.status < 500){
          message.error({ 
            content: res.data.detail, 
            style: { marginTop: '10vh' },
          });
        }
        if(res.status >= 200 && res.status < 300){
          message.success({ 
            content: res.data.detail, 
            style: { marginTop: '10vh' },
          });
        }
        dispatch(loveProductSuccess())
      })
      .catch(err => {
        dispatch(loveProductFail(err.response))
      })
  }
}

export const unloveProduct = id => {
  return dispatch => {
    dispatch(unloveProductStart())
    axios.delete(`/wishlists/unlove/${id}`, jsonHeaderHandler())
      .then(res => {
        if(res.status >= 400 && res.status < 500){
          message.error({ 
            content: res.data.detail, 
            style: { marginTop: '10vh' },
          });
        }
        if(res.status >= 200 && res.status < 300){
          message.success({ 
            content: res.data.detail, 
            style: { marginTop: '10vh' },
          });
        }
        dispatch(unloveProductSuccess())
      })
      .catch(err => {
        dispatch(unloveProductFail(err.response))
      })
  }
}

export const searchName = q => {
  q = q.toLowerCase()
  return dispatch => {
    dispatch(searchNameStart())
    axios.get(`/products/search-by-name?q=${q}&limit=10`)
      .then(res => {
        let names = res.data.map(obj => {
          const index = obj['value'].indexOf(q)
          if(index !== -1){
            const length = q.length
            const prefix = obj['value'].substring(0, index)
            const suffix = obj['value'].substring(index + length)
            const match = obj['value'].substring(index, index + length)

            obj['value'] = obj['value']
            obj['label'] = <span className="text-muted fw-500">{prefix}<span className="text-black">{match}</span>{suffix}</span>
          } else {
            obj['value'] = obj['value']
            obj['label'] = <span className="text-muted fw-500">{obj['value']}</span>
          }
          return obj 
        })
        dispatch(searchNameSuccess(names))
      })
      .catch(err => {
        dispatch(searchNameSuccess([]))
        dispatch(searchNameFail(err.response))
      })
  }
}

export const deleteProduct = (id, router) => {
  return dispatch => {
    dispatch(deleteProductStart())
    axios.delete(`/products/delete/${id}`, jsonHeaderHandler())
      .then(res => {
        const resDetail = res.data.detail
        const notFound = "Product not found!"

        if(resDetail === notFound){
          resNotification("error", "Error", resDetail)
        } else {
          resNotification("success", "Success", resDetail)
          dispatch(getProducts({ ...router }))
          dispatch(deleteProductSuccess())
        }
      })
      .catch(err => {
        const errDetail = err.response.data.detail;
        if(errDetail == signature_exp){
          resNotification("success", "Success", "Successfully delete the product.")
          dispatch(getProducts({ ...router }))
        } else {
          if(typeof(errDetail) === "string" && errDetail !== signature_exp) {
            resNotification("error", "Error", errDetail)
            dispatch(deleteProductFail(errDetail))
          }
        }
      })
  }
}

export const getSlugProduct = ({ slug, recommendation = true }) => {
  return dispatch => {
    dispatch(getProductSlugStart())
    axios.get(`/products/${slug}`, { params: { recommendation: recommendation } })
      .then(res => {
        dispatch(getProductSlugSuccess(res.data))
      })
      .catch(err => {
        if(err.response.data.detail === signature_exp){
          axios.get(`/products/${slug}`, { params: { recommendation: recommendation } })
            .then(res => {
              dispatch(getProductSlugSuccess(res.data))
            })
            .catch(() => {})
        } else {
          dispatch(getProductSlugFail(err.response))
        }
      })
  }
}
