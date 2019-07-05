import axios from 'axios';
import * as actions from './types';

export const analysis = (account_id, month, year) => dispatch => {
  dispatch({
    type: actions.DATA_ANALYZING
  })
  axios.post('/analysis', {
    account_id: account_id,
    month: month,
    year: year
  })
    .then(res => {
      dispatch({
        type: actions.DATA_ANALYSIS,
        payload: {
          categories: res.data.categories,
          amounts: res.data.amounts,
          data: res.data.data,
          earned: res.data.earned,
          expense: res.data.expense,
          account: res.data.account
        }
      })
      dispatch({
        type: actions.GET_SUCCESS,
        payload: {
          success_msg: 'Data analyzed',
          type: actions.DATA_ANALYSIS
        }
      })
    })
    .catch(err => {
      dispatch({
        type: actions.GET_ERRORS,
        payload: {
          type: actions.DATA_ANALYSIS,
          errors: err.response.data
        }
      })
    })
}

export const overall_analysis = (account_id, year) => dispatch => {
  dispatch({
    type: actions.OVERALL_ANALYZING
  })
  axios.post('/overall_analysis', {
    account_id: account_id,
    year: year
  })
    .then(res => {
      dispatch({
        type: actions.OVERALL_ANALYSIS,
        payload: {
          data: res.data.data,
          account: res.data.account
        }
      })
      dispatch({
        type: actions.GET_SUCCESS,
        payload: {
          success_msg: 'Data analyzed',
          type: actions.OVERALL_ANALYSIS
        }
      })
    })
    .catch(err => {
      dispatch({
        type: actions.GET_ERRORS,
        payload: {
          type: actions.OVERALL_ANALYSIS,
          errors: err.response.data
        }
      })
    })
}
