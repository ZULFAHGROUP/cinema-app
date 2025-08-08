import { combineReducers } from "redux";
import accountReducer from "./slices/accounts";

export default combineReducers({
  accounts: accountReducer,
});
