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
import productReducer from './slices/product'
import priceRuleReducer from './slices/priceRule'
import inventoryReducer from './slices/inventory'
import staffReducer from './slices/staff'
import permissionReducer from './slices/permissions'
import vatConfigReducer from './slices/vatConfig'
import rolePermissionReducer from './slices/rolePermissions'
import purchaseReducer from './slices/purchase'
import orderReducer from "./slices/order";
import customerReducer from "./slices/customer";
import cinemaStaffReducer from "./slices/cinemaStaff";

const appReducer = combineReducers({
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
  product: productReducer,
  priceRule: priceRuleReducer,
  inventory: inventoryReducer,
  staff: staffReducer,
  permission: permissionReducer,
  vatConfig: vatConfigReducer,
  rolePermission: rolePermissionReducer,
  purchase: purchaseReducer,
  order: orderReducer,
  customer: customerReducer,
  cinemaStaff: cinemaStaffReducer,
});

const rootReducer = (state: any, action: any) => {
  if (action.type === "account/logout") {
    // Check for the logout action type
    state = undefined;
  }
  return appReducer(state, action);
};

export default rootReducer;
