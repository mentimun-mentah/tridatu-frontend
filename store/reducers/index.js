import { combineReducers } from "redux";
import authReducer from "./auth";
import addressReducer from "./address";

const reducers = {
  auth: authReducer,
  address: addressReducer,
};

export default combineReducers(reducers);
