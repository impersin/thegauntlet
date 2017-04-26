import React from 'react';
import { connect } from 'react-redux';
import actions from '../../redux/actions.js';
import ChallengeComponent from './ChallengeComponent.jsx';
import ProfileContent from './ProfileContent.jsx';
import $ from 'jquery';
import { Link } from 'react-router';
import css from '../styles/challengeList.css';
// import {emojify} from 'react-emojione2';
import { whichFavoriteIcon, voteButtons, checkFile, calculateTime } from '../utils/helpers';


class ChallengeList extends React.Component {
  constructor(props) {
    super(props);

    this.onUsernameClick = this.onUsernameClick.bind(this);
    this.upVoteClick = this.upVoteClick.bind(this);
    this.downVoteClick = this.downVoteClick.bind(this);
    this.followTheLeader = this.followTheLeader.bind(this);
    this.unFollow = this.unFollow.bind(this);
    this.addToFavorites = this.addToFavorites.bind(this);
    this.handleLeaderBoard = this.handleLeaderBoard.bind(this);
  }

  componentWillMount() {
    const outer = this;
    if (window.sessionStorage.username) {
      $.get('/api/upvote').then(data => {
        outer.props.dispatch(actions.getUpvoted(data));  
      });   
      $.get('/api/downvote').then(data => {
        outer.props.dispatch(actions.getDownvoted(data));
      });
    }
  }

  onUsernameClick(challenge) {
    let outer = this;
    window.sessionStorage.newUsername = challenge.username;
    window.sessionStorage.newUser_id = challenge.user_id || window.sessionStorage.user_id;
    outer.props.dispatch(actions.setProfileView('all'));
    $.get('/api/profile/' + window.sessionStorage.newUsername).done(user => {
      outer.props.dispatch(actions.addUser(user));
      window.location.href = '/#/profile/' + challenge.username;
    });
  }

  onRankerClick(rank) {
    let outer = this;
    window.sessionStorage.newUsername = rank.username;
    window.sessionStorage.newUser_id = rank.scott || window.sessionStorage.user_id;
    outer.props.dispatch(actions.setProfileView('all'));
    $.get('/api/profile/' + window.sessionStorage.newUsername).done(user => {
      outer.props.dispatch(actions.addUser(user));
      window.location.href = '/#/profile/' + rank.username;
    });
  }    

  onChallengeTitleClick(challenge) {
    if (challenge.parent_id === null) {
      window.sessionStorage.setItem('challengeId', challenge.id);
      window.sessionStorage.setItem('currentId', challenge.id);
      window.sessionStorage.setItem('challengeName', challenge.title);
      window.sessionStorage.setItem('category', challenge.category);
    } else if (window.sessionStorage.challengeId === undefined) {
      window.sessionStorage.setItem('challengeId', challenge.parent_id);
      window.sessionStorage.setItem('currentId', challenge.id);
      window.sessionStorage.setItem('challengeName', challenge.title);
      window.sessionStorage.setItem('category', challenge.category);
    } else {
      window.sessionStorage.challengeId = challenge.parent_id;
      window.sessionStorage.currentId = challenge.id;
      window.sessionStorage.challengeName = challenge.title;
      window.sessionStorage.setItem('category', challenge.category);
    }
  }
  
  upVoteClick(id) {
    const outer = this;   
    $.post('/api/upvote', {
      vote: 1,
      challenge_id: id    
    }).then(() => {
      $.get('/api/upvote').then(data => {
        outer.props.dispatch(actions.getUpvoted(data));
      });
      $.get('/api/downvote').then(data => {
        outer.props.dispatch(actions.getDownvoted(data));
      });
      $.get('/api/allChallenges')
        .then(data => { 
          if (outer.props.currentCategory === 'all') {
            data = data.reverse();
          } else if (outer.props.currentCategory === 'recent') {  
            data.length < 6 ? data = data.reverse() : data = data.slice(-5).reverse();  
          } else if (outer.props.currentCategory === 'popular') {
            data = data.sort((a, b) => b.upvotes - a.upvotes);
          } else {
            data = data.filter(challenge => challenge.category === outer.props.currentCategory);
          }
          outer.props.dispatch(actions.getChallenges(data));    
        });
    });  
  }

  downVoteClick(id) {
    const outer = this;   
    $.post('/api/downvote', {
      vote: 1,
      challenge_id: id    
    }).then(() => {
      $.get('/api/upvote').then(data => {
        outer.props.dispatch(actions.getUpvoted(data));
      });
      $.get('/api/downvote').then(data => {
        outer.props.dispatch(actions.getDownvoted(data));
      });
      $.get('/api/allChallenges')
        .then(data => { 
          if (outer.props.currentCategory === 'all') {
            data = data.reverse();
          } else if (outer.props.currentCategory === 'recent') {
            data.length < 6 ? data = data.reverse() : data = data.slice(-5).reverse(); 
          } else if (outer.props.currentCategory === 'popular') {
            data = data.sort((a, b) => b.upvotes - a.upvotes);  
          } else { 
            data = data.filter(challenge => challenge.category === outer.props.currentCategory);
          }
          outer.props.dispatch(actions.getChallenges(data));
        });
    });  
  }   

