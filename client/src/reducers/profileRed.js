import { GET_USERS, USER_LOADING } from "../actions/types";

const initialState = {
    loading: false,
    profiles: null
};

export default function (state = initialState, action) {
    switch (action.type) {
        case USER_LOADING:
            return {
                ...state,
                loading: true
            };
        case GET_USERS:
            return {
                ...state,
                profiles: action.payload,
                loading: false
            };

        default:
            return state;
    }
}
