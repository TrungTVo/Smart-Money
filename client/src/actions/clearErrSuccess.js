import * as actions from './types';

// Clear errors
export const clearErrors = () => {
  return {
    type: actions.CLEAR_ERRORS
  };
};

// Clear success
export const clearSuccess = () => {
  return {
    type: actions.CLEAR_SUCCESS
  };
};