  followTheLeader(leaderId) {
    const outer = this;
    $.post('/api/follower', {
      leader_id: leaderId
    }).then(() => {
      $.get('/api/getLeaders').then(leaders => {
        outer.props.dispatch(actions.getLeaders(leaders.map(leader => parseInt(leader))));
      });
    });
  }

  unFollow(leaderId) {
    const outer = this;
    $.post('/api/unFollow', {
      leader_id: leaderId
    }).then(() => {
      $.get('/api/getLeaders').then(leaders => {
        outer.props.dispatch(actions.getLeaders(leaders.map(leader => parseInt(leader))));
      });
    });
  }

  addToFavorites(challengeId) {
    const outer = this;
    $.post('/api/favorite', {
      challenge_id: challengeId
    }).then(() => {
      $.get('/api/favorite').then( favorites => {
        outer.props.dispatch(actions.setFavorites(favorites));
      });
    });
  }

  removeFromFavorites(challengeId) {
    const outer = this;
    $.post('/api/unFavorite', {
      challenge_id: challengeId
    }).then(() => {
      $.get('/api/favorite').then(favorites => {
        outer.props.dispatch(actions.setFavorites(favorites));
      });
    });
  }

  handleLeaderBoard() {
    let bgColor;
    let medal;
    return this.props.ranks.filter(user => {
      return user.upvotes > 0;
    }).map((rank, index) => {  
      if (index < 10) {
        if (index === 0) {
          // medal = emojify(' :medal:', {output: 'unicode'});
        } else { medal = ''; }  
        if (index % 2 === 0 ) {
          bgColor = 'info';
        } else {
          bgColor = 'warning';
        }
        return (
                <tr className={bgColor} key={index}>
                  <td>
                    <span className="leader-td"> #{index + 1 }</span>
                    {<span id="medal" >{medal}</span>}
                  </td>
                  <td><Link onClick={() => this.onRankerClick(rank)}><span className="leader-td">{rank.username}</span></Link></td>
                  <td><span className="leader-td">{rank.upvotes}</span></td>
                </tr>
        );
      }
    });
  }

  render() {
    let mappedChallenges = this.props.challenges.map((challenge, i) => {
      if ((challenge && challenge.category === this.props.currentCategory) || (challenge && (this.props.currentCategory === 'all' || 'recent' || 'popular'))) {
        let timeDifferenceInSeconds = (new Date().getTime() - parseInt(challenge.created_at)) / 1000;
        return (
          <div className="col-md-3 col-md-offset-2 text-center one-challenge" key={i}>
            <div className="row challenge-title-row">
              <h5 onClick={() => this.onChallengeTitleClick(challenge)} className="challenge-title"><Link to={'/challenge'}>{challenge.title}</Link></h5>
            </div>  
            <div className="row challenge-media-row">
              {checkFile(challenge.filename.split('.').pop(), challenge)}<br/>
            </div>
            <div className="row category-row">
              <span className="category-tab">{challenge.category}</span>
            </div>  
            <div className="row challenge-buttons pagination-centered">
              {whichFavoriteIcon(this.props, challenge.id, this)}
              {voteButtons(this.props, challenge.id, challenge.upvotes, this)}
            </div>
            <div className="row username-time">
              <Link onClick={() => this.onUsernameClick(challenge)}><span>{challenge.username + ' '}</span></Link>
              <span className="">{calculateTime(timeDifferenceInSeconds)}</span>
            </div>
          </div>
        );
      } else {
        return <div></div>;
      }
    });

    if (this.props.currentCategory === 'profile') {
      return (
        <div>
          <ProfileContent/>
        </div>
      );
    }

    if (this.props.currentCategory === 'LeaderBoard') {
      return (
        <div className="col-md-12 leader-container">
          {/*<h1 className="text-center leaderBoard-title"></h1>*/}
          <img className="animated bounce infinite" id="leader-img" src="https://badgeos.org/wp-content/uploads/edd/2013/11/leaderboard-300x300.png" alt=""/>
            <table className="table table-nonfluid">
              <thead>
                <tr>
                  <th>#RANK</th>
                  <th>USERNAME</th>
                  <th>UPVOTES</th>
                </tr>
              </thead>
              <tbody>
                {this.handleLeaderBoard()}
              </tbody>
            </table>
          </div>
      );
    }

    if (mappedChallenges) {
      return <div className="media">{mappedChallenges}</div>;
    } else {
      return (
        <div>
          <h3>Sorry, currently there are no challenges in this category...</h3>
        </div>
      );
    }
  }
}

const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps)(ChallengeList);

