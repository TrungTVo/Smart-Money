import React, { Component } from 'react';
import { connect } from 'react-redux';
import { logoutUser} from '../actions/usersActions';
import { withRouter } from 'react-router-dom';

export class NavBar extends Component {
  constructor(props){
    super(props);
    this.state = {
      active: 'home'
    }
  }

  componentDidMount() {
    this.setState({
      active: this.props.active ? this.props.active : ''
    })
  }


  logOut = (e) => {
    e.preventDefault();
    this.props.logoutUser();
    this.props.history.push('/users/login');
  }

  onClick = (e) => {
    this.setState({
      active: e.target.id
    })
  }

  render() {
    //console.log(this.props);
    return (
      <nav className="navbar navbar-expand-lg navbar-light" >
        <div className="container">
          <a className="navbar-brand" href="/">
            <img src='/img/logo.png'
                 className='mr-3'
                 alt='smart-money' style={{ width: '25px', height: '25px' }} />
            Smart Money
          </a>
          <button className="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarColor01"
            aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarColor01">
            <ul className="navbar-nav mr-auto">

              <li className={"nav-item " + (this.state.active === 'home' ? 'active font-weight-bold' : '')} >
                <a className="nav-link"
                  id="home" onClick={this.onClick}
                  href="/">Home <span className="sr-only">(current)</span></a>
              </li>

              {
                this.props.auth.isAuthenticated ?
                  null :
                  <li className={"nav-item " + (this.state.active === 'about' ? 'active font-weight-bold' : '')} >
                    <a className="nav-link"
                      id="about" onClick={this.onClick}
                      href="/about">About</a>
                  </li>
                
              }
              
              {
                this.props.auth.isAuthenticated ?
                  <li className={"nav-item " + (this.state.active === 'tools' ? 'active font-weight-bold' : '')} >
                    <a className="nav-link"
                      id="tools" onClick={this.onClick}
                      href="/tools">Tools</a>
                  </li>
                  : null
              }

              {
                this.props.auth.isAuthenticated ?
                  <li className={"nav-item " + (this.state.active === 'evaluate' ? 'active font-weight-bold' : '')} >
                    <a className="nav-link"
                      id="evaluate" onClick={this.onClick}
                      href="/evaluate">Evaluate</a>
                  </li>
                  : null
              }


              <li className={"nav-item " + (this.state.active === 'contact' ? 'active font-weight-bold' : '')} >
                <a className="nav-link"
                  id="contact" onClick={this.onClick} href="/users/contact">Contact</a>
              </li>

              {
                this.props.auth.isAuthenticated ?
                  <li className={"nav-item " + (this.state.active === 'dashboard' ? 'active font-weight-bold' : '')} >
                    <a className="nav-link" 
                      id="dashboard" onClick={this.onClick} href="/users/dashboard">Dashboard</a>
                  </li> : null
              }
            </ul>

            {
              this.props.auth.isAuthenticated ? 
                <div className="navbar-text">
                  <div className="navbar-nav font-weight-bold text-success" >
                    <div>
                      <img className='rounded-circle' src={this.props.auth.user.imageUrl} style={{ width: '25px', height: '25px' }} alt={this.props.auth.user.name} />
                      <span>&nbsp;&nbsp;</span>{this.props.auth.user.name}
                    </div>
                    <span>&nbsp;&nbsp;</span>
                    <a onClick={this.logOut} href="">Logout</a>
                  </div> 
                </div> : 
                <div className="navbar-text">
                  <div className="navbar-nav">
                    <div>
                      <a href="/users/login">Login</a>
                      <span>&nbsp;/&nbsp;</span>
                      <a href="/users/register">Register</a>
                    </div>
                  </div>
                </div>
            }
                  
          </div>
        </div>
      </nav>
    )
  }
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, {logoutUser})(withRouter(NavBar));
