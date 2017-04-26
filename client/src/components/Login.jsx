import React from 'react';
import $ from 'jquery';
import css from '../styles/signup.css';

class Login extends React.Component {
  constructor(props) {
    super(props);
  }

  handleLogin(e) {
    let outer = this;
    e.preventDefault();
    let login = {
      username: this.refs.username.value,
      password: this.refs.password.value
    };
    $.post('/api/login', login)
    .done(data => {
      if (data) {
        console.log('data on login', data);
        window.sessionStorage.setItem('user_id', data.scott);
        window.sessionStorage.setItem('username', data.username);
        $.get('/api/messages/' + window.sessionStorage.user_id).done(messages => {
        });
        this.props.handleAuth(() => {
          window.location.href = '#/dash';
        });
      } else {
        alert('Please, check Username or Password');
        window.location.href = '#/login';
      }
    });
  }

  render() {
    return (
      <div className="container-signup">
        <form className="register-login" type="submit" onSubmit={this.handleLogin.bind(this)}>
          <p id="sign-up">LOG IN</p>
            <p>Username</p>
              <input type="text" placeholder="Username" required ref="username" className="input pass" />
            <p>Password</p>
              <input type="password" placeholder="Password" required ref="password" className="input pass" />
            <p>
              <input type="submit" value="Login" className="inputButton" />
            </p>
              <div className="text-center">
                <a href="/">Back to main page</a>
            </div>
        </form>
      </div>
    );
  }
}

export default Login;
