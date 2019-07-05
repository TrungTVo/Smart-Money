import { GET_ALL_ACCOUNTS, 
    GET_ACCOUNTS_LOADING, 
    ADD_ACCOUNT,
    LOAD_ACCOUNT,
    UPDATE_ACCOUNT,
    DELETE_ACCOUNT
} from "../actions/types";

const initialState = {
  accounts: [],
  account: {},
  loading: false
}

export default function (state = initialState, action) {
  if (action.type === GET_ACCOUNTS_LOADING) {
    return {
      ...state,
      loading: true
    }
  } else if (action.type === GET_ALL_ACCOUNTS) {
    return {
      ...state,
      accounts: action.payload,
      loading: false
    }
  } else if (action.type === ADD_ACCOUNT) {
    return {
      ...state,
      accounts: [action.payload, ...state.accounts],
      account: action.payload
    }
  } else if (action.type === UPDATE_ACCOUNT) {
    const {account_id, updated_account} = action.payload;
    var found_account_index = state.accounts.findIndex(account => account._id === account_id);
    state.accounts[found_account_index] = updated_account;

    return {
      ...state,
      accounts: state.accounts,
      account: updated_account
    }
  } else if (action.type === DELETE_ACCOUNT) { 
    return {
      ...state,
      accounts: state.accounts.filter(account => account._id !== action.payload)
    }
  } else if (action.type === LOAD_ACCOUNT) {
    return {
      ...state,
      account: action.payload
    }
  } else {
    return state;
  }
}