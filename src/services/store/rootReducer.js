import { combineReducers } from "@reduxjs/toolkit";
import dashboardReducer from "../dashboardSlice";

const rootReducer = combineReducers({
  dashboard: dashboardReducer,
});

export default rootReducer;
