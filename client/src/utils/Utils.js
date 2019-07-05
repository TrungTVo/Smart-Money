import { isNumber } from 'util';

// convert number to comma form with thousands separator
export const numberWithCommas = (x) => {
  if (isNumber(x))
    return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
  else
    return '';
}