import { GET_USERS, USER_LOADING } from "./types";
import axios from "axios";

//Get all users
export const getUsers = () => dispatch => {
    dispatch(setUserLoading())
    axios
        .get("/api/users")
        .then(res => {
            dispatch({
                type: GET_USERS,
                payload: res.data
            })
        })
    // .catch(err =>
    //     dispatch({
    //         type: GET_USERS,
    //         payload: null
    //     })
    // );
}

//Set loading
export const setUserLoading = () => {
    return {
        type: USER_LOADING
    };
}