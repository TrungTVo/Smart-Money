import React, { Component } from 'react';
import PropTypes from 'prop-types';
import InputGroup from '../common/InputGroup';
import {withRouter} from 'react-router-dom';
import {createUser} from '../actions/usersActions';
import { connect } from 'react-redux';
import GoogleSignIn from '../login/GoogleSignIn';
import FacebookSignIn from './FacebookSignIn';
import NavBar from '../layouts/NavBar';
import Footer from '../layouts/Footer';
import AlertMessage from '../common/AlertMessage';
import * as actions from '../actions/types';

class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      name: '',
      email: '',
      password1: '',
      password2: '',
    }
  }

  componentDidMount() {
    if (this.props.auth.isAuthenticated) {
      this.props.history.push('/users/dashboard');
    }
  }

  // handle register new user
  register = (e) => {
    e.preventDefault();
    const newUser = {
      name: this.state.name,
      email: this.state.email,
      password1: this.state.password1,
      password2: this.state.password2
    }
    this.props.createUser(newUser, this.props.history);
  }

  // save change when user type in their fields
  onChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  }

  render() {
    const {errors} = this.props;

    return (
      <div>
        <NavBar/>
        <div className="row mb-5 ml-auto mr-auto" id="registerPage">
          <div className="col-md-6 m-auto ">
            <img src="/img/logo.png" className="mx-auto d-block"
              id="appLogo" alt="logo"
              width="200" height="200" />

            <div className="card card-body shadow border-0">
              <h1 className="text-center mb-3">
                <i className="fas fa-user-plus"></i> Register
              </h1>
              {
                errors.type === actions.DUPLICATE_USER 
                && typeof errors.errors.error_msg !== 'undefined'
                && errors.errors.error_msg !== '' ?
                <AlertMessage variant={'danger'} message={errors.errors.error_msg} /> : null
              }
              <form onSubmit={this.register}>
                <InputGroup htmlFor="name"
                  label="Name"
                  type="name"
                  id="name"
                  name="name"
                  required={true}
                  onChange={this.onChange}
                  error={
                    errors.type === actions.LACK_INFO_FIELDS ? 
                    errors.errors.name : false
                  }
                  iconType={'user'}
                  placeholder="Enter full name" />

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
                  id="password1"
                  name="password1"
                  required={true}
                  onChange={this.onChange}
                  error={
                    errors.type === actions.LACK_INFO_FIELDS ? 
                    errors.errors.password1 : false
                  }
                  iconType={'lock'}
                  placeholder="Enter password" />

                <InputGroup htmlFor="password"
                  label="Confirm your password"
                  type="password"
                  id="password2"
                  name="password2"
                  required={true}
                  onChange={this.onChange}
                  error={
                    errors.type === actions.LACK_INFO_FIELDS ? 
                    errors.errors.password2 : false
                  }
                  iconType={'lock'}
                  placeholder="Confirm your password" />
                
                <button type="submit" id='btn-sign-up' className="btn btn-primary btn-block" >
                  <span className='lead'>Register</span>
                </button>
              </form>

              <p className="lead mt-4 text-center lead text-muted">Already have an account? <a href="/users/login">Login</a></p>
              <p className="text-center lead text-muted">Or sign in with socials</p>
              
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

Register.propTypes = {
  createUser: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  errors: state.errors,
  auth: state.auth
})

export default connect(mapStateToProps, {createUser})(withRouter(Register));
