import React from 'react';
import { render } from 'react-dom';
import { Router, Route, hashHistory } from 'react-router';
import Landing from './Landing.jsx';
import Signup from './Signup.jsx';
import Login from './Login.jsx';
import Dash from './Dash.jsx';
import NavBar from './Nav.jsx';
import $ from 'jquery';
import { connect } from 'react-redux';
import ChallengeComponent from './ChallengeComponent.jsx';
import actions from '../../redux/actions';
import Profile from './Profile.jsx';

class App extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      auth: window.sessionStorage.getItem('username')
    };
    this.handleLogout = this.handleLogout.bind(this);
    this.handleAuth = this.handleAuth.bind(this);
  }

  handleLogout() {
    $.get('/api/logout')
    .done(data => {
      window.sessionStorage.removeItem('username');
      window.location.href = '/';
      this.setState({
        auth: null
      });
    });
  }

  handleAuth(cb) {
    this.setState({
      auth: window.sessionStorage.getItem('username')
    }, cb);
  }

  render() {
    return (
      <div>
      <Router history={hashHistory}>
        <Route path="/" component={() => {
          return <Landing auth={this.state.auth} handleLogout={this.handleLogout} handleAuth={this.handleAuth.bind(this)} />;
        }} />
        <Route path="/signup" component={() => {
          return <Signup handleAuth={this.handleAuth.bind(this)} />;
        }} />
        <Route path="/login" component={() => {
          return <Login handleAuth={this.handleAuth.bind(this)} auth={this.state.auth} handleLogout={this.handleLogout.bind(this)} />;
        }} />
        <Route path='/dash' component={() => {
          return <Dash dispatch={this.props.dispatch} auth={this.state.auth} handleLogout={this.handleLogout} editProfile={this.editProfile}/>;
        }} />
        <Route path='/challenge' component={() =>{
          return <ChallengeComponent handleAuth={this.handleAuth} auth={this.state.auth} handleLogout={this.handleLogout} editProfile={this.editProfile} />;
        }} />
        <Route path='/profile' component={() => {
          return <Profile dispatch={this.props.dispatch} handleLogout={this.handleLogout} />;
        }} />
        <Route path='/profile/:username' component={() => {
          return <Profile dispatch={this.props.dispatch} auth={this.state.auth} handleLogout={this.handleLogout} />;
        }} />
      </Router>
      </div>
    );
  }
}

const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps)(App);

