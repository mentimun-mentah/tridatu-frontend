import { combineReducers } from "redux";
import authReducer from "./auth";
import addressReducer from "./address";
import outletReducer from "./outlet";
import brandReducer from "./brand";
import categoriesRecuder from "./categories"

const reducers = {
  auth: authReducer,
  address: addressReducer,
  outlet: outletReducer,
  brand: brandReducer,
  categories: categoriesRecuder
};

export default combineReducers(reducers);
