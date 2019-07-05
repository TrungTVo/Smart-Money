import React, { Component } from 'react';
import DataTable from './DataTable';
import ModalDelete from '../common/ModalDelete';
import {connect} from 'react-redux';
import AlertMessage from '../common/AlertMessage';
import * as actions from '../actions/types';

class AccountDetails extends Component {

  render() {
    const { account, success, transactions} = this.props;
    return (
      <div>
        <h3>
          <i className='fas fa-file-alt'>&nbsp;&nbsp;</i>Transactions history
        </h3><br/>
        <div className='d-flex'>
          <h4 className='mr-auto'>{account.name}<small>&nbsp;&nbsp;<small className='text-muted'>{`(Currency: ${account.currency})`}</small></small></h4>
    
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
            reTab={() => {this.props.reTab()}}
          />
        </div>
        <br/>

        {
          transactions.loading ?
            <div className="d-flex justify-content-center mb-4">
              <div className="spinner-border" role="status">
                <span className="sr-only">Loading...</span>
              </div>
            </div> : 
            (
              success.account === account.name &&
                (success.type === actions.ADD_TRANSACTION || success.type === actions.UPDATE_TRANSACTION || success.type === actions.DELETE_TRANSACTION)
                && typeof success.success_msg !== 'undefined' && success.success_msg !== '' ?

                <AlertMessage variant={'success'} message={success.success_msg} /> : null
            )
        }

        <div className="table-hover table-responsive table-sm">
          <DataTable account={account} />
        </div>
        
      </div>
    )
  }
}

const mapStateToProps = state => ({
  success: state.success,
  transactions: state.transactions
})

export default connect(mapStateToProps, null)(AccountDetails);
