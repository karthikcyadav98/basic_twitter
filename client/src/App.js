import React, { Component } from "react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Provider } from "react-redux";
import jwt_decode from "jwt-decode";
import setAuthToken from "./utils/setAuthToken";
import { setCurrentUser, logoutUser } from "./actions/authAct";
import Dashboard from "./component/dashboard/Dashboard";
import Users from './component/users/Users'
import PrivateRoute from "./component/common/PrivateRoute";
import NotFound from "./component/not-found/NotFound";

import "./App.css";

import Navbar from "./component/layout/Navbar";
import Footer from "./component/layout/Footer";
import Landing from "./component/layout/Landing";
import Register from "./component/auth/Register";
import Login from "./component/auth/Login";
import store from "./store";
import Posts from "./component/posts/Posts";
import Post from "./component/comment/Post";

//chck for token
if (localStorage.jwtToken) {
  //Set auth token header auth
  setAuthToken(localStorage.jwtToken);
  //Decode the token
  const decoded = jwt_decode(localStorage.jwtToken);
  //Set user is auth
  store.dispatch(setCurrentUser(decoded));
  //check for expired token
  const curreTime = Date.now() / 1000;
  if (decoded.exp < curreTime) {
    store.dispatch(logoutUser());
    //Redirect to login
    window.location.href = "/login";
  }
}

class App extends Component {
  render() {
    return (
      <Provider store={store}>
        <Router>
          <div className="App">
            <Navbar />
            <Route exact path="/" component={Landing}></Route>
            <div className="container">
              <Route exact path="/register" component={Register} />
              <Route exact path="/login" component={Login} />
              <Switch>
                <PrivateRoute exact path="/dashboard" component={Dashboard} />
              </Switch>
              <Route exact path="/not-found" component={NotFound} />
              <Route exact path="/profiles" component={Users} />
              <Switch>
                <PrivateRoute exact path="/feed" component={Posts} />
              </Switch>
              <Switch>
                <PrivateRoute exact path="/post/:id" component={Post} />
              </Switch>
            </div>
            <Footer></Footer>
          </div>
        </Router>
      </Provider>
    );
  }
}

export default App;
