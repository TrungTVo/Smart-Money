import React, { Component } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { InputGroup } from './InputGroup';
import DatePicker from "react-datepicker";
import { connect } from 'react-redux';
import { update_transaction } from '../actions/transactionActions';
import * as actions from '../actions/types';
import "react-datepicker/dist/react-datepicker.css";
import AlertMessage from '../common/AlertMessage';

export class ModalEdit extends Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
      id: '',
      date: new Date(),
      amount: '',
      category: '',
      notes: '',
      payee: '',
      update_success: null
    }
  }

  componentWillReceiveProps(nextProps) {
    const { errors, success} = nextProps;

    if (errors.type !== actions.UPDATE_TRANSACTION) {
      if (typeof nextProps.transaction !== 'undefined' && Object.keys(nextProps.transaction).length > 0) {
        this.reset(nextProps);
      }
    }

    if (success.type === actions.UPDATE_TRANSACTION) {
      this.reset(nextProps);
    }
  }

  reset = (nextProps) => {
    this.setState({
      id: nextProps.transaction._id,
      date: new Date(nextProps.transaction.date),
      amount: nextProps.transaction.amount,
      category: nextProps.transaction.category,
      notes: nextProps.transaction.notes,
      payee: nextProps.transaction.payee
    })
  }

  handleChangeDate = (date) => {
    this.setState({
      date: date
    });
  }

  handleClose = () => {
    this.setState({ show: false, update_success: null });
  }

  handleShow = () => {
    this.setState({ show: true });
  }

  clickUpdate = () => {
    const { date, amount } = this.state;
    if (date === null || date === '' || amount === '') {
      this.setState({ show: true })
    } else {
      this.setState({ show: false })
    }
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  updateTransaction = (e, bankAccount) => {
    e.preventDefault();
    const {id, date, amount, category, notes, payee} = this.state;
    if (date === null || date === '' || amount === '') {
      this.setState({
        update_success: false
      })
    } else {
      this.props.update_transaction({
        id: id,
        date: date === '' || date === null ? '' : date.toISOString().split('T')[0].replace(/-/g, '/'),
        amount: amount,
        category: category,
        notes: notes,
        payee: payee,
        bankAccount: bankAccount
      });
      this.props.after_edit();
    }
  }


  render() {
    const { styles, header, buttonText, cancelBtn, currency,
      mainFuncBtn, bankAccount, size, variant, disabled, icon, errors } = this.props;

    const { date, amount, category, notes, payee, update_success } = this.state;

    return (
      <div>
        <Button variant={variant} className={styles} onClick={this.handleShow} size={size} disabled={disabled} >
          <i className={icon}>&nbsp;&nbsp;</i>{buttonText}
        </Button>

        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>
              <i className={icon}></i>
              <span>&nbsp;&nbsp;&nbsp;</span>{header}
            </Modal.Title>
          </Modal.Header>

          <Modal.Body>
            {
              update_success === false ?
              <AlertMessage variant={'danger'} message={'Invalid date or amount'} /> : null
            }

            <label>Date 
              <span style={{ color: 'red' }}>&nbsp;*&nbsp;</span>
              <small className='text-muted'>(yyyy/mm/dd)</small>
            </label> <br />
            <DatePicker
              dateFormat="yyyy/MM/dd"
              selected={date}
              onChange={this.handleChangeDate}
              className={
                errors.type === actions.UPDATE_TRANSACTION 
                && typeof errors.errors.date !== 'undefined'
                && errors.errors.date !== '' ?
                '' : 'mb-4'
              }
            />
            {
              (errors.type === actions.UPDATE_TRANSACTION 
                && typeof errors.errors.date !== 'undefined'
                && errors.errors.date !== '') && <small className="form-text mb-4" style={{ color: 'red' }}>{errors.errors.date}</small>
            }

            <InputGroup
              htmlFor="amount"
              label={<span><span>Amount <small className='text-muted'>({currency})</small> <span style={{ color: 'red' }}>*</span></span><br /> <span><small className='text-muted'>+ for deposit, - for expense</small></span></span>}
              type="amount"
              id="amount"
              name="amount"
              onChange={this.onChange}
              value={amount}
              placeholder="Enter amount"
              error={
                errors.type === actions.UPDATE_TRANSACTION
                  && typeof errors.errors.amount !== 'undefined'
                  && errors.errors.amount !== '' ?
                errors.errors.amount : false
              }
              required={false}
              iconType={'money-bill-wave'}
            />
            <InputGroup
              htmlFor="category"
              label="Category"
              type="category"
              id="category"
              name="category"
              onChange={this.onChange}
              value={category}
              placeholder="Enter category"
              iconType={'stream'}
            />
            <InputGroup
              htmlFor="notes"
              label="Notes"
              type="notes"
              id="notes"
              name="notes"
              onChange={this.onChange}
              value={notes}
              placeholder="Enter notes"
              iconType={'comment-alt'}
            />
            <InputGroup
              htmlFor="payee"
              label="Payee"
              type="payee"
              id="payee"
              name="payee"
              onChange={this.onChange}
              value={payee}
              placeholder="Enter payee"
              iconType={'user'}
            />
          </Modal.Body>

          <Modal.Footer>
            <Form onSubmit={(e) => this.updateTransaction(e, bankAccount)}>
              <Button variant="primary" className="mr-2" type="submit" onClick={this.clickUpdate}>
                {mainFuncBtn}
              </Button>
              <Button variant="secondary" type="button" onClick={this.handleClose}>
                {cancelBtn}
              </Button>
            </Form>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  errors: state.errors,
  success: state.success
}) 

export default connect(mapStateToProps, { update_transaction})(ModalEdit);
