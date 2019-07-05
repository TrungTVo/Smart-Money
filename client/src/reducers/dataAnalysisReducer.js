import { DATA_ANALYSIS, DATA_ANALYZING, OVERALL_ANALYSIS, OVERALL_ANALYZING } from '../actions/types';

const initialState = {
  // for analysis based on month only
  categories: [],
  amounts: [],
  data: {},
  earned: 0.0,
  expense: 0.0,
  account: {},
  analyzing: false,

  // for overall analysis (by year)
  overall_analyzing: false,
  overall_data: {}
};

export default function (state = initialState, action) {
  switch (action.type) {
    
    case DATA_ANALYSIS:
      return {
        ...state,
        categories: action.payload.categories,
        amounts: action.payload.amounts,
        data: action.payload.data,
        earned: action.payload.earned,
        expense: action.payload.expense,
        account: action.payload.account,
        analyzing: false
      }

    case DATA_ANALYZING:
      return {
        ...state,
        analyzing: true
      }

    case OVERALL_ANALYSIS:
      return {
        ...state,
        overall_data: action.payload.data,
        overall_analyzing: false
      }

    case OVERALL_ANALYZING:
      return {
        ...state,
        overall_analyzing: true
      }
    
    default:
      return state;
  }
}
