import React, { Component } from 'react';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import "react-tabs/style/react-tabs.css";
import AccountDetails from './AccountDetails';
import {connect} from 'react-redux';
import AlertMessage from '../common/AlertMessage';
import * as actions from '../actions/types';

class DailyTransactions extends Component {
  state = {
    tabIndex: 0
  }
  render() {
    const { accounts, success} = this.props;
    let content;
    if (accounts.loading) {
      content = <div className="d-flex justify-content-center">
        <div className="spinner-border" role="status">
          <span className="sr-only">Loading...</span>
        </div>
      </div>
    } else {
      content = 
      <div>
        {
          success.type === actions.DELETE_ACCOUNT && typeof success.success_msg !== 'undefined' && success.success_msg !== '' ?
            <AlertMessage variant={'success'} message={success.success_msg} /> : null
        }
  
        <p>You currently have {accounts.accounts.length} accounts.</p>
        <Tabs defaultFocus={true} selectedIndex={this.state.tabIndex} onSelect={tabIndex => this.setState({ tabIndex })}>
          <TabList>
            {
              accounts.accounts.map((account, i) => 
                <Tab key={account._id}>{account.name}</Tab>
              )
            }
          </TabList>
          {
            accounts.accounts.map((account, i) =>
              <TabPanel key={account._id} >
                <br/>
                <AccountDetails account={account} reTab={() => this.setState({tabIndex: 0})} />
              </TabPanel>
            )
          }
        </Tabs>
      </div>
    }

    return (
      <div>
        {content}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  success: state.success
});

export default connect(mapStateToProps, null)(DailyTransactions);
