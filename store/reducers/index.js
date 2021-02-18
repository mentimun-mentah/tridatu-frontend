import { combineReducers } from "redux";
import authReducer from "./auth";
import addressReducer from "./address";
import outletReducer from "./outlet";
import brandReducer from "./brand";
import categoriesRecuder from "./categories"
import productsRecuder from "./products"
import shippingRecuder from "./shipping"
import discountReducer from "./discount"

import layoutReducer from "./layout"

const reducers = {
  auth: authReducer,
  address: addressReducer,
  outlet: outletReducer,
  brand: brandReducer,
  categories: categoriesRecuder,
  products: productsRecuder,
  shipping: shippingRecuder,
  discounts: discountReducer,
  layout: layoutReducer
};

export default combineReducers(reducers);
