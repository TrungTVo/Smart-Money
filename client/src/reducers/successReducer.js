import { GET_SUCCESS, CLEAR_SUCCESS } from '../actions/types';

const initialState = {
  type: '',
  account: '',
  success_msg: ''
};

export default function (state = initialState, action) {
  switch (action.type) {
    case GET_SUCCESS:
      return action.payload
    case CLEAR_SUCCESS:
      return {};
    default:
      return state;
  }
}
