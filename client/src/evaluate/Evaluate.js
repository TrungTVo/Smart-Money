import React, { Component } from 'react';
import NavBar from '../layouts/NavBar';
import Footer from '../layouts/Footer';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import { connect } from 'react-redux';
import { loadAccounts } from '../actions/accountActions';
import Chart from "react-apexcharts";
import { analysis, overall_analysis } from '../actions/dataAnalysis';
import { isNumber } from 'util';
import { currencyTypes, dateConverter } from '../dictionary/dictionary';
import { numberWithCommas } from '../utils/Utils';
import randomColors from '../common/randomColors';

// random colors array
const colors_array = randomColors(50);
var color_label = randomColors(50);
color_label.fill('#999999');

class Evaluate extends Component {
  state = {
    tabIndex: 0,
    selected_account_id: '',
    selected_month: new Date().getMonth()+1,
    selected_year: new Date().getFullYear(),
    selected_overallYear: new Date().getFullYear(),
    rendered: false,

    options: {},
    series: [],
    labels: []
  }

  componentDidMount() {
    this.props.loadAccounts();
  }

  componentWillReceiveProps(nextProps) {
    const { accounts} = nextProps;
    const {selected_month, selected_year} = this.state

    if (!accounts.loading && accounts.accounts.length > 0) {
      if (!this.state.rendered) {
        this.setState({
          selected_account_id: accounts.accounts[0]._id
        }, () => {
          if (!this.state.rendered) {
            this.setState({ rendered: true}, () => {
              if (this.state.selected_account_id !== '') {
                this.props.analysis(this.state.selected_account_id, selected_month, selected_year);
                this.props.overall_analysis(this.state.selected_account_id, this.state.selected_overallYear);
              }
            })
          }
        })
      }
    }
  }

  onChange = (e) => {
    const target_type = e.target.id;

    this.setState({
      [e.target.id]: e.target.value
    }, () => {
      if (target_type === 'selected_account_id') {
        if (this.state.selected_account_id !== '') {
          this.props.analysis(this.state.selected_account_id, this.state.selected_month, this.state.selected_year);
          this.props.overall_analysis(this.state.selected_account_id, this.state.selected_overallYear);
        }
      } else if (target_type === 'selected_month' || target_type === 'selected_year') {
        // analysis based on specific month of year
        if (this.state.selected_account_id !== '') {
          this.props.analysis(this.state.selected_account_id, this.state.selected_month, this.state.selected_year);
        }
      } else {
        // overall analysis based on year
        if (this.state.selected_account_id !== '') {
          this.props.overall_analysis(this.state.selected_account_id, this.state.selected_overallYear);
        }
      }
    })
  }

