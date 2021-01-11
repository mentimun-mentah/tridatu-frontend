import { combineReducers } from "redux";
import authReducer from "./auth";
import addressReducer from "./address";
import outletReducer from "./outlet";
import brandReducer from "./brand";
import categoriesRecuder from "./categories"

import layoutReducer from "./layout"

const reducers = {
  auth: authReducer,
  address: addressReducer,
  outlet: outletReducer,
  brand: brandReducer,
  categories: categoriesRecuder,
  layout: layoutReducer
};

export default combineReducers(reducers);
