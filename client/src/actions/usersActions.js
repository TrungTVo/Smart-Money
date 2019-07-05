import axios from 'axios';
import * as actions from './types';
import jwt_decode from 'jwt-decode';
import {clearErrors, clearSuccess} from './clearErrSuccess';
import {loadAccounts} from './accountActions';

// register new user
export const createUser = (newUser, history) => dispatch => {
  axios.post('/users/register', newUser)
    .then(res => {
      dispatch({
        type: actions.ADD_USER,
        payload: {
          new_user: res.data.new_user
        }
      })
      dispatch({
        type: actions.GET_SUCCESS,
        payload: {
          success_msg: res.data.success_msg,
          type: actions.ADD_USER
        }
      })
      dispatch(clearErrors());
      history.push('/users/login');
    })
    .catch(err => {
      dispatch({
        type: actions.GET_ERRORS,
        payload: {
          type: err.response.data.type,
          errors: err.response.data.errors
        }
      })
      dispatch(clearSuccess());
    })
};

// login with email and password
export const loginUser = (user, history) => dispatch => {
  axios.post('/users/login', user)
    .then(res => {
      // save token to localstorage
      localStorage.setItem('jwtToken', res.data.token);
      // Set token to Auth header
      if (res.data.token) {
        // Apply to every request
        axios.defaults.headers.common['Authorization'] = res.data.token;
      }
      // Decode token to get user data
      const decoded = jwt_decode(res.data.token);
      // Set current user
      dispatch({
        type: actions.SET_CURRENT_USER,
        payload: decoded
      })
    })
    .then(() => {
      dispatch(clearErrors());
      history.push('/users/dashboard');
    })
    .catch(err => {
      dispatch({
        type: actions.GET_ERRORS,
        payload: {
          type: err.response.data.type,
          errors: err.response.data.errors
        }
      })
      dispatch(clearSuccess());
    })
}

// Login with Google
export const googleSignIn = (tokenObj, history) => dispatch => {
  var token = tokenObj.id_token;
  // decoded user info with JWT token
  var decoded = jwt_decode(token);
  
  // set user
  const user = {
    name: decoded.name,
    email: decoded.email,
    imageUrl: decoded.picture
  }
  // call POST request
  axios.post('/users/googleLogin', user)
    .then(res => {
      // save token to localstorage
      localStorage.setItem('jwtToken', res.data.token);
      // Apply to every request
      axios.defaults.headers.common['Authorization'] = res.data.token;
      // decoded user info with JWT token
      var decoded = jwt_decode(res.data.token);
      // Set current user
      dispatch({
        type: actions.SET_CURRENT_USER,
        payload: decoded
      })
    })
    .then(() => {
      dispatch(clearErrors());
      history.push('/users/dashboard');
    })
    .then(() => {
      // load all accounts
      dispatch(loadAccounts());
    })
    .catch(err => {
      dispatch({
        type: actions.GET_ERRORS,
        payload: {
          type: actions.SET_CURRENT_USER,
          errors: err.response.data
        }
      })
    })
};

// log in with facebook
export const facebookSignIn = (userInfo, history) => dispatch => {
  // set user
  const user = {
    name: userInfo.name,
    email: userInfo.email,
    imageUrl: userInfo.imageUrl
  }
  // call POST request
  axios.post('/users/facebookLogin', user)
    .then(res => {
      // save token to localstorage
      localStorage.setItem('jwtToken', res.data.token);
      // Apply to every request
      axios.defaults.headers.common['Authorization'] = res.data.token;
      // decoded user info with JWT token
      var decoded = jwt_decode(res.data.token);
      // Set current user
      dispatch({
        type: actions.SET_CURRENT_USER,
        payload: decoded
      })
    })
    .then(() => {
      dispatch(clearErrors());
      history.push('/users/dashboard');
    })
    .then(() => {
      // load all accounts
      dispatch(loadAccounts());
    })
    .catch(err => {
      dispatch({
        type: actions.GET_ERRORS,
        payload: {
          type: actions.SET_CURRENT_USER,
          errors: err.response.data
        }
      })
    })
};

// Log user out
export const logoutUser = () => dispatch => {
  // Remove token from localStorage
  localStorage.removeItem('jwtToken');
  // Remove auth header for future requests
  // Delete auth header
  delete axios.defaults.headers.common['Authorization'];
  // Set current user to {} which will set isAuthenticated to false
  dispatch({
    type: actions.SET_CURRENT_USER,
    payload: {}
  })
  dispatch({
    type: actions.GET_SUCCESS,
    payload: {
      success_msg: 'You are logged out.',
      type: actions.LOGOUT
    }
  })
  dispatch(clearErrors());
  
};

