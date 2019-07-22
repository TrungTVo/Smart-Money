import React, { Component } from 'react';
import InputGroup from '../common/InputGroup';
import { addAccount } from '../actions/accountActions';
import { connect } from 'react-redux';
import AlertMessage from '../common/AlertMessage';
import * as actions from '../actions/types';

class AddAccount extends Component {
  state = {
    name: '',
    currency: '',
    balance: '',
    budget: '',
    errors: {},
  }

  addAccount = (e) => {
    e.preventDefault();
    const newAccount = {
      name: this.state.name,
      currency: this.state.currency,
      balance: this.state.balance,
      budget: this.state.budget
    }
    this.props.addAccount(newAccount);
  }

  onChange = (e) => {
    this.setState({
      [e.target.id]: e.target.value
    })
  }

  componentWillReceiveProps(nextProps) {
    const { success, errors } = nextProps;
    if (success.type === actions.ADD_ACCOUNT) {
      this.setState({
        name: '',
        currency: '',
        balance: '',
        budget: ''
      })
    }
    if (typeof errors === 'object' && Object.keys(errors).length > 0) {
      this.setState({ errors })
    } else {
      this.setState({ errors: {} })
    }
  }

  render() {
    const { errors, name, currency, balance, budget } = this.state;
    const {success} = this.props;
    return (
      <div className="container">
        <div className='card card-header bg-light'>
          <h4>
            <i className='fas fa-plus-circle'>&nbsp;&nbsp;&nbsp;</i>Add account
          </h4>
        </div>
        <div className='card card-body'>
          {
            success.type === actions.ADD_ACCOUNT && typeof success.success_msg !== 'undefined' && success.success_msg !== '' ?
              <AlertMessage message={success.success_msg} variant={'success'} />
              : null
          }

          <InputGroup htmlFor="name"
            label="Name"
            type="name"
            id="name"
            name="name"
            required={true}
            error={errors.type === actions.ADD_ACCOUNT ? errors.errors.name : false}
            onChange={this.onChange}
            placeholder="Enter account name"
            value={name}
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
                errors.type === actions.ADD_ACCOUNT ?
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
            error={errors.type === actions.ADD_ACCOUNT ? errors.errors.balance : false}
            onChange={this.onChange}
            iconType={'money-bill-wave'}
            value={balance}
            placeholder="Enter account balance" />

          <InputGroup htmlFor="budget"
            label="Budget per month"
            type="budget"
            id="budget"
            name="budget"
            required={false}
            onChange={this.onChange}
            iconType={'coins'}
            value={budget}
            placeholder="Enter budget" />

          <form onSubmit={this.addAccount}>
            <button type='submit' className='btn btn-secondary'>Add</button>
          </form>
        </div>

      </div>
    )
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  success: state.success
})

export default connect(mapStateToProps, { addAccount })(AddAccount);
