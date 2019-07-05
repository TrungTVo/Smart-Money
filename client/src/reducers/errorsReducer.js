import { GET_ERRORS, CLEAR_ERRORS } from '../actions/types';

const initialState = {
  type: '',
  errors: {}
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_ERRORS:
      return {
        ...state,
        type: action.payload.type,
        errors: action.payload.errors
      }
    case CLEAR_ERRORS:
      return {};
    default:
      return state;
  }
}
