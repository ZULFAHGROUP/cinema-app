import { combineReducers } from "redux";
import accountReducer from "./slices/accounts";
import cinemaReducer from "./slices/cinema";
import classificationReducer from "./slices/classification";
import seatTypeReducer from "./slices/seatType";
import showtimeStatusReducer from "./slices/showtimeStatus";
import screenReducer from "./slices/screen";
import movieReduer from "./slices/movie";
import showtimeReducer from './slices/showtime'

export default combineReducers({
  accounts: accountReducer,
  cinema: cinemaReducer,
  classification: classificationReducer,
  seatType: seatTypeReducer,
  showtimeStatus: showtimeStatusReducer,
  screen: screenReducer,
  movie: movieReduer,
  showtime:showtimeReducer
});
