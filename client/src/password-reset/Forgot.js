import React, { Component } from 'react';
import InputGroup from '../common/InputGroup';
import { verifyEmail} from '../actions/usersActions';
import { connect } from 'react-redux';
import NavBar from '../layouts/NavBar';
import AlertMessage from '../common/AlertMessage';
import * as actions from '../actions/types';

export class Forgot extends Component {
  state = {
    email: ''
  }

  onSubmit = (e) => {
    e.preventDefault();
    this.props.verifyEmail(this.state.email);
  }

  onChange = (e) => {
    this.setState({
      email: e.target.value
    })
  }


  render() {
    const {success, errors} = this.props;
   
    return (
      <div>
        <NavBar/>
        <div className="row mb-5 ml-auto mr-auto" id="forgotPage">
          <div className="col-md-6 m-auto">
            <img src="/img/logo.png" className="mx-auto d-block"
              id="appLogo" alt="logo" width="200" height="200" />

            <div className="card card-body shadow border-0">
              <h3 className="text-center mb-3">
                <i className="fas fa-lock">&nbsp;</i> Reset your password
              </h3>
              {
                errors.type === actions.VERIFY_USER || errors.type === actions.PASSWORD_RESET ?
                (
                    errors.errors.error_msg !== '' ?
                      <AlertMessage variant={'danger'} message={errors.errors.error_msg} /> : null
                )
                : 
                (
                  success.type === actions.VERIFY_USER && success.success_msg !== '' ?
                    <AlertMessage variant={'success'} message={success.success_msg} /> : null
                )
                
              }

              <form onSubmit={this.onSubmit}>
                <InputGroup htmlFor="email"
                  label="Please verify your email address"
                  type="email"
                  id="email"
                  name="email"
                  required={true}
                  onChange={this.onChange}
                  error={
                    errors.type === actions.VERIFY_USER && errors.errors.error_msg !== '' ?
                    errors.errors.error_msg : null
                  }
                  placeholder="Enter email address"
                  iconType={'envelope'} />
                  
                <p className="lead">
                  <a href='/users/login'>
                    Back to {this.props.auth.isAuthenticated ? 'dashboard' : 'log in'}
                  </a>
                </p>
                <button type="submit" id="btn-sign-in" className="btn btn-primary btn-block">
                  <span className='lead'>Send</span>
                </button>
              </form>
            </div>
          </div>
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

export default connect(mapStateToProps, { verifyEmail})(Forgot);
