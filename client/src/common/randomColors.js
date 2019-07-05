const randomColor = require('randomcolor');

const generate_randomColor = (count) => {
  return new randomColor({ count: count });
}
export default generate_randomColor;