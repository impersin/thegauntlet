import React from 'react';
import ResponseList from './ResponseList.jsx';
import actions from '../../redux/actions';
import { connect } from 'react-redux';
import $ from 'jquery';
import CommentList from './CommentList.jsx';
import NavBar from './Nav.jsx';
import css from '../styles/nav.css';
import moreCSS from '../styles/challengeComponent.css';
import { Link } from 'react-router';
import { whichFavoriteIcon, voteButtons, calculateTime, checkFile } from '../utils/helpers';

class ChallengeComponent extends React.Component {
  constructor(props) {
    super(props);

    this.handleSubmit = this.handleSubmit.bind(this);
    this.onUsernameClick = this.onUsernameClick.bind(this);
    this.sortResponses = this.sortResponses.bind(this);
    this.onResponseTitleClick = this.onResponseTitleClick.bind(this);
    this.backToOriginalChallenge = this.backToOriginalChallenge.bind(this);
    this.removeFromFavorites = this.removeFromFavorites.bind(this);
    this.state = {
      isEditing: false,
      currentVideo: null
    };
  }

  componentWillMount() {
    let outer = this;
    $.get('/api/response', {
      parent_id: window.sessionStorage.challengeId
    }).done(data => {
      outer.props.dispatch(actions.getResponses(data.reverse()));
    });
    if (window.sessionStorage.user_id) {
      $.get('/api/messages/' + window.sessionStorage.user_id).done(messages => {
        messages.forEach(message => {
          outer.props.dispatch(actions.getMessages(messages));
          if (message.read === 0) {
            outer.props.dispatch(actions.setDisplayMessages('messages-number'));
          }
        });
      });
    }
    $.get('/api/comments', {
      challenge_id: window.sessionStorage.challengeId
    }).done(data => {
      outer.props.dispatch(actions.getComments(data.reverse()));
    });

    $.get('/api/favorite').done(data => {
      outer.props.dispatch(actions.setFavorites(data));
    });

    $.get('/api/everyChallenge').done(data => {
      for (let i = 0; i < data.length; i++) {
        if (data[i].id === parseInt(window.sessionStorage.currentId)) {
          outer.props.dispatch( actions.getChallenges( [data[i]] ));
        }
        if (data[i].id === parseInt(window.sessionStorage.currentId)) {
          this.setState({currentVideo: data[i]});
        }
      }
    });

    if (window.sessionStorage.username) {
      $.get('/api/upvote').then(data => {
        outer.props.dispatch(actions.getUpvoted(data));
      });
      $.get('/api/downvote').then(data => {
        outer.props.dispatch(actions.getDownvoted(data));
      });
    }
  }

  handleSubmit() {
    let outer = this;
    var fd = new FormData(document.querySelector('#upload'));
    if (this.refs.video.value) {
      $.ajax({
        url: '/api/s3',
        type: 'POST',
        data: fd,
        processData: false,  // tell jQuery not to process the data
        contentType: false,   // tell jQuery not to set contentType
        success: function(resp) {
          let created_at = new Date().getTime();

          $.ajax({
            url: '/api/response',
            type: 'POST',
            data: {
              title: outer.refs.title.value,
              description: outer.refs.description.value,
              filename: resp,
              parent_id: window.sessionStorage.getItem('challengeId'),
              created_at: created_at,
              username: window.sessionStorage.username,
              read: 0
            },
            success: function(data) {
              outer.props.dispatch(actions.addResponse(data));
              outer.refs.title.value = '';
              outer.refs.description.value = '';
              outer.refs.video.value = '';
            }
          });
        }
      });
    } else {
      alert('Please submit a file');
    }
  }

  saveChallenge(challenge) {
    let outer = this;
    this.setState({
      isEditing: !this.state.isEditing
    });

    $.ajax({
      url: '/api/challenge/' + challenge.id,
      type: 'PUT',
      data: {
        title: this.refs.title.value,
        description: this.refs.description.value
      },
      success: function(data) {
        console.log('editing data', data);
        outer.props.dispatch(actions.updatePost(data));
        outer.setState({
          currentVideo: data[0]
        });
      }
    });
  }

  deleteChallenge(challenge) {
    let outer = this;

    $.ajax({
      url: '/api/challenge/' + challenge.id,
      type: 'DELETE',
      success: function(data) {
        outer.props.dispatch(actions.getChallenges(data));
        window.location.href = '/#/dash';
      }
    });
  }

  editChallenge() {
    this.setState({
      isEditing: true
    });
  }

