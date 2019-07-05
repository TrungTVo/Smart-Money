import React, { Component } from 'react';
import InputGroup from '../common/InputGroup';
import { loginUser } from '../actions/usersActions';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux';
import GoogleSignIn from '../login/GoogleSignIn';
import FacebookSignIn from './FacebookSignIn';
import NavBar from '../layouts/NavBar';
import Footer from '../layouts/Footer';
import AlertMessage from '../common/AlertMessage';
import * as actions from '../actions/types';

export class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: '',
    }
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/users/dashboard');
    }
  }

  // handle login
  login = (e) => {
    e.preventDefault();
    const userInfo = {
      email: this.state.email,
      password: this.state.password,
    }
    this.props.loginUser(userInfo, this.props.history);
  }

  // save change when user type in their fields
  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const {errors, success} = this.props;
    return (
      <div>
        <NavBar />
        <div className="row mb-5 ml-auto mr-auto" id="loginPage">
          <div className="col-md-6 m-auto">
            <img src="/img/logo.png" className="mx-auto d-block"
              id="appLogo" alt="logo" width="200" height="200" />

            <div className="card card-body shadow border-0">
              <h1 className="text-center mb-3"><i className="fas fa-sign-in-alt"></i> Login</h1>
              {
                (success.type === actions.ADD_USER || success.type === actions.LOGOUT || success.type === actions.DELETE_USER) 
                && success.success_msg !== '' ? 
                <AlertMessage variant={'success'} message={success.success_msg} /> : null
              }

              {
                (errors.type === actions.LACK_INFO_FIELDS || errors.type === actions.USER_NOT_FOUND_OR_WRONG_PASSWORD )
                && typeof errors.errors.error_msg !== 'undefined'
                && errors.errors.error_msg !== '' ?
                <AlertMessage variant={'danger'} message={errors.errors.error_msg} /> : null
              }
              
              <form onSubmit={this.login} >
                <InputGroup htmlFor="email"
                  label="Email"
                  type="email"
                  id="email"
                  name="email"
                  required={true}
                  onChange={this.onChange}
                  error={
                    errors.type === actions.LACK_INFO_FIELDS ?
                      errors.errors.email : false
                  }
                  iconType={'envelope'}
                  placeholder="Enter email address" />

                <InputGroup htmlFor="password"
                  label="Password"
                  type="password"
                  id="password"
                  name="password"
                  required={true}
                  onChange={this.onChange}
                  error={
                    errors.type === actions.LACK_INFO_FIELDS ?
                      errors.errors.password : false
                  }
                  iconType={'lock'}
                  placeholder="Enter password" />

                <button type="submit" id="btn-sign-in" className="btn btn-primary btn-block">
                  <span className='lead'>Login</span>
                </button>
              </form>
              <p className="lead mt-4 text-center lead text-muted">
                Don't have account? <a href="/users/register">Register</a>
              </p>
              <p className="lead text-center lead text-muted">
                Forgot your password? <a href="/users/forgot">Reset</a>
              </p>
              <p className="text-center lead text-muted"> Or sign in with socials</p>

              <GoogleSignIn />
              <FacebookSignIn />
                
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  errors: state.errors,
  auth: state.auth,
  success: state.success
})

export default connect(mapStateToProps, {loginUser})(withRouter(Login));
