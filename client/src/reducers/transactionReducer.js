import {
  GET_ALL_TRANSACTIONS,
  GET_TRANSACTIONS_LOADING,
  ADD_TRANSACTION,
  UPDATE_TRANSACTION,
  DELETE_TRANSACTION
} from "../actions/types";

const initialState = {
  account: {},
  transactions: [],
  transaction: {},
  loading: false
}

export default function (state = initialState, action) {
  if (action.type === GET_TRANSACTIONS_LOADING) {
    return {
      ...state,
      loading: true
    }
  } else if (action.type === GET_ALL_TRANSACTIONS) {
    return {
      ...state,
      loading: false,
      transactions: action.payload.transactions,
      account: action.payload.account,
    }
  } else if (action.type === ADD_TRANSACTION) {
    return {
      ...state,
      transactions: [action.payload.transaction, ...state.transactions],
      transaction: action.payload.transaction,
      account: action.payload.account
    }
  } else if (action.type === UPDATE_TRANSACTION) {
    const {updated_transaction, updated_account} = action.payload;
    var found_transaction_index = state.transactions.findIndex(transaction => transaction._id === updated_transaction._id);
    state.transactions[found_transaction_index] = updated_transaction;

    return {
      ...state,
      transactions: state.transactions,
      transaction: updated_transaction,
      account: updated_account
    }
  } else if (action.type === DELETE_TRANSACTION) {
    return {
      ...state,
      loading: false,
      account: action.payload.account,
      transactions: state.transactions.filter(transaction => transaction._id !== action.payload.transaction_id)
    }
  } else {
    return state;
  }
}