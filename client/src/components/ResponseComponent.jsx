import React from 'react';
import { connect } from 'react-redux';
import actions from '../../redux/actions.js';
import $ from 'jquery';
import css from '../styles/response.css';
import { Link } from 'react-router';
import { voteButtons, checkFile } from '../utils/helpers';

class ResponseComponent extends React.Component {
  constructor(props) {
    super(props);

    this.onUsernameClick = this.onUsernameClick.bind(this);
  }

  onUsernameClick(response) {
    let outer = this;
    window.sessionStorage.newUsername = response.username;
    window.sessionStorage.newUser_id = response.user_id;
    $.get('/api/profile/' + window.sessionStorage.newUsername).done(user => {
      outer.props.dispatch(actions.addUser(user));
      window.location.href = '/#/profile/' + response.username;
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
    });
  }

  render() {
    let taskButtons = (response) => {
      if (window.sessionStorage.username === this.props.response.username) {
        if (!this.state.isEditing) {
          return (
            <div>
              <button className="btn btn-default btn-sm edit" onClick={() => this.editResponse()}>
                <span className="glyphicon glyphicon-edit"></span>
              </button>
              <button className="btn btn-default btn-sm delete" onClick={() => this.deleteResponse(response)}>
                <span className="glyphicon glyphicon-remove"></span>
              </button>
            </div>
          );
        }

        return (
          <div>
            <div className="editor">
              <form id="editform" onSubmit={() => this.saveChallenge(response)}>
                <input type="text" placeholder="Edit title" required ref="title"/><br/>
                <input type="text" placeholder="Edit description" required ref="description"/>
              </form>

              <button type="submit" form="editform" value="submit" className="btn btn-large btn-default edit">Save</button>
              <button className="btn btn-large btn-default delete" onClick={() => this.cancelEdit()}>Cancel</button>
            </div>
          </div>
        );
      }
    };

    if (this.props.response) {
      let timeDifferenceInSeconds = (new Date().getTime() - parseInt(this.props.response.created_at)) / 1000;
      return (
        <div className="one-response row">
          <div className="col-lg-6 response-info">
            {checkFile(this.props.response.filename.split('.').pop(), this.props.response)}<br/>
          </div>
          <div className="col-lg-6 response-info text-center">
            <div className="row all-response-data response-title-row">
              <a href="javasript:void(0)" onClick={() => { this.props.onResponseTitleClick(this.props.response); }}>{this.props.response.title}</a>
            </div>
            <div className="row all-response-data response-votebuttons-row">
              {voteButtons(this.props, this.props.response.id, this.props.response.upvotes, this, 'btn-md')}
            </div>
            <div className="row all-response-data response-username-row">
              <Link onClick={() => this.onUsernameClick(this.props.response)} className="response-username">{this.props.response.username + ' '}</Link>
            </div>
          </div>
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

export default connect(mapStateToProps)(ResponseComponent);