  render() {
    const { selected_account_id, selected_month, selected_year, selected_overallYear} = this.state;
    const {accounts, dataAnalysis } = this.props;
    const {account} = dataAnalysis;
    let hasPositive = [];
    let colors = [];

    if (!dataAnalysis.loading){
      hasPositive = dataAnalysis.amounts.filter(amount => amount > 0);
      dataAnalysis.amounts.forEach((amount, i) => {
        dataAnalysis.amounts[i] = Math.abs(amount)
      })
      colors = colors_array.slice(0, dataAnalysis.categories.length);
    }

    return (
      <div>
        <NavBar active="evaluate" />

        <div className="container mt-3 mb-5">
          <Tabs defaultFocus={true} selectedIndex={this.state.tabIndex} onSelect={tabIndex => this.setState({ tabIndex })}>
            <TabList>
              <Tab>
                <i className='fas fa-chart-bar'></i><span>&nbsp;&nbsp;</span>
                Expense statistics <span>&nbsp;&nbsp;</span>
                {
                  accounts.loading ? null :
                    <span className="badge badge-secondary badge-pill">{accounts.accounts.length}</span>
                }

              </Tab>
              <Tab>
                <i className='fas fa-calculator'></i><span>&nbsp;&nbsp;</span>
                Investing tools
              </Tab>
            </TabList>

            <TabPanel >
              <br />
              <div id='statistics' className='m-auto'>
                <h4 className='text-muted'>
                  <i className='fas fa-piggy-bank'>&nbsp;</i> Know what you're spending daily
                </h4>
                {
                  accounts.loading ? null :
                  (
                    accounts.accounts.length === 0 ?
                    'You currently have no accounts.' : null
                  )
                }
                <div className="form-group row justify-content-start" style={{ 'display': 'flex', 'alignItems': 'center' }}>
                  <label htmlFor="currency" className="col-md-4 col-sm-6 col-xs-12 col-form-label">
                    <span className='lead text-muted'>Select account:</span>
                  </label>
                  <div className="form-group col-md-7 col-sm-5 col-xs-12 mt-2">
                    <select className="custom-select" id='selected_account_id' value={selected_account_id}
                      onChange={this.onChange} >
                      {
                        !accounts.loading && accounts.accounts.map((account) => 
                          <option key={account._id} value={account._id}>{account.name}</option>
                        )
                      }
                    </select>
                    
                  </div>
                </div>
                

                <div className="row justify-content-between mb-3">
                  <div className="col-md-6 col-sm-12">
                    <div className="row justify-content-start" style={{ 'display': 'flex', 'alignItems': 'center' }}>
                      <label htmlFor="month" className="col-5 col-form-label">
                        <span className='lead text-muted'>Month:</span>
                      </label>
                      <div className="form-group col-7 mt-2">
                        <select className="custom-select" id='selected_month' value={selected_month} onChange={this.onChange} >
                          {
                            [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12].map((month,i) =>
                              <option key={i} value={month}>{month.toString().padStart(2,0)}</option>
                            )
                          }
                          
                        </select>
                      </div>
                    </div>
                  </div>

                  <div className="col-md-6 col-sm-12">
                    <div className="row justify-content-start" style={{ 'display': 'flex', 'alignItems': 'center' }}>
                      <label htmlFor="year" className="col-5 col-form-label">
                        <span className='lead text-muted'>Year:</span>
                      </label>
                      <div className="form-group col-7 mt-2">
                        <select className="custom-select" id='selected_year' value={selected_year} onChange={this.onChange} >
                          <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>
                          <option value={new Date().getFullYear()-1}>{new Date().getFullYear()-1}</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {
                dataAnalysis.analyzing ?
                  <div className="d-flex justify-content-center mb-4">
                    <div className="spinner-border" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                  :
                  (
                    dataAnalysis.earned === 0 && dataAnalysis.expense === 0 ?
                    <p className='lead text-muted'>No transactions found.</p>
                    :
                      <div>
                        <div className="row justify-content-between">
                          <div className="col-md-6 col-sm-12">
                            <div className='card card-header rounded-0 border-0'>
                              <div className='d-flex'>
                                <div className='mr-auto'>
                                  <small className='text-dark'>Earned:</small> <span className='text-success'>{currencyTypes[account.currency]}{!dataAnalysis.loading && isNumber(dataAnalysis.earned) ? numberWithCommas(dataAnalysis.earned) : ''}</span>
                                </div>
                                <div>
                                  <small className='text-dark'>Expense:</small> <span className='text-danger'>-{currencyTypes[account.currency]}{!dataAnalysis.loading && isNumber(dataAnalysis.expense) ? numberWithCommas(Math.abs(dataAnalysis.expense)) : ''}</span>
                                </div>
                              </div>
                            </div>
                            <div className='card border-0 rounded-0 text-dark pt-3 pb-3'>
                              <div className='m-auto text-center'>
                                <div className='mb-3'>
                                  <small className='lead text-info'>{dateConverter[selected_month]}, {selected_year}</small>
                                </div>
                                <div className='mb-3'>
                                  <small className='lead text-info'>Click on labels to view details</small>
                                </div>
                                <Chart
                                  options={{
                                    legend: {
                                      position: 'bottom',
                                      labels: {
                                        colors: '#666666'
                                      }
                                    },
                                    labels: [
                                      'earned',
                                      'expense'
                                    ],
                                    colors: ['#66DA26', '#E91E63'],
                                    plotOptions: {
                                      pie: {
                                        donut: {
                                          size: '55%',
                                          labels: {
                                            show: true,
                                            name: {
                                              show: true,
                                            },
                                            value: {
                                              show: true,
                                              offsetY: 3,
                                              fontSize: '9px',
                                              formatter: function (val) {
                                                return currencyTypes[account.currency] + '' + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                              }
                                            }
                                          }
                                        }
                                      }
                                    }
                                  }}
                                  series={
                                    !dataAnalysis.loading && isNumber(dataAnalysis.earned) && isNumber(dataAnalysis.expense) ? [dataAnalysis.earned, Math.abs(dataAnalysis.expense)] : []
                                  }
                                  type="donut"
                                />
                              </div>
                            </div>
                          </div>

                          <div className="col-md-6 col-sm-12">
                            <div className='card border-0' >
                              <Chart
                                options={{
                                  colors: colors,
                                  xaxis: {
                                    axisBorder: {
                                      show: false
                                    },
                                    categories: !dataAnalysis.loading ? dataAnalysis.categories : [],
                                    labels: {
                                      show: true,
                                      rotate: -45,
                                      style: {
                                        colors: color_label.slice(0, dataAnalysis.categories.length)
                                      }
                                    }
                                  },
                                  yaxis: {
                                    show: false,
                                    logarithmic: true,
                                    decimalsInFloat: 0,
                                    max: hasPositive.length === 0 ? 0 :
                                      (!dataAnalysis.loading ? Math.max(...dataAnalysis.amounts) : 0)
                                  },
                                  plotOptions: {
                                    bar: {
                                      columnWidth: '45%',
                                      distributed: true,
                                    }
                                  },
                                  dataLabels: {
                                    enabled: false
                                  },
                                  tooltip: {
                                    y: {
                                      formatter: function (val) {
                                        return currencyTypes[account.currency] + '' + val.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",")
                                      }
                                    }
                                  }
                                }}
                                series={
                                  [{
                                    name: 'amount',
                                    data: !dataAnalysis.loading ? dataAnalysis.amounts : []
                                  }]
                                }
                                type="bar"
                                width="100%"
                                height='350'
                              />
                              <div >
                                {
                                  !dataAnalysis.loading && (dataAnalysis.earned || dataAnalysis.expense) ?
                                    Object.entries(dataAnalysis.data).map((data, i) =>
                                      <div key={i} className='ml-3' style={{ 'display': 'inline-flex', 'alignItems': 'center' }}>
                                        <div style={{ backgroundColor: colors[i], height: '10px', width: '10px' }} className='mr-2'></div>
                                        <span style={{ color: 'black' }} className='text-muted' >{data[0]}:</span>
                                        <span className={data[1] > 0 ? 'text-success' : 'text-danger'}>&nbsp;&nbsp; {data[1] < 0 ? '-' : ''}{currencyTypes[account.currency]}{numberWithCommas(parseFloat(Math.abs(data[1]).toFixed(2)))}</span>
                                      </div>
                                    )
                                    : null
                                }
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <br/><br/>
                                
                      </div>
                  )
                  
              }
              <hr/>
              <h4 className='text-muted'>
                Overall statistics
              </h4>
              <div className="row justify-content-start" style={{ 'display': 'flex', 'alignItems': 'center' }}>
                <label htmlFor="year" className="col-5 col-form-label">
                  <span className='lead text-muted'>Year:</span>
                </label>
                <div className="form-group col-7 mt-2">
                  <select className="custom-select" id='selected_overallYear' value={selected_overallYear} onChange={this.onChange} >
                    <option value={new Date().getFullYear()}>{new Date().getFullYear()}</option>
                    <option value={new Date().getFullYear() - 1}>{new Date().getFullYear() - 1}</option>
                  </select>
                </div>
              </div>
              <br/>

              {
                selected_account_id === '' ?
                  <p className='lead text-muted'>No bank accounts found.</p> :
                  null
              }

              {
                dataAnalysis.overall_analyzing ?
                  <div className="d-flex justify-content-center mb-4">
                    <div className="spinner-border" role="status">
                      <span className="sr-only">Loading...</span>
                    </div>
                  </div>
                  :
                  <div>
                    <Chart
                      options={{
                        colors: ['#66DA26', '#E91E63', '#0000ff'],
                        dataLabels: {
                          enabled: false
                        },
                        stroke: {
                          curve: 'smooth',
                          width: [2, 2, 0],
                          dashArray: [0, 0, 0]
                        },
                        title: {
                          text: `Earning vs Expense for ${selected_overallYear}`,
                          align: 'center',
                          style: {
                            color: '#999999'
                          }
                        },
                        grid: {
                          row: {
                            colors: ['#f3f3f3', 'transparent'], // takes an array which will be repeated on columns
                            opacity: 0.5
                          },
                        },
                        legend: {
                          show: false
                        },
                        xaxis: {
                          categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
                          axisBorder: {
                            show: false
                          },
                          labels: {
                            show: true,
                            rotate: -45,
                            rotateAlways: true
                          },
                        },
                        yaxis: {
                          labels: {
                            formatter: (value) => {
                              const val = Math.abs(value);
                              if (value >= 0) {
                                if (val < 1000) return currencyTypes[account.currency] + '' + val;
                                return val >= 1000 && val < 1000000 ?
                                  currencyTypes[account.currency] + '' + parseFloat((val / 1000).toFixed(1)) + 'k' : (
                                    val >= 1000000 && val < 1000000000 ?
                                      currencyTypes[account.currency] + '' + parseFloat((val / 1000000).toFixed(1)) + 'm' : currencyTypes[account.currency] + '' + parseFloat((val / 1000000000).toFixed(1)) + 'b'
                                  )
                              } else {
                                if (val < 1000) return '-' + currencyTypes[account.currency] + '' + val;
                                return val >= 1000 && val < 1000000 ?
                                  '-' + currencyTypes[account.currency] + '' + parseFloat((val / 1000).toFixed(1)) + 'k' : (
                                    val >= 1000000 && val < 1000000000 ?
                                      '-' + currencyTypes[account.currency] + '' + parseFloat((val / 1000000).toFixed(1)) + 'm' : '-' + currencyTypes[account.currency] + '' + parseFloat((val / 1000000000).toFixed(1)) + 'b'
                                  )
                              }
                            },
                          }
                        },
                        tooltip: {
                          y: {
                            formatter: function (value) {
                              const val = Math.abs(value);
                              if (value >= 0) {
                                if (val < 1000) return currencyTypes[account.currency] + '' + val;
                                return val >= 1000 && val < 1000000 ?
                                  currencyTypes[account.currency] + '' + parseFloat((val / 1000).toFixed(1)) + 'k' : (
                                    val >= 1000000 && val < 1000000000 ?
                                      currencyTypes[account.currency] + '' + parseFloat((val / 1000000).toFixed(1)) + 'm' : currencyTypes[account.currency] + '' + parseFloat((val / 1000000000).toFixed(1)) + 'b'
                                  )
                              } else {
                                if (val < 1000) return '-' + currencyTypes[account.currency] + '' + val;
                                return val >= 1000 && val < 1000000 ?
                                  '-' + currencyTypes[account.currency] + '' + parseFloat((val / 1000).toFixed(1)) + 'k' : (
                                    val >= 1000000 && val < 1000000000 ?
                                      '-' + currencyTypes[account.currency] + '' + parseFloat((val / 1000000).toFixed(1)) + 'm' : '-' + currencyTypes[account.currency] + '' + parseFloat((val / 1000000000).toFixed(1)) + 'b'
                                  )
                              }
                            }
                          }
                        }
                      }}
                      series={[
                        {
                          name: "Earned",
                          data: selected_account_id === '' || (typeof selected_account_id === 'string' && selected_account_id.length === 0) ? [] :
                            (!dataAnalysis.overall_analyzing ? Object.values(dataAnalysis.overall_data).map(pair => pair.earned) : []),
                        },
                        {
                          name: "Expense",
                          data: selected_account_id === '' || (typeof selected_account_id === 'string' && selected_account_id.length === 0) ? [] :
                            (!dataAnalysis.overall_analyzing ? Object.values(dataAnalysis.overall_data).map(pair => pair.expense) : []),
                        },
                        {
                          name: "Budget per month",
                          data: selected_account_id === '' || (typeof selected_account_id === 'string' && selected_account_id.length === 0) ? [] :
                            (!dataAnalysis.overall_analyzing && dataAnalysis.account.budget !== 0 ? Array(12).fill(-dataAnalysis.account.budget) : []),
                        }
                      ]}
                      height='350'
                      type='area'
                      width="100%"
                  />

                    <div className='text-center'>
                      <div className='ml-3' style={{ 'display': 'inline-flex', 'alignItems': 'center' }}>
                        <div style={{ backgroundColor: '#00E396', height: '10px', width: '10px' }} className='mr-2'></div>
                        <span style={{ color: 'black' }} className='text-muted' >Earning</span>
                      </div>
                      <div className='ml-3' style={{ 'display': 'inline-flex', 'alignItems': 'center' }}>
                        <div style={{ backgroundColor: '#FF4560', height: '10px', width: '10px' }} className='mr-2'></div>
                        <span style={{ color: 'black' }} className='text-muted' >Expense</span>
                      </div>
                      <div className='ml-3' style={{ 'display': 'inline-flex', 'alignItems': 'center' }}>
                        <div style={{ backgroundColor: '#0000FF', height: '10px', width: '10px' }} className='mr-2'></div>
                        <span style={{ color: 'black' }} className='text-muted' >Budget/month</span>
                      </div>
                    </div>
                  </div>
              }

            </TabPanel>

            <TabPanel >
              <br />
              <div id='invest_tools' className='m-auto'>
                to be updated soon ...
              </div>
            </TabPanel>

          </Tabs>
        </div>

        <Footer />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  accounts: state.accounts,
  dataAnalysis: state.dataAnalysis,
  success: state.success
})

export default connect(mapStateToProps, { loadAccounts, analysis, overall_analysis})(Evaluate);
