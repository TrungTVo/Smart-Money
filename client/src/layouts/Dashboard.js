import React, { Component } from 'react';
import { connect } from 'react-redux';
import NavBar from './NavBar';
import Footer from './Footer';
import ModalDelete from '../common/ModalDelete';
import {Button, Form} from 'react-bootstrap';
import * as actions from '../actions/types';
import {updateUserAccount} from '../actions/usersActions';
import AlertMessage from '../common/AlertMessage';


class Dashboard extends Component {
  state = {
    name: ''
  }

  componentDidMount() {
    const {auth} = this.props;
    if (auth.isAuthenticated) {
      this.setState({
        name: auth.user.name
      })
    }
  }

  onChange = (e) => {
    this.setState({
      [e.target.id] : e.target.value
    })
  }

  onSaveInfo = (e) => {
    e.preventDefault();
    const {name} = this.state;
    this.props.updateUserAccount(name);
  }


  render() {
    const {name} = this.state;
    const {errors, success} = this.props;

    return (
      <div>
        <NavBar active="dashboard"/>
        <div className="container mt-4 mb-5">
        
          {
            this.props.auth.isAuthenticated ? 
            // authenticated
            <div className="row justify-content-around">
              <div className="col-md-7" >
                <div className='card card-header bg-light'>
                  <h1>Dashboard</h1>
                </div>
                <div className='card card-body'>
                  <img src={this.props.auth.user.imageUrl} style={{ zIndex: 2 }}
                    className="img-thumbnail rounded-circle ml-auto mr-auto mb-4"
                    id="appLogo" alt="logo" />
                  
                  <h4 className='text-center'>Welcome, {this.props.auth.user.name}</h4><br/>
                  <p className="lead text-dark font-weight-bold">
                    <i className="fas fa-user-edit"></i><span>&nbsp;&nbsp;</span>Edit information:
                  </p>

                  {
                    success.type === actions.UPDATE_USER && success.success_msg !== '' ?
                      <AlertMessage variant={'success'} message={success.success_msg} /> : null
                  }

                  <form >
                    <div className="form-group row" style={{ 'display': 'flex', 'alignItems': 'center' }}>
                      <label htmlFor="editName" className="col-md-4 col-form-label text-dark">Name:</label>
                      <div className="col-md-8 mt-2">
                          <input type="editName" className={"form-control" + (errors.type === actions.UPDATE_USER && errors.errors.error_msg !== '' ? " is-invalid border border-danger" : '' ) }
                              id="name" placeholder="Enter new name"
                              onChange={this.onChange}
                              value={name} />
                          {
                            errors.type === actions.UPDATE_USER && errors.errors.error_msg !== '' ?
                            <small className="form-text" style={{ color: 'red' }}>
                              {errors.errors.error_msg}
                            </small> : null
                          }
                      </div>
                    </div>
                  </form>
                  
                  <div className="form-group row" style={{ 'display': 'flex', 'alignItems': 'center' }}>
                    <label htmlFor="email" className="col-md-4 col-form-label text-dark">Email address:</label>
                    <p className="col-md-8 mt-2 text-dark">{this.props.auth.user.email}</p>
                  </div>

                  <p className="lead"><a href='/users/forgot'>Reset password</a></p>
                  <div className="btn-group">
                    <Form onSubmit={this.onSaveInfo}>
                      <Button variant="primary" className="mr-2" type="submit" >
                        Save
                      </Button>
                    </Form>
                    <ModalDelete
                      disabled={false}
                      variant='danger'
                      type={actions.DELETE_USER}
                      header="Delete account"
                      body="Delete your account will permanently delete all your information and cannot be undone. 
                          Are you sure you want to delete your account?"
                      buttonText="Delete account"    
                      cancelBtn="Close"
                      yesBtn="Yes"
                    />           
                  </div>       
                </div>
              </div>
            </div> :
            // not authenticated
            <div>
              <h2>Please sign in to view this!</h2>
              <a href="/users/login">Back to login</a>
            </div>
          }
          
        </div>
        <Footer />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  errors: state.errors,
  success: state.success
});

export default connect(mapStateToProps, { updateUserAccount})(Dashboard);
