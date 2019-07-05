import { combineReducers } from 'redux';
import userReducer from './userReducer';
import errorsReducer from './errorsReducer';
import successReducer from './successReducer';
import authReducer from './authReducer';
import accountReducer from './accountReducer';
import transactionReducer from './transactionReducer';
import dataAnalysisReducer from './dataAnalysisReducer';

export default combineReducers({
  users: userReducer,
  accounts: accountReducer,
  transactions: transactionReducer,
  auth: authReducer,
  errors: errorsReducer,
  success: successReducer,
  dataAnalysis: dataAnalysisReducer
});