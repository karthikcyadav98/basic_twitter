import { combineReducers } from "redux";
import authRed from "./authRed";
import errorRed from "./errorRed";
import postRed from "./postRed";
import profileRed from './profileRed'

export default combineReducers({
  auth: authRed,
  errors: errorRed,
  post: postRed,
  profile: profileRed
});
