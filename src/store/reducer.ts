import { combineReducers } from "redux";
import accountReducer from "./slices/accounts";
import cinemaReducer from "./slices/cinema";
import classificationReducer from "./slices/classification";
import screenTypeReducer from "./slices/screenType";
import showtimeStatusReducer from "./slices/showtimeStatus";
import screenReducer from "./slices/screen";
import movieReduer from "./slices/movie";
import showtimeReducer from "./slices/showtime";
import seatReducer from "./slices/seat";
import roleReducer from "./slices/roles";
import extraReducer from "./slices/extras";
import productCategoryReducer from './slices/productCat'

export default combineReducers({
  accounts: accountReducer,
  cinema: cinemaReducer,
  classification: classificationReducer,
  screenType: screenTypeReducer,
  showtimeStatus: showtimeStatusReducer,
  screen: screenReducer,
  movie: movieReduer,
  showtime: showtimeReducer,
  seat: seatReducer,
  role: roleReducer,
  extras: extraReducer,
  productCat: productCategoryReducer,
});
