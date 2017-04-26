import React from 'react';
import { connect } from 'react-redux';
import css from '../styles/comments.css';
import $ from 'jquery';
import actions from '../../redux/actions';

class Comments extends React.Component {
  constructor(props) {
    super(props);
    this.commentSubmit = this.commentSubmit.bind(this);
  }
  componentDidMount() {
    this.autoscroll();
  }

  componentDidUpdate() {
    this.autoscroll();
  }
  autoscroll () {
    let node = document.getElementById('comments');
    $('#comments').scrollTop(node.scrollHeight);
  }

  commentSubmit(e) {
    e.preventDefault();
    let outer = this;     
    let comments = {
      comment: this.refs.comment.value,
      challenge_id: window.sessionStorage.id
    };
    $.post('/api/comments', comments).then(() => {
      $.get('/api/comments', {
        challenge_id: window.sessionStorage.getItem('id')
      }).then(data => { 
        outer.props.dispatch(actions.addComment(data));
        outer.refs.comment.value = '';
      });
    });
  }

  renderComments() {
    let outer = this;
    $.get('/api/comments', {
      challenge_id: window.sessionStorage.getItem('id')
    }).done(data => {
      outer.newComments = data;
    });
  }

  render() {
    let mappedComments = this.props.comments.map((comment, i) => {
      if (comment.id === parseInt(window.sessionStorage.id)) {
        return (
          <div>
            <span className="chat-user" style={{fontWeight: 'bold'}}>{`${comment.username}: `}</span><span>{comment.comment}</span>
          </div>
        );
      }
    });

    return (
    <div className="row">  
      <div className='comment-box col-lg-6 col-lg-offset-1'>
        <form onSubmit={this.commentSubmit} className='chat-form'>
          <textarea name="comment" required ref="comment" placeholder="Enter comment..."></textarea>
          <button className="button comment-button">COMMENT</button>
        </form>  
        <div id="comments">{mappedComments}
        </div>
      </div> 
    </div>
    );
  }
}

const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps)(Comments);