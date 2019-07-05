import React, { Component } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { InputGroup} from './InputGroup';
import DatePicker from "react-datepicker";
import {connect} from 'react-redux';
import {addTransaction} from '../actions/transactionActions';
import * as actions from '../actions/types';
import "react-datepicker/dist/react-datepicker.css";

class ModalAdd extends Component {
  state = {
    show: false,
    date: new Date(),
    amount: '',
    category: 'General',
    notes: '',
    payee: this.props.auth.user.name,
  }
  
  componentWillReceiveProps(nextProps) {
    const {success} = nextProps;
    if (success.type === actions.ADD_TRANSACTION) {
      this.setState({
        date: new Date(),
        amount: '',
        category: 'General',
        notes: '',
        payee: this.props.auth.user.name,
      })
    }
  }

  handleChangeDate = (date) => {
    this.setState({
      date: date
    });
  }
  
  handleClose = () => {
    this.setState({ show: false });
  }

  handleShow = () => {
    this.setState({ show: true });
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  clickAdd = () => {
    const {date, amount} = this.state;
    if (date === null || date === '' || amount === '') {
      this.setState({show: true})
    } else {
      this.setState({ show: false })
    }
  }

  onAdd = (e, bankAccount) => {
    e.preventDefault();
    var {date, amount, category, notes, payee} = this.state;
    
    this.props.addTransaction({
      date: date === '' || date === null ? '' : date.toISOString().split('T')[0].replace(/-/g, '/'),
      amount: amount,
      category: category,
      notes: notes,
      payee: payee,
      bankAccount: bankAccount
    });
  }


  render() {
    const { styles, header, buttonText, cancelBtn, currency,
      mainFuncBtn, bankAccount, size, variant, disabled, icon, errors } = this.props;
    
    const {date, category, payee} = this.state;

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
            <label>Date 
              <span style={{ color: 'red' }}>&nbsp;*&nbsp;</span>
              <small className='text-muted'>(yyyy/mm/dd)</small>
            </label> <br/>
            <DatePicker
              dateFormat="yyyy/MM/dd"
              selected={date}
              onChange={this.handleChangeDate}
              className={
                errors.type === actions.ADD_TRANSACTION
                  && typeof errors.errors.date !== 'undefined'
                  && errors.errors.date !== '' ?
                  '' : 'mb-4'
              }
            />
            {
              (errors.type === actions.ADD_TRANSACTION
                && typeof errors.errors.date !== 'undefined'
                && errors.errors.date !== '') && <small className="form-text mb-4" style={{ color: 'red' }}>{errors.errors.date}</small>
            }
            
            <InputGroup
              htmlFor="amount"
              label={<span><span>Amount <small className='text-muted'>({currency})</small> <span style={{ color: 'red' }}>*</span></span><br/> <span><small className='text-muted'>+ for deposit, - for expense</small></span></span>}
              type="amount"
              id="amount"
              name="amount"
              required={false}
              onChange={this.onChange}
              error={
                errors.type === actions.ADD_TRANSACTION
                  && typeof errors.errors.amount !== 'undefined'
                  && errors.errors.amount !== '' ?
                  errors.errors.amount : false
              }
              placeholder="Enter amount"
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
            <Form onSubmit={(e) => this.onAdd(e, bankAccount)}>
              <Button variant="primary" className="mr-2" type="submit" onClick={this.clickAdd}>
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

export default connect(mapStateToProps, { addTransaction})(ModalAdd);
