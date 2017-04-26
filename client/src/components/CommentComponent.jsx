import React from 'react';
import { Link } from 'react-router';
import css from '../styles/commentComponent.css';
import actions from '../../redux/actions';
import { connect } from 'react-redux';
import { calculateTime, taskButtons } from '../utils/helpers';

class CommentComponent extends React.Component {
  constructor(props) {
    super(props);
    this.onUsernameClick = this.onUsernameClick.bind(this);
    this.state = {
      isEditing: false
    };
  }

  onUsernameClick(comment) {
    let outer = this;
    console.log('comment.user_id', comment);
    window.sessionStorage.newUsername = comment.username;
    window.sessionStorage.newUser_id = comment.scott;
    console.log(window.sessionStorage.newUser_id);
    $.get('/api/profile/' + window.sessionStorage.newUsername).done(user => {
      outer.props.dispatch(actions.addUser(user));
      window.location.href = '/#/profile/' + comment.username;
    });
  }

  saveComment(comment) {
    let outer = this;
    this.setState({
      isEditing: !this.state.isEditing
    });

    $.ajax({
      url: '/api/updateComment/' + comment.id,
      type: 'PUT',
      data: {
        comment: this.refs.comment.value
      },
      success: function(data) {
        outer.props.dispatch(actions.updateComment(data));
      }
    });
  }

  deleteComment(comment) {
    let outer = this;
    console.log(comment);
    $.ajax({
      url: '/api/comment/' + comment.challenge_id,
      type: 'DELETE',
      data: {
        id: comment.id
      },
      success: function(data) {
        outer.props.dispatch(actions.getComments(data.reverse()));
      }
    });
  }

  editComment() {
    this.setState({
      isEditing: true
    });
  }

  cancelEdit() {
    this.setState({
      isEditing: !this.state.isEditing
    });
  }

  render() {
    let timeDifferenceInSeconds = (new Date().getTime() - parseInt(this.props.comment.created_at)) / 1000;

    let tag = (string) => {
      let comment = string.split(' ').map((word, i) => {
        if (word.includes('@')) {
          return <a href={'/#/profile/' + word.slice(1)} key={i}>{word}</a>;
        } else {
          return ' ' + word;
        }
      });
      return comment;
    };

    return (
      <div className="one-comment">
        <div className="row username-time-button-row">
          <Link onClick={() => this.onUsernameClick(this.props.comment)}className="userLink">{this.props.comment.username + ' '}</Link>
          <span className='timestamp'>{calculateTime(timeDifferenceInSeconds)}</span>
          <span className="pull-right">{taskButtons(this.props.comment, this.state, this)}</span>
        </div>
        <div className="row comment-message">  
          {tag(this.props.comment.comment)}
        </div>
      </div> 
    );
  }
}

const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps)(CommentComponent);
