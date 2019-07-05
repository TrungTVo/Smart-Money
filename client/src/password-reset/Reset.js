import React, { Component } from 'react';
import { connect } from 'react-redux';
import {resetPassword, updatePassword} from '../actions/usersActions';
import InputGroup from '../common/InputGroup';
import NavBar from '../layouts/NavBar';
import AlertMessage from '../common/AlertMessage';
import * as actions from '../actions/types';

export class Reset extends Component {
  state = {
    password: '',
    confirm_password: '',
  }

  componentDidMount() {
    this.props.resetPassword(this.props.match.params.token, this.props.history);
  }

  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  onReset = (e) => {
    e.preventDefault();
    const {user} = this.props;
    const {password, confirm_password} = this.state;
    this.props.updatePassword(user, password, confirm_password, this.props.history);
  }

  render() {
    const {user, errors, success} = this.props;
    console.log(success)
    return (
      <div>
        <NavBar/>
        <div className="row mb-5 ml-auto mr-auto">
          <div className="col-md-6 m-auto">
            <img src="/img/logo.png" className="mx-auto d-block"
              id="appLogo" alt="logo" width="200" height="200" />

            <div className="card card-body shadow border-0">
              <h3 className="text-center mb-3">
                <i className="fas fa-lock">&nbsp;</i> Reset your password
              </h3>
              
              {
                errors.type !== actions.PASSWORD_RESET 
                && typeof user !== 'undefined'
                && Object.keys(user).length > 0
                && (typeof success.type === 'undefined' || success.type === '') ?

                <form onSubmit={this.onReset}>
                  
                  <InputGroup htmlFor="password"
                    label="New password"
                    type="password"
                    id="password"
                    name="password"
                    required={true}
                    onChange={this.onChange}
                    iconType={'lock'}
                    error={
                      errors.type === actions.UPDATE_PASSWORD ? errors.errors.password : false
                    }
                    placeholder="Enter new password" />

                  <InputGroup htmlFor="password"
                    label="Confirm new password"
                    type="password"
                    id="confirm_password"
                    name="confirm_password"
                    required={true}
                    onChange={this.onChange}
                    iconType={'lock'}
                    error={
                      errors.type === actions.UPDATE_PASSWORD ? errors.errors.confirm_password : false
                    }
                    placeholder="Confirm new password" />

                  <button type="submit" id="btn-sign-in" className="btn btn-primary btn-block">
                    <span className='lead'>Update</span>
                  </button>
                </form>
                :
                (
                  success.type === actions.UPDATE_PASSWORD && success.success_msg !== '' ?
                      <div>
                        <AlertMessage variant={'success'} message={success.success_msg} />

                        <p className="lead">
                          <a href='/users/login'>
                            Back to {this.props.auth.isAuthenticated ? 'dashboard' : 'log in'}
                          </a>
                        </p>
                      </div> 
                      : null
                )
              }
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
  success: state.success,
  user: state.users.user
})

export default connect(mapStateToProps, {resetPassword, updatePassword})(Reset);
