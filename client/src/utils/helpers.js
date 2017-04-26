import React from 'react';

let whichFavoriteIcon = (store, challengeId, context, size) => {
  if (store.favorites.some(challenge => challenge.id === challengeId)) {
    return (
          <button className={`btn ${size || 'btn-lg'} social-button`}>
            <span className="glyphicon glyphicon-heart" style={{color: 'red'}} onClick={() => { context.removeFromFavorites(challengeId); }}></span>
          </button>
    );
  } else {
    return (
          <button className={`btn ${size || 'btn-lg'} social-button`} onClick={() => { context.addToFavorites(challengeId); }}>
            <span className="glyphicon glyphicon-heart"></span>
          </button>
    );
  }
};


let whichFollowButton = (state, leaderId, user, context) => {
  if (window.sessionStorage.username !== user) {
    if (state.leaders.includes(leaderId)) {
      return (
        <button className="btn btn-default btn-sm pull-right follower"onClick={() => context.unFollow(leaderId)}>
          <span className="glyphicon glyphicon-ok"></span>{'  Unfollow'}
        </button>
      );
    } else {
      return (
        <button className="btn btn-default btn-sm pull-right follower" onClick={() => context.followTheLeader(leaderId)}>
          <span className="glyphicon glyphicon-ok"></span>{'  Follow'}
        </button>
      );
    }
  }
};

let voteButtons = (store, challengeId, upvotes, context, size) => {
  if (store.upvoted.includes(challengeId)) {
    return (
      <span>
        <button onClick={() => context.upVoteClick(challengeId)} type="button" className={`btn ${size || 'btn-lg'} social-button`} style={{color: 'green'}}>
          <span className="glyphicon glyphicon-arrow-up"></span>
        </button>
        <button className={`btn ${size || 'btn-lg'} social-button`}>{upvotes}</button>
        <button onClick={() => context.downVoteClick(challengeId)} type="button" className={`btn ${size || 'btn-lg'} social-button`}>
          <span className="glyphicon glyphicon-arrow-down"></span>
        </button>
      </span>
    );
  } else if (store.downvoted.includes(challengeId)) {
    return (
      <span>
        <button onClick={() => context.upVoteClick(challengeId)} type="button" className={`btn ${size || 'btn-lg'} social-button`}>
          <span className="glyphicon glyphicon-arrow-up"></span>
        </button>
        <button className={`btn ${size || 'btn-lg'} social-button`}>{upvotes}</button>
        <button onClick={() => context.downVoteClick(challengeId)} type="button" className={`btn ${size || 'btn-lg'} social-button`} style={{color: 'red'}}>
          <span className="glyphicon glyphicon-arrow-down"></span>
        </button>
      </span>
    );
  } else {
    return (
      <span>
        <button onClick={() => context.upVoteClick(challengeId)} type="button" className={`btn ${size || 'btn-lg'} social-button`}>
          <span className="glyphicon glyphicon-arrow-up"></span>
        </button>
        <button className={`btn ${size || 'btn-lg'} social-button`}>{upvotes}</button>
        <button onClick={() => context.downVoteClick(challengeId)} type="button" className={`btn ${size || 'btn-lg'} social-button`}>
          <span className="glyphicon glyphicon-arrow-down"></span>
        </button>
      </span>
    );
  }
};      

let checkFile = (type, challenge) => {
  const fileType = {
    'mp4': 'THIS IS A VIDEO!',
    'mov': 'THIS WORKS TOO'
  };
  if (fileType[type.toLowerCase()]) {
    return (
      <video className="parentMedia" controls>
        {<source src={'https://s3-us-west-1.amazonaws.com/thegauntletbucket421/' + challenge.filename} type="video/mp4"/>}
      </video>);
  } else {
    return <img className="parentMedia" src={'https://s3-us-west-1.amazonaws.com/thegauntletbucket421/' + challenge.filename} />;
    // return <img className="parentMedia" src="http://www.jacksonhole.com/blog/wp-content/uploads/whiteford.jpg" />;
  }
};


  
let taskButtons = (comment, state, context) => {
  if (comment.username === window.sessionStorage.username) {
    if (!state.isEditing) {
      return (
        <span>
          <button className="btn btn-sm btn-default task-button social-button">
            <span className="glyphicon glyphicon-edit" onClick={() => context.editComment()}></span>
          </button>
          <button className="btn btn-sm btn-default task-button social-button" onClick={() => context.deleteComment(comment)}>
            <span className="glyphicon glyphicon-remove" onClick={() => context.deleteComment(comment)}></span>
          </button>
        </span>
      );
    }

    return (
      <span>
        <div className="editor">
          <form id="editform" onSubmit={() => this.saveComment(comment)}>
            <input type="text" placeholder="Edit comment" required ref="comment"/>
          </form>
          <button type="submit" form="editform" value="submit" className="btn btn-large btn-default edit">Save</button>
          <button className="btn btn-large btn-default cancel" onClick={() => this.cancelEdit()}>Cancel</button>
        </div>
      </span>
    );
  }
};  

let checkForOriginalChallenge = (currentVideoID) => {
  if (parseInt(window.sessionStorage.challengeId) !== currentVideoID) {
    return (
      <button className="button original-back-button" onClick={() => { this.backToOriginalChallenge(window.sessionStorage.challengeId); }}>BACK TO ORIGINAL CHALLENGE</button>
    );
    return <div></div>;
  }
};    

let calculateTime = (seconds) => {
  if (seconds < 60) {
    return Math.floor(seconds) + ' seconds ago';
  } else if (seconds >= 60 && seconds < 3600) {
    if (seconds < 120) {
      return ' 1 minute ago';
    } else {
      return Math.floor(seconds / 60) + ' minutes ago';
    }
  } else if (seconds >= 3600 && seconds < 86400) {
    if (seconds < 7200) {
      return ' 1 hour ago';
    } else {
      return Math.floor(seconds / 3600) + ' hours ago';
    }
  } else if (seconds >= 86400 && seconds < 604800) {
    if (seconds < 172800) {
      return ' 1 day ago';
    } else {
      return Math.floor(seconds / 86400) + ' days ago';
    }
  } else if (seconds >= 2592000 && seconds < 31104000) {
    if (seconds < 5184000) {
      return ' 1 month ago';
    } else {
      return Math.floor(seconds / 2592000) + ' months ago';
    }
  } else {
    if (seconds < 62208000) {
      return ' 1 year ago';
    } else {
      return Math.floor(seconds / 31104000) + ' years ago';
    }
  }
};



export { 
  whichFavoriteIcon, 
  voteButtons, 
  calculateTime, 
  checkFile, 
  taskButtons,
  whichFollowButton 
};