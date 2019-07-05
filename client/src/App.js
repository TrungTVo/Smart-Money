import React, {Component} from 'react';
import './App.css';
import { Provider } from 'react-redux';
import { BrowserRouter, Route } from 'react-router-dom';
import Main from './layouts/Main';
import Login from './login/Login';
import Register from './login/Register';
import Reset from './password-reset/Reset';
import Contact from './layouts/Contact';
import Forgot from './password-reset/Forgot';
import Dashboard from './layouts/Dashboard';
import jwt_decode from 'jwt-decode';
import store from './store';
import * as actions from './actions/types';
import axios from 'axios';
import {logoutUser} from './actions/usersActions';
import PrivateRoute from './common/PrivateRoute';
import MainTools from './tools/MainTools';
import About from './layouts/About';
import Evaluate from './evaluate/Evaluate';

// Check for token
if (localStorage.jwtToken) {
  // Set auth token header auth
  // Apply to every request
  axios.defaults.headers.common['Authorization'] = localStorage.jwtToken;
  
  // Decode token and get user info and exp
  const decoded = jwt_decode(localStorage.jwtToken);

  // set current user
  const user = {
    name: decoded.name,
    email: decoded.email,
    imageUrl: decoded.imageUrl
  }

  // Set user and isAuthenticated
  store.dispatch({
    type: actions.SET_CURRENT_USER,
    payload: user
  });

  // Check for expired token
  const currentTime = Date.now() / 1000;
  if (decoded.exp < currentTime) {
    // Logout user
    store.dispatch(logoutUser());
    
    // Redirect to login
    window.location.href = '/';
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <BrowserRouter>
          <div className="App">
            <Route exact path='/' strict component={Main} />
            <Route exact path='/about' strict component={About} />
            <Route exact path='/users/login' strict component={Login} />
            <Route exact path='/users/register' strict component={Register} />
            <Route exact path='/users/forgot' strict component={Forgot} />
            <Route exact path='/users/reset/:token' strict component={Reset} />
            <PrivateRoute exact path='/users/dashboard' strict component={Dashboard} />
            <Route exact path='/users/contact' strict component={Contact} />
            <PrivateRoute exact path='/tools' strict component={MainTools} />
            <PrivateRoute exact path='/evaluate' strict component={Evaluate} />
          </div>
        </BrowserRouter>
      </Provider>
    );
  }
}

export default App;
