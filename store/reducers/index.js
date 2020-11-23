import { combineReducers } from "redux";
import authReducer from "./auth";
import addressReducer from "./address";
import outletReducer from "./outlet";
import brandReducer from "./brand";

const reducers = {
  auth: authReducer,
  address: addressReducer,
  outlet: outletReducer,
  brand: brandReducer,
};

export default combineReducers(reducers);
