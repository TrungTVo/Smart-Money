import React, { Component } from 'react';
import NavBar from '../layouts/NavBar';
import Footer from '../layouts/Footer';
import ManageAccounts from './ManageAccounts';
import {loadAccounts} from '../actions/accountActions';
import {connect} from 'react-redux';
import DailyTransactions from './DailyTransactions';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';


class MainTools extends Component {

  state = {
    tabIndex: 0,
    numAccounts: 0
  }

  componentDidMount() {
    // load all accounts
    this.props.loadAccounts();
  }

  componentWillReceiveProps(nextProps) {
    const { accounts } = nextProps;
    if (!accounts.loading) {
      this.setState({
        numAccounts: accounts.accounts.length
      })
    }
  }

  render() {
    const {accounts} = this.props;
    const { numAccounts } = this.state;

    return (
      <div>
        <NavBar active="tools"/>
        <div className="container mt-3 mb-5">
          {/* <div className="row justify-content-around">
            <div className="col-md-3 col-sm-12">
              <div className="list-group list-group-flush" role="tablist" >

                <a className={"list-group-item list-group-item-action " }
                  onClick={this.onClick} id="daily-transactions" name="daily-transactions"
                  data-toggle="list" href="#content-daily-transactions" role="tab"
                  aria-controls="daily-transactions">
                  <i className='fas fa-file-alt'></i><span>&nbsp;&nbsp;</span>
                  Your daily transactions <span>&nbsp;&nbsp;</span>
                  {
                    !accounts.loading ?
                      <span className="badge badge-secondary badge-pill">{accounts.accounts.length}</span> : null
                  }
                </a>

                <a className={"list-group-item list-group-item-action active "}
                  onClick={this.onClick} id="manage-account" name="manage-account"
                  data-toggle="list" href="#content-manage-account" role="tab"
                  aria-controls="manage-account">
                  <i className='fas fa-user'></i><span>&nbsp;&nbsp;</span>
                  Manage accounts
                </a>
                

                <a className={"list-group-item list-group-item-action " } 
                    onClick={this.onClick} id="statistics" name="statistics"
                    data-toggle="list" href="#content-statistics" role="tab" 
                    aria-controls="statistics">
                    <i className='fas fa-chart-bar'></i><span>&nbsp;&nbsp;</span>
                    What do I spend my money on?
                </a>
                <a className={"list-group-item list-group-item-action " }
                  onClick={this.onClick} id="invest-calculator" name="invest-calculator"
                  data-toggle="list" href="#content-invest-calculator" role="tab"
                  aria-controls="invest-calculator">
                  <i className='fas fa-calculator'></i><span>&nbsp;&nbsp;</span>
                  Your investing calculator
                </a>
                
              </div>
            </div>


            <div className="col-md-9 mt-5">
              <div className="tab-content" id="nav-tabContent">
                <div className="tab-pane fade" id="content-daily-transactions" role="tabpanel" >
                  <DailyTransactions accounts={accounts} />
                </div>
                
                <div className="tab-pane fade show active" id="content-manage-account" role="tabpanel" aria-labelledby="list-manage-account-list">
                  <ManageAccounts />
                </div>

                <div className="container tab-pane fade m-auto" id="content-statistics" role="tabpanel" aria-labelledby="list-statistics-list">
                  <MyChart type={'bar'} position={'bottom'} data={data.pie_bar_data} accounts={accounts} /><br/>
                </div>

                <div className="tab-pane fade m-auto" id="content-invest-calculator" role="tabpanel" aria-labelledby="list-invest-calculator-list">
                  To be updated soon ...
                </div>
              </div>
            </div>
            
          </div> */}
          
          <Tabs defaultFocus={true} selectedIndex={this.state.tabIndex} onSelect={tabIndex => this.setState({ tabIndex })}>
            <TabList>
              <Tab>
                <i className='fas fa-file-alt'></i><span>&nbsp;&nbsp;</span>
                Transactions <span>&nbsp;&nbsp;</span>
                {
                  numAccounts === 0 ? null : 
                    <span className="badge badge-secondary badge-pill">{numAccounts}</span>
                }
                
              </Tab>
              <Tab>
                <i className='fas fa-user'></i><span>&nbsp;&nbsp;</span>
                  Accounts
              </Tab>
            </TabList>
            
            <TabPanel >
              <br />
              <div id='daily_transactions' className='m-auto'>
                <DailyTransactions accounts={accounts} />
              </div>
            </TabPanel>
            <TabPanel >
              <br />
              <div id='manage_accounts' className='m-auto'>
                <ManageAccounts />
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
  auth: state.auth,
  accounts: state.accounts,
  transactions: state.transactions,
})

export default connect(mapStateToProps, { loadAccounts})(MainTools);