  onUsernameClick(challenge) {
    let outer = this;
    window.sessionStorage.newUsername = challenge.username;
    window.sessionStorage.newUser_id = challenge.user_id;
    $.get('/api/profile/' + window.sessionStorage.newUsername).done(user => {
      outer.props.dispatch(actions.addUser(user));
      window.location.href = '/#/profile/' + challenge.username;
    });
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
      $.get('/api/singleChallenge', {id: id})
        .then(data => {
          this.setState({currentVideo: data[0]});
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
      $.get('/api/singleChallenge', {id: id})
        .then(data => {
          this.setState({currentVideo: data[0]});
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

  unFollow (leaderId) {
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

  cancelEdit() {
    this.setState({
      isEditing: !this.state.isEditing
    });
  }

  sortResponses(sortBy) {
    const outer = this;
    $.get('/api/response/', {
      parent_id: window.sessionStorage.getItem('challengeId')
    }).then( data => {
      if (sortBy === 'top') {
        data = data.sort( (a, b) => {
          return b.upvotes - a.upvotes;
        });
      } else {
        data = data.reverse();
      }
      outer.props.dispatch(actions.getResponses(data));
    });
  }

  onResponseTitleClick(response) {
    window.sessionStorage.currentId = response.id;
    this.setState({currentVideo: response});
  }

  backToOriginalChallenge(challengeId) {
    $.get('/api/singleChallenge', {id: challengeId})
    .then( data => {
      this.setState({currentVideo: data[0]});
    });
  }

  render() {
    let checkForOriginalChallenge = (currentVideoID) => {
      if (parseInt(window.sessionStorage.challengeId) !== currentVideoID) {
        return (    
      <h4 className="original-back-button" onClick={() => { this.backToOriginalChallenge(window.sessionStorage.challengeId); }}>BACK TO ORIGINAL CHALLENGE</h4>
        );    
        return <div></div>;
      }
    };

    if (this.state.currentVideo) {
      let timeDifferenceInSeconds = (new Date().getTime() - this.state.currentVideo.created_at) / 1000;
      return (
        <div className="container-fluid challenge-component">
        <NavBar auth={this.props.auth} handleLogout={this.props.handleLogout} editProfile={this.props.editProfile}/>
          <div className='row mainRow'>
            <div className="col-lg-4 col-lg-offset-8 mainRowColumn outerBar">
              <div className="col-lg-4 fixed">
                <div className="row text-center response-button-row">
                  <div className="response-buttons-top">
                    <span className="dropdown">
                      <button href="javascript: void(0)" className="dropdown-toggle response-button" data-toggle="dropdown" role="button" aria-haspopup="true">RESPOND<span className="caret"></span></button>
                      <div className="dropdown-menu">
                        <form id="challenge" style={{width: '300px', padding: '15px'}}>
                          <div className="form-group">
                            <div className="nav-label">Name it!</div>
                            <input className="form-control" type="text" placeholder="Name your challenge" required ref="title" name="title"/>
                          </div>
                          <div className="form-group">
                            <div className="nav-label">Describe it!</div>
                            <input className="form-control" type="text" placeholder="Description" required ref="description" name="description"/>
                          </div>
                        </form>
                        <form ref="file" id="upload">
                          <div className="nav-label-file">Upload your video or image...</div>
                          <input id="fileInput" type="file" placeholder="video or image" required ref="video" name="video"/>
                        </form>
                        <center><div onClick={this.handleSubmit} className="btn btn-default">Submit</div></center>
                      </div>
                    </span>
                    <button className="button response-button" onClick={() => { this.sortResponses('recent'); }}>RECENT</button>
                    <button className="button response-button" onClick={() => { this.sortResponses('top'); }}>TOP</button>
                  </div>
                </div>
                <ResponseList onResponseTitleClick={this.onResponseTitleClick}/>
              </div>
            </div>
          </div>
          <div className="row parent-challenge-reminder-row">
            <div className="col-md-8 text-center">
              {checkForOriginalChallenge(this.state.currentVideo.id)}
            </div>
          </div>
          <div className="row current-viewing-row">
           <div className="col-lg-6 col-lg-offset-1 current-viewing-box">
              <div className="row current-viewing-title-row text-center">
                <p className='main-challenge-title'>{this.state.currentVideo.title}</p>
              </div>
              <div className='row current-media-row'>
                {checkFile(this.state.currentVideo.filename.split('.').pop(), this.state.currentVideo)}
              </div>
                <div className="row current-info">
                  <div className="col-md-12">
                    <div className="row">
                      <ul>
                        <li className="username username-and-timestamp"><a href="javascript:void(0)" onClick={() => { this.onUsernameClick(this.state.currentvideo); }}>{this.state.currentVideo.username}</a></li>
                        <li className="username-and-timestamp">{`${calculateTime(timeDifferenceInSeconds)}`}</li>
                        <li className="current-video-buttons pull-right">
                          {whichFavoriteIcon(this.props, this.state.currentVideo.id, this)}
                          {voteButtons(this.props, this.state.currentVideo.id, this.state.currentVideo.upvotes, this)}
                        </li>
                      </ul>
                    </div>
                    <div className="row">
                      <p className='main-challenge-description'>{this.state.currentVideo.description}</p>
                    </div>
                </div>
              </div>
            </div>
          </div>
          <CommentList />
      </div>
      );
    }
    return <div></div>;
  }
      }


const mapStateToProps = (state) => {
  return state;    
};

export default connect(mapStateToProps)(ChallengeComponent);