import React, { Component } from 'react';
//import FacebookLogin from 'react-facebook-login';
import { facebookSignIn } from '../actions/usersActions';
import { FacebookLogin } from 'react-facebook-login-component';
import { connect } from 'react-redux';
import { withRouter } from 'react-router-dom';

class FacebookSignIn extends Component {
  state = {
    appId: process.env.REACT_APP_FACEBOOK_APP_ID
  }

  responseFacebook = (response) => {
    if (typeof response.id !== 'undefined') {
      const userInfo = {
        name: response.name,
        email: response.email,
        imageUrl: response.picture.data.url,
        token: response.accessToken
      }
      this.props.facebookSignIn(userInfo, this.props.history);
    }
  }


  render() {
    return (
      // <FacebookLogin
      //   appId={this.state.appId}
      //   autoLoad={false}
      //   size='small'
      //   fields="name,email,picture"
      //   icon={<i className='fa fa-facebook'>&nbsp;&nbsp;</i>}
      //   textButton={<span className='lead'>Sign in with Facebook</span>}
      //   cssClass='btn btn-block btn-facebook mt-1'
      //   callback={this.responseFacebook} />

      <FacebookLogin 
        socialId={this.state.appId}
        language="en_US"
        scope="public_profile,email"
        responseHandler={this.responseFacebook}
        xfbml={true}
        fields="id,email,name,picture"
        version="v2.5"
        className="btn btn-block btn-facebook mt-1"
        buttonText={<span className='lead'><i className='fa fa-facebook'>&nbsp;&nbsp;</i>Sign in with Facebook</span>}
      />
    )
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
})

export default connect(mapStateToProps, { facebookSignIn })(withRouter(FacebookSignIn));