// Contact Trung
export const contact = (user) => dispatch => {
  dispatch(clearErrors());
  dispatch(clearSuccess());

  axios.post('/contact', user)
    .then(res => {
      dispatch({
        type: actions.GET_SUCCESS,
        payload: {
          success_msg: res.data.success_msg,
          type: actions.CONTACT_DEVELOPER
        }
      })
    })
    .catch(err => {
      dispatch({
        type: actions.GET_ERRORS,
        payload: {
          type: err.response.data.type,
          errors: err.response.data.errors
        }
      })
    })
}

// verify email before reset user password
export const verifyEmail = (email) => dispatch => {
  dispatch(clearErrors());
  dispatch(clearSuccess());

  axios.post('/users/verify', {email: email})
    .then(res => {
      dispatch({
        type: actions.GET_SUCCESS,
        payload: {
          success_msg: res.data.success_msg,
          type: actions.VERIFY_USER
        }
      })
    })
    .catch(err => {
      dispatch({
        type: actions.GET_ERRORS,
        payload: {
          type: actions.VERIFY_USER,
          errors: err.response.data
        }
      })
    });
};

// reset user password
export const resetPassword = (token, history) => dispatch => {
  axios.get(`/users/reset/${token}`)
    .then(res => {
      dispatch({
        type: actions.PASSWORD_RESET,
        payload: {
          user: res.data,
          resetPasswordToken: res.data.resetPasswordToken,
          resetPasswordExpires: res.data.resetPasswordExpires
        }
      })
      dispatch(clearSuccess());
    })
    .catch(err => {
      dispatch({
        type: actions.GET_ERRORS,
        payload: {
          type: actions.PASSWORD_RESET,
          errors: err.response.data
        }
      })
      dispatch(clearSuccess());
      history.push('/users/forgot');
    })
}

// Start reset password by comparing the two, then update!
export const updatePassword = (user, password, confirm_password, history) => dispatch => {
  axios.post(`/users/reset/update_password`, {
    user: user,
    password: password,
    confirm_password: confirm_password
  })
  .then(res => {
    dispatch({
      type: actions.GET_SUCCESS,
      payload: {
        success_msg: res.data.success_msg,
        type: actions.UPDATE_PASSWORD
      }
    })
    dispatch(clearErrors());
  })
  .catch(err => {
    dispatch({
      type: actions.GET_ERRORS,
      payload: {
        type: err.response.data.type,
        errors: err.response.data.errors
      }
    })
    if (err.response.data.type === actions.PASSWORD_RESET) {
      dispatch(clearSuccess());
      history.push('/users/forgot');
    }
  })
}

// update user info
export const updateUserAccount = (user_name) => dispatch => {
  axios.post(`/users/update`, {user_name: user_name})
    .then(res => {
      // save token to localstorage
      localStorage.setItem('jwtToken', res.data.token);
      // Set token to Auth header
      if (res.data.token) {
        // Apply to every request
        axios.defaults.headers.common['Authorization'] = res.data.token;
      }
      dispatch({
        type: actions.SET_CURRENT_USER,
        payload: res.data.user
      })
      dispatch({
        type: actions.GET_SUCCESS,
        payload: {
          success_msg: res.data.success_msg,
          type: actions.UPDATE_USER
        }
      })
      dispatch(clearErrors());
    })
    .catch(err => {
      dispatch({
        type: actions.GET_ERRORS,
        payload: {
          type: err.response.data.type,
          errors: err.response.data.errors
        }
      })
      dispatch(clearSuccess());
    })
}

// delete user account
export const deleteAccount = (history) => dispatch => {
  axios.delete('/users/delete')
    .then(res => {
      localStorage.removeItem('jwtToken');
      delete axios.defaults.headers.common['Authorization'];
      dispatch({
        type: actions.SET_CURRENT_USER,
        payload: {}
      })
      dispatch({
        type: actions.GET_SUCCESS,
        payload: {
          success_msg: res.data.success_msg,
          type: actions.DELETE_USER
        }
      })
      dispatch(clearErrors());
      history.push('/users/login')
    })
    .catch(err => {
      dispatch({
        type: actions.GET_ERRORS,
        payload: {
          type: actions.DELETE_USER,
          errors: err.response.data
        }
      })
    })
}

