import React from 'react';
import { connect } from 'react-redux';
import css from '../styles/comments.css';
import $ from 'jquery';
import actions from '../../redux/actions';
import CommentComponent from './CommentComponent.jsx';

class CommentList extends React.Component {
  constructor(props) {
    super(props);
    this.commentSubmit = this.commentSubmit.bind(this);
  }

  commentSubmit(e) {
    e.preventDefault();
    let outer = this;
    let created_at = new Date().getTime();
    let comments = {
      comment: this.refs.comment.value,
      challenge_id: window.sessionStorage.challengeId,
      created_at: created_at,
      username: window.sessionStorage.username,
      user_id: window.sessionStorage.user_id,
      title: this.props.challenges[0].title,
      read: 0
    };
    $.post('/api/comments', comments).then(data => {
      outer.props.dispatch(actions.addComment(data));
      outer.refs.comment.value = '';
    });
  }

  render() {
    let mappedComments = this.props.comments.map((comment, i) => {
      return (
        <div key={i}>
          <CommentComponent comment={comment} />
        </div>
      );
    });

    return (
    <div className="row comments-row">
      <div className='comment-box col-lg-6 col-lg-offset-1'>
         <form onSubmit={this.commentSubmit} className='chat-form'>
          <textarea name="comment" required ref="comment" placeholder="Enter comment..."></textarea>
          <button className="button comment-button">COMMENT</button>
        </form>
        <div id="comments">{mappedComments}</div>
      </div>
    </div>

    );
  }
}

const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps)(CommentList);