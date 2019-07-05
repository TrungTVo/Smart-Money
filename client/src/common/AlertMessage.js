import React, { Component } from 'react';
import { Alert } from 'react-bootstrap';

export class AlertMessage extends Component {
  state = {
    show: true
  }
  render() {
    const {message, variant} = this.props;
    return (
      <Alert dismissible variant={variant} show={this.state.show} onClose={() => this.setState({ show: false })}>
        <div className="row vertical-align">
          <div className="col-xs-1 text-center mr-4 ml-3">
            <i className={
              variant === 'success' ?
              "fas fa-check" : (
                variant === 'danger' ?
                "fas fa-exclamation-triangle" : 
                "fas fa-info-circle"
              )}>
            </i>
          </div>
          <div className="col-xs-9">
            {message}
          </div>
        </div>
      </Alert>
    )
  }
}

export default AlertMessage;
