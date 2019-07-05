import { FETCH_USERS, ADD_USER, PASSWORD_RESET } from "../actions/types";

const initialState = {
  users: [],
  user: {},
}

export default function (state = initialState, action) {
  if (action.type === FETCH_USERS) {
    return {
      ...state,
      users: action.payload
    }
  } else if (action.type === ADD_USER) {
    return {
      ...state,
      users: [action.payload.new_user, ...state.users],
      user: action.payload.new_user
    }
  } else if (action.type === PASSWORD_RESET) {
    return {
      ...state,
      user: action.payload.user
    }
  } else {
    return state;
  }
}