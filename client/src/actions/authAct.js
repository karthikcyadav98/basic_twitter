import { GET_ERRORS, SET_CURRENT_USER, GET_USERS, USER_LOADING } from "./types";
import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

//Register
export const registerUser = (userData, history) => dispatch => {
  axios
    .post("/api/users/register", userData)
    .then(res => history.push("/login"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//Login
export const loginUser = userData => dispatch => {
  axios
    .post("/api/users/login", userData)
    .then(res => {
      //Save to localstorage
      const { token } = res.data;
      //set token to localstorage
      localStorage.setItem("jwtToken", token);
      //set token to auth header
      setAuthToken(token);
      //Decode Token to get user Data
      const decoded = jwt_decode(token);
      //Set current user
      dispatch(setCurrentUser(decoded));
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//Get all users
export const getUsers = () => dispatch => {
  console.log("componentDidMount")

  dispatch(setUserLoading())
  axios
    .get("/api/users")
    .then(res => {
      dispatch({
        type: GET_USERS,
        payload: res.data
      })
    })
    .catch(err =>
      dispatch({
        type: GET_USERS,
        payload: {}
      })
    );
}

//Set logged in user
export const setCurrentUser = decoded => {
  return {
    type: SET_CURRENT_USER,
    payload: decoded
  };
};

//Log user out
export const logoutUser = () => dispatch => {
  //Remove toekn from localstorage
  localStorage.removeItem("jwtToken");
  //Remove auth header
  setAuthToken(false);
  //set the current user to empty object
  dispatch(setCurrentUser({}));
};

//Delete account
export const deleteAccount = () => dispatch => {
  if (window.confirm("Are you sure? This can not be undone!")) {
    axios
      .delete("/api/users/delete")
      .then(res => {
        dispatch({
          type: SET_CURRENT_USER,
          payload: {}
        });
        localStorage.removeItem("jwtToken");
      })
      .catch(err =>
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      );
  }
};

//Set loading
export const setUserLoading = () => {
  return {
    type: USER_LOADING
  };
}