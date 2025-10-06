import { combineReducers } from "redux";
import accountReducer from "./slices/accounts";
import cinemaReducer from "./slices/cinema";

export default combineReducers({
  accounts: accountReducer,
  cinema: cinemaReducer,
});
