import randomColor from '../common/randomColors';
var colors = randomColor(12);

const data = {
  line_data: {
    labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
    datasets: [
      {
        label: 'Gas',
        data: [18, 27, 11, 10, 13, 9, 12, 22, 32, 42, 50, 60],
        borderColor: colors[0],
        fill: false,
      },
      {
        label: 'Electric',
        data: [30, 17, 41, 10, 23, 69, 42, 12, 39, 32, 57, 78],
        borderColor: colors[1],
        fill: false
      }
    ]
  },
  pie_bar_data: {
    labels: ["General", "Gas", "Bills", "Electric", "Tuition", "Cars", "House", "Stuff", "Kids", "Entertainment", "Hospitals"],
    datasets: [
      {
        data: [18, 27, 11, 10, 13, 9, 12, 22, 32, 42, 50],
        backgroundColor: randomColor(11)
      }
    ]
  }
}

export default data;
