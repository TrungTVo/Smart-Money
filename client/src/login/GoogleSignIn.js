import React, { Component } from 'react';
import {GoogleLogin} from 'react-google-login';
import {googleSignIn} from '../actions/usersActions';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

class GoogleSignIn extends Component {
  state = {
    clientId: process.env.REACT_APP_GOOGLE_CLIENT_ID,
    clientSecret: process.env.REACT_APP_GOOGLE_CLIENT_SECRET
  }

  // Success sign in with Google
  onSuccess = (response) => {
    //console.log(response);
    this.props.googleSignIn(response.tokenObj, this.props.history);
  }


  // fail to sign in
  onFailure = (response) => {
    
  }

  onClick = () => {
    console.log('Clicked');
  }

  render() {
    return (
      <GoogleLogin
        clientId={this.state.clientId}
        buttonText="Sign in with Google"
        render={renderProps => (
          <button href="#" id="google-button" className="btn btn-block btn-google" 
              onClick={renderProps.onClick} data-theme="dark">
            <span className='lead'><i className="fa fa-google-plus fa-fw"></i>  Sign in with Google</span>
          </button>
        )}
        // redirectUri="/users/auth/google/callback"
        onSuccess={this.onSuccess}
        onFailure={this.onFailure}
        cookiePolicy={'single_host_origin'}
      />
    )
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
})

export default connect(mapStateToProps, { googleSignIn})(withRouter(GoogleSignIn));
