import React, { Component } from 'react'
import {connect} from 'react-redux';
import { analysis} from '../../actions/dataAnalysis';
import Chart from "react-apexcharts";

class MyChart extends Component {
  state = {
    options: {
      chart: {
        id: "basic-bar"
      },
      xaxis: {
        categories: [1991, 1992, 1993, 1994, 1995, 1996, 1997, 1998, 1999]
      }
    },
    series: [
      {
        name: "series-1",
        data: [30, 40, 45, 50, 49, 60, 70, 91]
      }
    ]
  };

  componentWillReceiveProps(nextProps) {
    const {account_id} = nextProps;

    //this.props.analysis(account_id);
  }

  render() {
    const { dataAnalysis } = this.props;
    console.log(dataAnalysis);
    return (
      <div>
        {
          dataAnalysis.analyzing ? 
            <div className="d-flex justify-content-center mb-4">
              <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div>
          : 
            <Chart
              options={this.state.options}
              series={this.state.series}
              type="bar"
              width="500"
            />
            
        }
        
      </div>
    )
  }
}

const mapStateToProps = state => ({
  dataAnalysis: state.dataAnalysis
}) 

export default connect(mapStateToProps, {analysis})(MyChart);