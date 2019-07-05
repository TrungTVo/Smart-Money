import React, { Component } from 'react';
import {connect} from 'react-redux';
import AddAccount from './AddAccount';
import {loadAccounts} from '../actions/accountActions';
import { update_bankAccount } from '../actions/accountActions';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import InputGroup from '../common/InputGroup';
import ModalDelete from '../common/ModalDelete';
import * as actions from '../actions/types';
import AlertMessage from '../common/AlertMessage';

class ManageAccounts extends Component {
  state = {
    tabIndex: 0,
    id: '',
    name: '',
    currency: '',
    balance: '',
    budget: '',
  }

  componentDidMount() {
    this.props.loadAccounts();
  }

  componentWillReceiveProps(nextProps) {
    const {accounts} = nextProps;
    this.setState({
      tabIndex: 0
    })
    if (accounts.accounts.length > 0) {
      const default_account = accounts.accounts[0];
      if (typeof default_account !== 'undefined' && Object.keys(default_account).length > 0) {
        this.setState({
          id: default_account._id,
          name: default_account.name,
          currency: default_account.currency,
          balance: default_account.balance,
          budget: default_account.budget
        })
      }
    }
  }

  select_bankAccount = (tabIndex) => {
    const {accounts} = this.props;
    this.setState({
      tabIndex
    }, () => {
      // parse value info of this bank account into input fields
      const {tabIndex} = this.state;
      if (tabIndex < accounts.accounts.length) {
        const select_account = accounts.accounts[tabIndex];
        this.setState({
          id: select_account._id,
          name: select_account.name,
          currency: select_account.currency,
          balance: select_account.balance,
          budget: select_account.budget
        })
      }
    })
  }

  onChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  updateAccount = (e) => {
    e.preventDefault();
    const {id, name, currency, balance, budget} = this.state;
    const account = {
      id: id,
      name: name,
      currency: currency,
      balance: balance,
      budget: budget
    }
    this.props.update_bankAccount(account);
    this.setState({
      tabIndex: 0
    })
  }

  render() {
    const {name, currency, balance, budget} = this.state;
    const {accounts, success, errors} = this.props;
    
    return (
      <div>
        <AddAccount /> <br/>
        <div className="container">
          <div className='card card-header bg-light'>
            <h4>
              <i className='fas fa-pen'>&nbsp;&nbsp;&nbsp;</i>Edit accounts
            </h4>
          </div>
          <div className='card card-body'>
            {
              (success.type === actions.DELETE_ACCOUNT || success.type === actions.UPDATE_ACCOUNT) && typeof success.success_msg !== 'undefined' && success.success_msg !== '' ?
                <AlertMessage message={success.success_msg} variant={'success'} />
                : null
            }
            <p>You currently have {accounts.accounts.length} accounts.</p>
            <Tabs defaultFocus={true} selectedIndex={this.state.tabIndex} onSelect={tabIndex => this.select_bankAccount(tabIndex) }>
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
                    <br />
                    <InputGroup htmlFor="name"
                      label="Name"
                      type="name"
                      id="name"
                      name="name"
                      required={true}
                      onChange={this.onChange}
                      value={name}
                      error={errors.type === actions.UPDATE_ACCOUNT ? errors.errors.name : false}
                      placeholder="Enter account name"
                      iconType={'id-card'} />


                    <div className="form-group row justify-content-start" style={{ 'display': 'flex', 'alignItems': 'center' }}>
                      <label htmlFor="currency" className="col-md-4 col-sm-6 col-xs-12 col-form-label">
                        Select currency: <span style={{ color: 'red' }}>*</span>
                      </label>
                      <div className="form-group col-md-7 col-sm-5 col-xs-12 mt-2">
                        <select className="custom-select" id='currency' value={currency}
                          onChange={this.onChange}>
                          <option value="">Select currency</option>
                          <option value="USD">USD</option>
                          <option value="VND">VND</option>
                          <option value="EUR">EUR</option>
                        </select>
                        {
                          errors.type === actions.UPDATE_ACCOUNT ?
                            (errors.errors.currency && <small className="form-text" style={{ color: 'red' }}>{errors.errors.currency}</small>) : null
                        }
                      </div>
                    </div>

                    <InputGroup htmlFor="balance"
                      label="Balance"
                      type="balance"
                      id="balance"
                      name="balance"
                      required={true}
                      onChange={this.onChange}
                      value={balance}
                      error={errors.type === actions.UPDATE_ACCOUNT ? errors.errors.balance : false}
                      placeholder="Enter account balance"
                      iconType={'money-bill-wave'} />

                    <InputGroup htmlFor="budget"
                      label="Budget"
                      type="budget"
                      id="budget"
                      name="budget"
                      required={false}
                      onChange={this.onChange}
                      value={budget}
                      placeholder="Enter budget"
                      iconType={'coins'} />

                    <div className='d-flex flex-row'>
                      <form onSubmit={this.updateAccount}>
                        <button type='submit' className='btn btn-secondary mr-2'>Update</button>
                      </form>
                      <ModalDelete
                        disabled={false}
                        variant='danger'
                        bankId={account._id}
                        type={actions.DELETE_ACCOUNT}
                        header="Delete account"
                        body="Delete this bank account will permanently delete all your information and cannot be undone. 
                            Are you sure you want to do this?"
                        buttonText="Delete"    
                        cancelBtn="Close"
                        yesBtn="Yes"
                        reTab={() => this.setState({tabIndex: 0})}
                      />
                    </div>
                  </TabPanel>
                )
              }
            </Tabs>
          </div>
        </div>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  accounts: state.accounts,
  success: state.success,
  errors: state.errors
})

export default connect(mapStateToProps, { loadAccounts, update_bankAccount})(ManageAccounts);
