import { SET_CURRENT_USER } from '../actions/types';

const initialState = {
  isAuthenticated: false,
  user: {}
};

export default function (state = initialState, action) {
  switch (action.type) {
    case SET_CURRENT_USER:
      return {
        ...state,
        isAuthenticated: (typeof action.payload !== 'undefined')
               && (typeof action.payload === 'object') 
               && Object.keys(action.payload).length !== 0,
        user: action.payload
      };
    default:
      return state;
  }
}
