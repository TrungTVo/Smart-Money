import React, { Component } from 'react';
import InputGroup from '../common/InputGroup';
import NavBar from './NavBar';
import Footer from './Footer';
import {contact} from '../actions/usersActions';
import {connect} from 'react-redux';
import AlertMessage from '../common/AlertMessage';
import * as actions from '../actions/types';

export class Contact extends Component {
  state = {
    name: '',
    email: '',
    phone: '',
    message: ''
  }
  
  onChange = (e) => {
    this.setState({
      [e.target.name]: e.target.value
    })
  }

  onSubmit = (e) => {
    e.preventDefault();
    this.props.contact({
      name: this.state.name,
      email: this.state.email,
      phone: this.state.phone,
      message: this.state.message
    })
  }

  render() {
    const {errors, success} = this.props;
    return (
      <div>
        <NavBar active="contact" />
        <div className="row mb-5 ml-auto mr-auto" id="contactPage">
          <div className="col-md-6 m-auto">
            <img src="/img/logo.png" className="mx-auto d-block"
              id="appLogo" alt="logo" width="200" height="200" />

            <div className="card card-body" data-aos="flip-left" data-aos-duration="1000">
              <h1 className="text-center mb-3"><i className="fas fa-paper-plane"></i> Contact</h1>
              {
                success.type === actions.CONTACT_DEVELOPER && success.success_msg !== '' ?
                <AlertMessage variant={'success'} message={success.success_msg} /> : null
              }
              <form onSubmit={this.onSubmit}>
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
                  placeholder="Enter name" />

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

                <InputGroup htmlFor="phone"
                  label="Phone number"
                  type="phone"
                  id="phone"
                  name="phone"
                  required={true}
                  onChange={this.onChange}
                  error={
                    errors.type === actions.LACK_INFO_FIELDS ? 
                    errors.errors.phone : false
                  }
                  iconType={'phone'}
                  placeholder="Enter phone number" />

                <InputGroup htmlFor="message"
                  label="Message"
                  type="message"
                  id="message"
                  name="message"
                  required={true}
                  onChange={this.onChange}
                  error={
                    errors.type === actions.LACK_INFO_FIELDS ? 
                    errors.errors.message : false
                  }
                  placeholder="Enter your message" />

                <button type="submit" id="btn-sign-in" className="btn btn-primary btn-block">Send</button>
              </form>
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
  success: state.success
})

export default connect(mapStateToProps, {contact})(Contact);
