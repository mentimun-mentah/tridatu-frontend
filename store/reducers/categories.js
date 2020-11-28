import * as actionType from "store/actions/actionTypes";
import { updateObject } from "lib/utility";

const initialState = {
  categories: [],
  subcategories: [],
  itemsubcategories: [],
  allCategories: [],
  loading: false,
  error: null,
};

/* CATEGORIES */
const getCategoriesStart = (state, _) => {
  return updateObject(state, {
    error: null,
    loading: true,
  });
};

const getCategoriesSuccess = (state, action) => {
  return updateObject(state, {
    categories: action.categories,
    loading: false,
  });
};

const getCategoriesFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false,
  });
};

/* SUB CATEGORIES */
const getSubCategoriesStart = (state, _) => {
  return updateObject(state, {
    error: null,
    loading: true,
  });
};

const getSubCategoriesSuccess = (state, action) => {
  return updateObject(state, {
    subcategories: action.subcategories,
    loading: false,
  });
};

const getSubCategoriesFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false,
  });
};

/* ITEM SUB CATEGORIES */
const getItemSubCategoriesStart = (state, _) => {
  return updateObject(state, {
    error: null,
    loading: true,
  });
};

const getItemSubCategoriesSuccess = (state, action) => {
  return updateObject(state, {
    itemsubcategories: action.itemsubcategories,
    loading: false,
  });
};

const getItemSubCategoriesFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false,
  });
};

/* ALL CATEGORIES */
const getAllCategoriesStart = (state, _) => {
  return updateObject(state, {
    error: null,
    loading: true,
  });
};

const getAllCategoriesSuccess = (state, action) => {
  return updateObject(state, {
    allCategories: action.allCategories,
    loading: false,
  });
};

const getAllCategoriesFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false,
  });
};

const reducer = (state = initialState, action) => {
  switch(action.type){
    /* CATEGORIES */
    case actionType.GET_CATEGORIES_START:
      return getCategoriesStart(state, action)
    case actionType.GET_CATEGORIES_SUCCESS:
      return getCategoriesSuccess(state, action)
    case actionType.GET_CATEGORIES_FAIL:
      return getCategoriesFail(state, action)

    /* SUB CATEGORIES */
    case actionType.GET_SUBCATEGORIES_START:
      return getSubCategoriesStart(state, action)
    case actionType.GET_SUBCATEGORIES_SUCCESS:
      return getSubCategoriesSuccess(state, action)
    case actionType.GET_SUBCATEGORIES_FAIL:
      return getSubCategoriesFail(state, action)

    /* SUB CATEGORIES */
    case actionType.GET_ITEMSUBCATEGORIES_START:
      return getItemSubCategoriesStart(state, action)
    case actionType.GET_ITEMSUBCATEGORIES_SUCCESS:
      return getItemSubCategoriesSuccess(state, action)
    case actionType.GET_ITEMSUBCATEGORIES_FAIL:
      return getItemSubCategoriesFail(state, action)

    /* ALL CATEGORIES */
    case actionType.GET_ALLCATEGORIES_START:
      return getAllCategoriesStart(state, action)
    case actionType.GET_ALLCATEGORIES_SUCCESS:
      return getAllCategoriesSuccess(state, action)
    case actionType.GET_ALLCATEGORIES_FAIL:
      return getAllCategoriesFail(state, action)

    default:
      return state
  }
}

export default reducer
