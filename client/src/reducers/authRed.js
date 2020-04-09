import { SET_CURRENT_USER, GET_USERS, USER_LOADING } from "../actions/types";
import isEmpty from "../validation/is-empty";

const initialState = {
  isAuth: false,
  user: {}
};

export default function (state = initialState, action) {
  switch (action.type) {
    case USER_LOADING:
      return {
        ...state,
        loading: true
      };
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuth: !isEmpty(action.payload),
        user: action.payload
      };
    case GET_USERS:
      return {
        ...state,
        profile: action.payload,
        loading: false
      };

    default:
      return state;
  }
}
