import React from 'react';
import $ from 'jquery';
import css from '../styles/ProfilePictureEditor.css';
import { connect } from 'react-redux';
import actions from '../../redux/actions';
import ProfileContent from './ProfileContent.jsx';
import NavBar from './Nav.jsx';

class Profile extends React.Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
  }

  componentWillMount() {
    let outer = this;
    if (window.sessionStorage.username === window.sessionStorage.newUsername) {
      $.get('/api/comments', {
        user_id: window.sessionStorage.newUser_id
      }).done(data => {
        outer.props.dispatch(actions.getComments(data.reverse()));
      });
    }
    $.get('/api/response', {
      user_id: window.sessionStorage.newUser_id
    }).done(data => {
      console.log('response data', data)
      let responseArr = [];
      data.forEach(response => {
        if (response.parent_id) {
          responseArr.push(response);
          if (response.read === 0 && this.props.displayNotifications !== 'notifications-number') {
            outer.props.dispatch(actions.setDisplayNotifications('notifications-number'));
          }
        }
      });
      outer.props.dispatch(actions.getResponses(responseArr));
    });
    $.get('/api/messages/' + window.sessionStorage.username).done(messages => {
      messages.forEach(message => {
        outer.props.dispatch(actions.getMessages(messages));
        if (message.read === 0 && this.props.displayMessages !== 'newmessages-chat') {
          outer.props.dispatch(actions.setDisplayMessages('newmessages-chat'));
        }
      });
    });
    $.get('/api/chats', {
      username: window.sessionStorage.username
    }).done(data => {
      outer.props.dispatch(actions.getChats(data));
    });
    $.get('/api/ranks').done((rankData)=>{
      outer.props.dispatch(actions.getRanks(rankData));
    });
    $.get('/api/userChallenges', {
      user_id: window.sessionStorage.newUser_id
    }).done(challenges => {
      outer.props.dispatch(actions.getChallenges(challenges.reverse()));
    });
    if (!outer.props.user) {
      $.get('/api/profile/' + window.sessionStorage.newUsername).done(user => {
        outer.props.dispatch(actions.addUser(user));
      });
    }
    if (outer.props.favorites.length === 0) {
      $.get('/api/favorite', {username: window.sessionStorage.newUsername}).done(data => {
        outer.props.dispatch(actions.setFavorites(data));
      });
    }
  }

  handleChange(icon) {
    if (icon === 'messages') {
      this.setState({
        messageNumber: this.state.messageNumber += 1
      });
    } else {
      this.setState({
        notificationNumber: this.state.notificationNumber++
      });
    }
  }

  render() {
    if (this.props.user) {
      return (
        <div className='container-fluid profile'>
          <NavBar auth={this.props.auth} handleLogout={this.props.handleLogout}/>
          <ProfileContent handleChange={this.handleChange}/>
        </div>
      );
    } else {
      return <div></div>;
    }
  }
}

const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps)(Profile);
