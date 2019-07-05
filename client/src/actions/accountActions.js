import axios from 'axios';
import * as actions from './types';
import { clearErrors, clearSuccess } from './clearErrSuccess';

// add new account
export const addAccount = (account) => dispatch => {
  dispatch(clearErrors());
  dispatch(clearSuccess());

  axios.post('/accounts/new', account)
    .then(res => {
      dispatch({
        type: actions.GET_SUCCESS,
        payload: {
          success_msg: res.data.success_msg,
          type: actions.ADD_ACCOUNT
        }
      })
      dispatch({
        type: actions.ADD_ACCOUNT,
        payload: res.data.new_account
      })
    })
    .catch(err => {
      dispatch({
        type: actions.GET_ERRORS,
        payload: {
          type: actions.ADD_ACCOUNT,
          errors: err.response.data
        }
      })
    })
}

// load all accounts
export const loadAccounts = () => dispatch => {
  dispatch(accountsLoading());
  axios.get('/accounts/all')
    .then(res => {
      dispatch({
        type: actions.GET_ALL_ACCOUNTS,
        payload: res.data
      })
    })
    .catch(err => {
      dispatch({
        type: actions.GET_ERRORS,
        payload: {
          type: actions.GET_ALL_ACCOUNTS,
          errors: err.response.data
        }
      })
    })
}

// load account with id
export const loadAccount = (account_id) => dispatch => {
  axios.get(`/accounts/load/${account_id}`)
    .then(res => {
      dispatch({
        type: actions.LOAD_ACCOUNT,
        payload: res.data
      })
    })
    .catch(err => {
      dispatch({
        type: actions.GET_ERRORS,
        payload: {
          type: actions.LOAD_ACCOUNT,
          errors: err.response.data
        }
      })
    })
}

// update bank account
export const update_bankAccount = (account) => dispatch => {
  dispatch(clearErrors());
  dispatch(clearSuccess());

  axios.post(`/accounts/update/${account.id}`, {account: account})
    .then(res => {
      dispatch({
        type: actions.UPDATE_ACCOUNT,
        payload: {
          account_id: res.data.account_id,
          updated_account: res.data.updated_account
        }
      })
      dispatch({
        type: actions.GET_SUCCESS,
        payload: {
          success_msg: res.data.success_msg,
          type: actions.UPDATE_ACCOUNT
        }
      })
    })
    .catch(err => {
      dispatch({
        type: actions.GET_ERRORS,
        payload: {
          type: actions.UPDATE_ACCOUNT,
          errors: err.response.data
        }
      })
    })
}

// delete bank account
export const delete_bankAccount = (account_id) => dispatch => {
  dispatch(clearErrors());
  dispatch(clearSuccess());

  axios.delete(`/accounts/delete/${account_id}`)
    .then(res => {
      dispatch({
        type: actions.GET_SUCCESS,
        payload: {
          success_msg: res.data.success_msg,
          type: actions.DELETE_ACCOUNT
        }
      })
      dispatch({
        type: actions.DELETE_ACCOUNT,
        payload: res.data.account_id
      })
    })
    .catch(err => {
      dispatch({
        type: actions.GET_ERRORS,
        payload: {
          type: actions.DELETE_ACCOUNT,
          errors: err.response.data
        }
      })
    })
}

// set accounts loading
const accountsLoading = () => dispatch => {
  dispatch({
    type: actions.GET_ACCOUNTS_LOADING
  })
}