import * as actionType from "store/actions/actionTypes";
import { updateObject } from "lib/utility";

const initialState = {
  products: [],
  searchName: [],
  loading: false,
  productSlug: {},
  aliveArchiving: true,
  error: null,
};

const getProductStart = (state, _) => {
  return updateObject(state, {
    error: null,
    loading: true
  });
}

const getProductSuccess = (state, action) => {
  return updateObject(state, {
    products: action.products,
    loading: false
  });
}

const getProductFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    loading: false
  });
}

const aliveArchiveProductStart = (state, _) => {
  return updateObject(state, {
    error: null,
    aliveArchiving: true,
    loading: true
  });
}

const aliveArchiveProductSuccess = (state, _) => {
  return updateObject(state, {
    aliveArchiving: false,
    loading: false
  });
}

const aliveArchiveProductFail = (state, action) => {
  return updateObject(state, {
    error: action.error,
    aliveArchiving: false,
    loading: false
  });
}

const searchNameStart = (state, _) => {
  return updateObject(state, {
    loading: false,
  });
}

const searchNameSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    searchName: action.searchName,
  })
}

const searchNameFail = (state, action) => {
  return updateObject(state, {
    loading: false,
    error: action.error,
  })
}


const deleteProductStart = (state, _) => {
  return updateObject(state, {
    loading: false,
  });
}

const deleteProductSuccess = (state, _) => {
  return updateObject(state, {
    loading: false,
  })
}

const deleteProductFail = (state, action) => {
  return updateObject(state, {
    loading: false,
    error: action.error,
  })
}


const getProductSlugStart = (state, _) => {
  return updateObject(state, {
    loading: true,
    error: null
  })
}

export const getProductSlugSuccess = (state, action) => {
  return updateObject(state, {
    loading: false,
    productSlug: action.productSlug
  })
}

const getProductSlugFail = (state, action) => {
  return updateObject(state, {
    loading: false,
    error: action.error
  })
}

const reducer = (state = initialState, action) => {
  switch(action.type){
    case actionType.GET_ALLPRODUCTS_START:
      return getProductStart(state, action)
    case actionType.GET_ALLPRODUCTS_SUCCESS:
      return getProductSuccess(state, action)
    case actionType.GET_ALLPRODUCTS_FAIL:
      return getProductFail(state, action)

    case actionType.ALIVE_ARCHIVE_START:
      return aliveArchiveProductStart(state, action)
    case actionType.ALIVE_ARCHIVE_SUCCESS:
      return aliveArchiveProductSuccess(state, action)
    case actionType.ALIVE_ARCHIVE_FAIL:
      return aliveArchiveProductFail(state, action)

    case actionType.SEARCH_NAME_START:
      return searchNameStart(state, action)
    case actionType.SEARCH_NAME_SUCCESS:
      return searchNameSuccess(state, action)
    case actionType.SEARCH_NAME_FAIL:
      return searchNameFail(state, action)

    case actionType.DELETE_PRODUCTS_START:
      return deleteProductStart(state, action)
    case actionType.DELETE_PRODUCTS_SUCCESS:
      return deleteProductSuccess(state, action)
    case actionType.DELETE_PRODUCTS_FAIL:
      return deleteProductFail(state, action)

    case actionType.GET_PRODUCT_SLUG_START:
      return getProductSlugStart(state, action)
    case actionType.GET_PRODUCT_SLUG_SUCCESS:
      return getProductSlugSuccess(state, action)
    case actionType.GET_PRODUCT_SLUG_FAIL:
      return getProductSlugFail(state, action)

    default:
      return state;
  }
}

export default reducer
