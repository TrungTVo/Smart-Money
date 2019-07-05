import React, { Component } from 'react';
import { connect } from 'react-redux';
import { deleteAccount } from '../actions/usersActions';
import {withRouter} from 'react-router-dom';
import {Modal, Button, Form} from 'react-bootstrap';
import {delete_bankAccount} from '../actions/accountActions';
import {delete_transaction} from '../actions/transactionActions';
import * as actions from '../actions/types';

class ModalDelete extends Component {
  state = {
    show: false
  }
  handleClose = () => {
    this.setState({ show: false });
  }

  handleShow = () => {
    this.setState({ show: true });
  }

  onDelete = (e, type, bankId, bankAccount, transaction) => {
    e.preventDefault();
    if (type === actions.DELETE_USER) {
      this.props.deleteAccount(this.props.history);
    } else if (type === actions.DELETE_ACCOUNT) {
      this.props.reTab();
      this.props.delete_bankAccount(bankId);
    } else if (type === actions.DELETE_TRANSACTION) {
      this.props.delete_transaction(bankAccount, transaction);
      this.props.after_delete();
    }
  }

  render() {
    const {styles, header, body, buttonText, cancelBtn, 
        yesBtn, type, bankId, size, variant, disabled, bankAccount, transaction} = this.props;
    return (
      <div>
        <Button variant={variant} className={styles} onClick={this.handleShow} size={size} disabled={disabled} >
          <i className='fas fa-trash'>&nbsp;&nbsp;</i>{buttonText}
        </Button>

        <Modal show={this.state.show} onHide={this.handleClose}>
          <Modal.Header closeButton>
            <Modal.Title>
              <i className="fas fa-exclamation-triangle"></i>
              <span>&nbsp;&nbsp;&nbsp;</span>{header}
            </Modal.Title>
          </Modal.Header>
          <Modal.Body>{body}</Modal.Body>
          <Modal.Footer>
            <Form onSubmit={(e) => this.onDelete(e, type, bankId, bankAccount, transaction)}>
              <Button variant="primary" className="mr-2" type="submit" onClick={this.handleClose}>
                {yesBtn}
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
  auth: state.auth,
});

export default connect(mapStateToProps, { 
  deleteAccount, delete_bankAccount, delete_transaction 
})(withRouter(ModalDelete));
