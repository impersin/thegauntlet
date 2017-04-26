import React from 'react';
import SideNav from './SideNav.jsx';
import actions from '../../redux/actions';
import NavBar from './Nav.jsx';
import $ from 'jquery';
import { connect } from 'react-redux';
import css from '../styles/dash.css';
import ChallengeList from './ChallengeList.jsx';

class Dash extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    let outer = this;

    if (window.sessionStorage.username) {
      $.get('/api/getLeaders').done(leaders => {
        outer.props.dispatch(actions.getLeaders(leaders.map(leader => parseInt(leader))));
      });
      $.get('/api/profile').done(data => {
        outer.props.dispatch(actions.addUser(data));
      });
      $.get('/api/favorite').done(data => {
        outer.props.dispatch(actions.setFavorites(data));
      });
      $.get('/api/chats', {
        username: window.sessionStorage.username
      }).done(data => {
        console.log("get chats", data)
        data.forEach(chat => {
          outer.props.dispatch(actions.getChats(data));
          if (chat.new === 1) {
            outer.props.dispatch(actions.setDisplayChats('chats-number'));
          }
        });
      });
      $.get('/api/response', {
        user_id: window.sessionStorage.user_id
      }).done(data => {
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
      $.get('/api/comments', {
        user_id: window.sessionStorage.user_id
      }).done(data => {
        data.forEach(comment => {
          if (comment.read === 0) {
            outer.props.dispatch(actions.setDisplayNotifications('notifications-number'));
            return;
          }
        });
        outer.props.dispatch(actions.getComments(data.reverse()));
      });
    }
    $.get('/api/ranks').done((rankData) => {
      outer.props.dispatch(actions.getRanks(rankData));
    });
    $.get('/api/allChallenges').done(challenges => {
      outer.props.dispatch(actions.getChallenges(challenges.reverse()));
    });
  }

  render() {
    let whichCategory = () => {
      if (this.props.currentCategory === 'LeaderBoard') {
        return (
          <h4 className="category-title">Leaderboard</h4>
        );
      }
      return (
        <h4 className="category-title">{`Viewing ${this.props.currentCategory} challenges`}</h4>
      );
    };


    return (
      <div className="container-fluid">
        <NavBar auth={this.props.auth} handleLogout={this.props.handleLogout} editProfile={this.props.editProfile}/>
          <div className="row first-row">
            <div className="col-md-2 left-fixed">
              <SideNav />
            </div>
          </div>
          <div className="row main-row">
          <div className="category-title-row text-center">
            {whichCategory()}
          </div>
            <div className="col-md-9 col-md-offset-3">

                <div className="row">
                  <ChallengeList dispatch={this.props.dispatch} />
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


export default connect(mapStateToProps)(Dash);
