import axios from "lib/axios";
import * as actionType from "./actionTypes";

/* CATEGORIES */
const getCategoriesStart = () => {
  return { type: actionType.GET_CATEGORIES_START };
};

export const getCategoriesSuccess = (categories) => {
  return {
    type: actionType.GET_CATEGORIES_SUCCESS,
    categories: categories,
  };
};

const getCategoriesFail = (error) => {
  return {
    type: actionType.GET_CATEGORIES_FAIL,
    error: error
  }
}

/* SUB CATEGORIES */
const getSubCategoriesStart = () => {
  return { type: actionType.GET_SUBCATEGORIES_START };
};

export const getSubCategoriesSuccess = (subcategories) => {
  return {
    type: actionType.GET_SUBCATEGORIES_SUCCESS,
    subcategories: subcategories,
  };
};

const getSubCategoriesFail = (error) => {
  return {
    type: actionType.GET_SUBCATEGORIES_FAIL,
    error: error
  }
}


/* ITEM SUB CATEGORIES */
const getItemSubCategoriesStart = () => {
  return { type: actionType.GET_ITEMSUBCATEGORIES_START };
};

export const getItemSubCategoriesSuccess = (itemsubcategories) => {
  return {
    type: actionType.GET_ITEMSUBCATEGORIES_SUCCESS,
    itemsubcategories: itemsubcategories,
  };
};

const getItemSubCategoriesFail = (error) => {
  return {
    type: actionType.GET_ITEMSUBCATEGORIES_FAIL,
    error: error
  }
}

/* ALL CATEGORIES */
const getAllCategoriesStart = () => {
  return { type: actionType.GET_ALLCATEGORIES_START };
};

export const getAllCategoriesSuccess = (allCategories) => {
  return {
    type: actionType.GET_ALLCATEGORIES_SUCCESS,
    allCategories: allCategories,
  };
};

const getAllCategoriesFail = (error) => {
  return {
    type: actionType.GET_ALLCATEGORIES_FAIL,
    error: error
  }
}

export const getCategories = (with_sub, q) => {
  return dispatch => {
    dispatch(getCategoriesStart())
    if(q){
      axios.get(`/categories/all-categories?with_sub=${with_sub}&q=${q}`)
        .then(res => {
          dispatch(getCategoriesSuccess(res.data))
        })
        .catch(err => {
          dispatch(getCategoriesFail(err.response))
        })
    } else {
      axios.get(`/categories/all-categories?with_sub=${with_sub}`)
        .then(res => {
          dispatch(getCategoriesSuccess(res.data))
        })
        .catch(err => {
          dispatch(getCategoriesFail(err.response))
        })
    }
  }
}

export const getSubCategories = () => {
  return dispatch => {
    dispatch(getSubCategoriesStart())
    axios.get("/sub-categories/all-sub-categories")
      .then(res => {
        dispatch(getSubCategoriesSuccess(res.data))
      })
      .catch(err => {
        dispatch(getSubCategoriesFail(err.response))
      })
  }
}

export const getItemSubCategories = () => {
  return dispatch => {
    dispatch(getItemSubCategoriesStart())
    axios.get("/item-sub-categories/all-item-sub-categories")
      .then(res => {
        dispatch(getItemSubCategoriesSuccess(res.data))
      })
      .catch(err => {
        dispatch(getItemSubCategoriesFail(err.response))
      })
  }
}

export const getAllCategories = (q) => {
  return dispatch => {
    dispatch(getAllCategoriesStart())
    if(q){
      axios.get(`/categories/?q=${q}`)
        .then(res => {
          dispatch(getAllCategoriesSuccess(res.data))
        })
        .catch(err => {
          dispatch(getAllCategoriesFail(err.response))
        })
    } else {
      axios.get(`/categories/`)
        .then(res => {
          dispatch(getAllCategoriesSuccess(res.data))
        })
        .catch(err => {
          dispatch(getAllCategoriesFail(err.response))
        })
    }
  }
}
