import React, { Component } from 'react';
import { connect } from 'react-redux';
import GoogleSignIn from '../login/GoogleSignIn';
import FacebookSignIn from '../login/FacebookSignIn';
import NavBar from './NavBar';
import Footer from './Footer';
import {loadAccounts} from '../actions/accountActions';
import { numberWithCommas } from '../utils/Utils';
import { currencyTypes } from '../dictionary/dictionary';

export class Main extends Component {
  componentDidMount() {
    const {auth} = this.props;
    if (auth.isAuthenticated) {
      this.props.loadAccounts();
    }
  }

  render() {
    const {accounts} = this.props;
   
    return (
      <div>
        <NavBar active="home" />
        <div className="row pt-5 pb-5 m-auto justify-content-around" id="mainPage">
          <div className="col-md-5" style={{ 'display': 'flex', 'alignItems': 'center' }}>
            <div className={"card card-body text-center shadow-lg border-0 rounded" + (this.props.auth.isAuthenticated ? " bg-primary":"") } >
              {
                !this.props.auth.isAuthenticated ? 
                  // not authenticated
                  <div>
                    <img src="/img/logo.png" className="m-auto"
                      id="appLogo" alt="logo" />

                    <p className='lead text-muted'>Create an account or login</p>
                    <a href="/users/register" className="btn btn-success btn-block mb-2"><span className='lead'>Register</span></a>
                    <a href="/users/login" className="btn btn-info btn-block"><span className='lead'>Login</span></a>
                    <br /> <p className='lead text-muted'> Or sign in with socials </p>

                    <GoogleSignIn />
                    <FacebookSignIn />
                  </div> : 
                  // authenticated
                  <div className="text-center text-white">
                    <img src={this.props.auth.user.imageUrl} style={{ zIndex: 2 }}
                      className="img-thumbnail rounded-circle ml-auto mr-auto mb-4"
                      id="appLogo" alt="logo" />
                    
                    <p className="font-weight-bold" >
                      {this.props.auth.user.name}
                    </p>
                    <p className="font-weight-bold" >
                      {this.props.auth.user.email}
                    </p>
                    <br/>
                    Accounts summary                    
                    {
                      <div className='mt-2 mb-3'>
                      {
                        accounts.loading ? 
                        <span className='text-muted'>
                          Loading...
                        </span> : 
                        (
                          accounts.accounts.length === 0 ? 
                            <span className='text-muted'>
                              You currently have no accounts.
                            </span> : null
                        )
                      }
                      {
                        accounts.accounts.map((account, i) => 
                          <div key={i} className='d-flex flex-row'>
                            <p className='ml-2 mr-auto'>{account.name}</p>
                            <p className='mr-3 font-weight-bold text-success'>{currencyTypes[account.currency]} {numberWithCommas(account.balance)}</p>
                          </div>
                        )
                      }
                      </div>
                    }
                    <a href='/tools' className='btn btn-block btn-success'>More details</a>
                  </div>
              }
              
            </div>
          </div>
          <div className="col-md-5 text-center" id="welcomeSlogan" style={{ 'display': 'flex', 'alignItems': 'center' }}>
            <div>
              {
                this.props.auth.isAuthenticated ?
                <img src="/img/logo_transparent.png" className="m-auto"
                  id="appLogo" alt="logo" /> : null
              }
              <h1 id="mainAppHeader" className='text-white'>Smart Money</h1>
              <blockquote className="text-white text-center" id="mainAppText" >
                <p>Keep track of your spending, create budget and stay out of debt. We provide all services and solutions you will ever need to achieve your financial goals.</p>
                <img src='/img/profile.jpg' alt='author' className='rounded-circle img-thumbnail' style={{height: '105px'}} />
                <footer className="font-weight-bold blockquote-footer mt-2" id="mainAppFooter" >
                  <span className='text-white'>Trung Vo,</span> <cite title="Source Title" className='text-white'>Software Developer</cite>
                </footer>
              </blockquote>
            </div>
          </div>
        </div>
        
        <div className='row justify-content-around m-5'>
          <div className='col-md-4 col-xs-4 mb-4' data-aos="fade-right" data-aos-duration="2000">
            <div className={'card card-body border-0 align-items-center'} id='card-daily-transactions' >
              <div><i className='fas fa-6x fa-file-invoice-dollar'></i></div><br/>
              <h3 className='text-center'>Daily transactions</h3>
              <p className='text-center text-muted'>Keep track of your daily expenses based on your specific categories more efficiently and stay out of debt has now become much easier with Smart Money.</p>
            </div>
          </div>

          <div className='col-md-4 col-xs-4 mb-4' data-aos="fade-right" data-aos-duration="2000">
            <div className={'card card-body border-0 align-items-center'} id='card-statistics' >
              <div><i className='fas fa-6x fa-chart-line'></i></div><br />
              <h3 className='text-center'>Money statistics</h3>
              <p className='text-center text-muted'>Leverage power of data visualization tools to control every amount you spent to determine what needs to be spent less and stay on your budget.</p>
            </div>
          </div>

          <div className='col-md-4 col-xs-4' data-aos="fade-right" data-aos-duration="2000">
            <div className={'card card-body border-0 align-items-center'} id='card-calculator' >
              <div><i className='fas fa-6x fa-calculator'></i></div><br />
              <h3 className='text-center'>Investing tools</h3>
              <p className='text-center text-muted'>Simple yet important tool for you to evaluate a stock or value of a company based on Rule#1 Investing. We are here to help you maximize your rate of return.</p>
            </div>
          </div>
        </div>

        <Footer />
      </div>
    )
  }
}

const mapStateToProps = state => ({
  auth: state.auth,
  accounts: state.accounts
})

export default connect(mapStateToProps, { loadAccounts})(Main);
