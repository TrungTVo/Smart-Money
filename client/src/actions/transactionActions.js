import axios from 'axios';
import * as actions from './types';
import { clearErrors, clearSuccess } from './clearErrSuccess';
import {loadAccounts, loadAccount} from './accountActions';

// load all transactions
export const loadTransactions = (account_id) => dispatch => {
  dispatch(transactionsLoading());
  dispatch(loadAccount(account_id));

  axios.get(`/accounts/${account_id}/transactions/all`)
    .then(res => {
      dispatch({
        type: actions.GET_ALL_TRANSACTIONS,
        payload: {
          transactions: res.data.transactions,
          account: res.data.account
        }
      })
    })
    .catch(err => {
      dispatch({
        type: actions.GET_ERRORS,
        payload: {
          type: actions.GET_ALL_TRANSACTIONS,
          errors: err.response.data
        }
      })
    })
}

// add new transaction
export const addTransaction = (transaction) => dispatch => {
  dispatch(clearErrors());
  dispatch(clearSuccess());
  dispatch(loadAccount(transaction.bankAccount._id));
  
  axios.post(`/accounts/${transaction.bankAccount._id}/transactions/add`, transaction)
    .then(res => {
      dispatch({
        type: actions.ADD_TRANSACTION,
        payload: {
          transaction: res.data.new_transaction,
          account: res.data.account
        }
      })
      dispatch({
        type: actions.GET_SUCCESS,
        payload: {
          success_msg: res.data.success_msg,
          type: actions.ADD_TRANSACTION,
          account: transaction.bankAccount.name
        }
      })
    })
    // .then(() => {
    //   dispatch(loadAccounts());
    // })
    .catch(err => {
      dispatch({
        type: actions.GET_ERRORS,
        payload: {
          type: actions.ADD_TRANSACTION,
          errors: err.response.data
        }
      })
    })
}

// update transaction
export const update_transaction = (transaction) => dispatch => {
  dispatch(clearErrors());
  dispatch(clearSuccess());
  dispatch(loadAccount(transaction.bankAccount._id));

  axios.post(`/accounts/${transaction.bankAccount._id}/transactions/update`, transaction)
    .then(res => {
      dispatch({
        type: actions.UPDATE_TRANSACTION,
        payload: {
          updated_transaction: res.data.updated_transaction,
          updated_account: res.data.updated_account
        }
      })
      dispatch({
        type: actions.GET_SUCCESS,
        payload: {
          success_msg: res.data.success_msg,
          type: actions.UPDATE_TRANSACTION,
          account: transaction.bankAccount.name
        }
      })
    })
    .then(() => {
      dispatch(loadAccounts());
    })
    .catch(err => {
      dispatch({
        type: actions.GET_ERRORS,
        payload: {
          type: actions.UPDATE_TRANSACTION,
          errors: err.response.data
        }
      })
    })
}

// delete transaction
export const delete_transaction = (bankAccount, transaction) => dispatch => {
  dispatch(clearErrors());
  dispatch(clearSuccess());
  dispatch(loadAccount(bankAccount._id));
  dispatch(transactionsLoading());

  axios.post(`/accounts/${bankAccount._id}/transactions/delete/${transaction._id}`, {transaction_amount: transaction.amount})
    .then(res => {
      dispatch({
        type: actions.DELETE_TRANSACTION,
        payload: {
          account: res.data.account,
          transaction_id: transaction._id
        }
      })
      dispatch({
        type: actions.GET_SUCCESS,
        payload: {
          success_msg: res.data.success_msg,
          type: actions.DELETE_TRANSACTION,
          account: bankAccount.name
        }
      })
    })
    // .then(() => {
    //   dispatch(loadAccounts());
    // })
    .catch(err => {
      dispatch({
        type: actions.GET_ERRORS,
        payload: {
          type: actions.DELETE_TRANSACTION,
          errors: err.response.data
        }
      })
    })
}


// set transactions loading
const transactionsLoading = () => dispatch => {
  dispatch({
    type: actions.GET_TRANSACTIONS_LOADING
  })
}
