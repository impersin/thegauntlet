import React from 'react';
import $ from 'jquery';
import css from '../styles/landing.css';
import { connect } from 'react-redux';
import actions from '../../redux/actions';
import NavBar from './Nav.jsx';
import { Link } from 'react-router';

class Landing extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      auth: this.props.auth,
      cover: undefined,
      auth: this.props.auth
    };
  }

  componentDidMount() {
    let outer = this;
    $.get('/api/allChallenges')
    .then((data) => {
      data.reverse();
      outer.props.dispatch(actions.getChallenges(data));
    });
  }


  handleSignup(e) {
    e.preventDefault();
    let signup = {
      firstname: this.refs.firstname.value,
      lastname: this.refs.lastname.value,
      username: this.refs.username.value,
      password: this.refs.password.value,
      email: this.refs.email.value
    };
    let confirmPassword = this.refs.confirmPassword.value;

    if (signup.password === confirmPassword) {
      $.post('/api/signup', signup)
      .done(data => {
        if (!data) {
          alert('username already exists!');
          this.refs.username.value = '';
          window.location.href = '#/';
        } else {
          window.sessionStorage.setItem('user_id', data.scott);
          window.sessionStorage.setItem('username', data.username);
          this.props.handleAuth(() => {
            window.location.href = '#/dash';
          });
        }
      });
    } else {
      this.refs.password.value = '';
      this.refs.confirmPassword.value = '';
      window.location.href = '#/';
      alert('Password does not match...');
    }
  }

  render() {
    return (
      <div>
        <NavBar auth={this.props.auth} handleLogout={this.props.handleLogout}/>
          <div className="container-fluid text-center main-content landing-cover">
            <div className="col-md-12 text-center landing-header">
              <div className="row">
                <div className="col-md-9 text-center landing-header-left">
                  <h1 id="landing-title">Welcome to The<br/> Gauntlet!</h1>
                </div>
                <div className="col-md-3 landing-header-right">
                  <form className="landing-register" type="submit" onSubmit={this.handleSignup.bind(this)}>
                    <input type="text" placeholder="What's your Firstname?" required ref="firstname" className=" landing-input pass" />
                    <input type="text" placeholder="What's your Lastname?" required ref="lastname"className=" landing-input pass" />
                    <input type="text" placeholder="Create a Username" required ref="username" className="landing-input pass" />
                    <input type="email" placeholder="Enter your Email" required ref="email" className="landing-input pass" />
                    <input type="password" placeholder="Create a Password"required ref="password" className="landing-input pass" />
                    <input type="password" placeholder="Confirm Password" ref="confirmPassword" className=" landing-input pass" />
                    <input type="submit" value="Join Gauntlet!" className=" landing-inputButton" />
                    <span id="agreement">
                      By clicking "Sign up", you agree to our terms of service and privacy policy. We’ll occasionally send you account related emails.
                    </span>
                  </form>
                </div>
              </div>
            </div>
            <div className="row header">
              <div className="col-lg-12">
                <h2>The Gauntlet is a place to test yourself against others!<br/>
                Add your own challenge and watch others respond, or one-up another challenger</h2>
              </div>
            </div>
            <div className="row">
              <div className="col-md-4 col">
                <h4>Create a Challenge</h4>
                  <img id="icon1"
                  src="http://www.neurologyintranslation.com/wp-content/uploads/2011/07/video_icon.png" alt=""/>
                  <p>
                    Upload a video of your challenge
                  </p>
              </div>
            <div className="col-md-4 col">
                <h4>Respond</h4>
                <img id="icon2" src="https://cdn4.iconfinder.com/data/icons/seo-accessibility-usability-2-2/256/Interaction_Design-512.png" alt=""/>
                <p>
                  Browse challenges<br/>
                  Think you can do better?<br/>
                  Respond with your own video
                </p>
            </div>
            <div className="col-md-4 col">
              <h4>Win</h4>
              <img id="icon3" src="https://cdn4.iconfinder.com/data/icons/sports-and-games-line-circle/614/533_-_Podium-256.png" alt=""/>
              <p>
                Earn the most votes<br/>
                to become the champion
              </p>
            </div>
          </div>
        </div>
      </div>
    );
  }
  }

const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps)(Landing);

