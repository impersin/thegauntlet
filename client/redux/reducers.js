const reducer = (state, action) => {
  switch (action.type) {
  
  case 'GET_CHALLENGES': 
    return Object.assign({}, state, {
      challenges: action.payload
    });
  
  case 'ADD_CHALLENGE':
    let newChallenges = state.challenges.slice();
    newChallenges.unshift(action.payload[0]);
    return Object.assign({}, state, {
      challenges: newChallenges
    });
  
  case 'GET_RESPONSES': 
    return Object.assign({}, state, {
      responses: action.payload
    });
  
  case 'ADD_RESPONSE':
    let newResponses = state.responses.slice();
    newResponses.unshift(action.payload[0]);
    return Object.assign({}, state, {
      responses: newResponses
    });
  
  case 'GET_COMMENTS':   
    return Object.assign({}, state, {
      comments: action.payload
    });
  
  case 'ADD_COMMENT': 
    let newComments = state.comments.slice();
    newComments.unshift(action.payload[0]);
    return Object.assign({}, state, {
      comments: newComments 
    });
    
  case 'GET_LEADERS': 
    return Object.assign({}, state, {
      leaders: action.payload
    });
  
  case 'ADD_USER':
    return Object.assign({}, state, {
      user: action.payload
    });
  
  case 'SET_CATEGORY':
    return Object.assign({}, state, {
      currentCategory: action.payload
    });
  
  case 'SET_VIEW':
    return Object.assign({}, state, {
      profileView: action.payload
    });
  
  case 'GET_FOLLOWERS':
    return Object.assign({}, state, {
      followers: action.payload
    });
  
  case 'GET_RANKS':
    return Object.assign({}, state, {
      ranks: action.payload
    });
  
  case 'SET_FAVORITES':
    return Object.assign({}, state, {
      favorites: action.payload
    });
  
  case 'GET_UPVOTED':
    return Object.assign({}, state, {
      upvoted: action.payload
    });
  
  case 'GET_DOWNVOTED': 
    return Object.assign({}, state, {
      downvoted: action.payload
    });
  
  case 'UPDATE_POST':
    let updateObj = {};

    for (var keys in state) {
      if (keys === 'responses' || keys === 'challenges') {
        updateObj[keys] = [];
        state[keys].forEach((key, i) => {
          if (key.id === action.payload[0].id) {
            updateObj[keys][i] = action.payload[0];
          } else {
            updateObj[keys][i] = key;
          }
        });
      } else {
        updateObj[keys] = state[keys];
      }
    }
    return Object.assign({}, updateObj);
    
  case 'ADD_MESSAGE':
    let newMessages = state.messages.slice();
    newMessages.unshift(action.payload[0]);
    return Object.assign({}, state, {
      messages: newMessages
    });
  
  case 'GET_MESSAGES':
    return Object.assign({}, state, {
      messages: action.payload
    });
  
  case 'READ_MESSAGE':
    let readMessage = {};

    for (var keys in state) {
      if (keys === 'messages') {
        readMessage[keys] = [];
        state[keys].forEach(key => {
          readMessage[keys].push(key);
        });
        readMessage[keys].forEach(message => {
          if (message.message_id === action.payload[0].message_id) {
            message.read = 1;
          }
        });
      } else {
        readMessage[keys] = state[keys];
      }
    }

    return Object.assign({}, readMessage);
  
  case 'READ_NOTIFICATION':
    let readNotification = {};

    for (var keys in state) {
      if (keys === 'comments' && action.payload[0].comment) {
        readNotification[keys] = [];
        state[keys].forEach(key => {
          readNotification[keys].push(key);
        });
        readNotification[keys].forEach(comment => {
          if (comment.id === action.payload[0].id) {
            comment.read = 1;
          }
        });
      } else if (keys === 'responses' && action.payload[0].parent_id) {
        readNotification[keys] = [];
        state[keys].forEach(key => {
          readNotification[keys].push(key);
        });
        readNotification[keys].forEach((response, i) => {
          if (response.id === action.payload[0].id) {
            readNotification[keys][i] = action.payload[0];
          }
        });
      } else {
        readNotification[keys] = state[keys];
      }
    }

    return Object.assign({}, readNotification);
 
  case 'SET_DISPLAY_MESSAGES':
    return Object.assign({}, state, {
      displayMessages: action.payload
    });
  
  case 'SET_DISPLAY_NOTIFICATIONS':
    return Object.assign({}, state, {
      displayNotifications: action.payload
    });
 
  case 'UPDATE_COMMENT':
    let updateCommentObj = {};

    for (var keys in state) {
      if (keys === 'comments') {
        updateCommentObj[keys] = [];
        state[keys].forEach((key, i) => {
          if (key.id === action.payload[0].id) {
            updateCommentObj[keys][i] = action.payload[0];
          } else {
            updateCommentObj[keys][i] = key;
          }
        });
      } else {
        updateCommentObj[keys] = state[keys];
      }
    }

    return Object.assign({}, updateCommentObj);
  
  case 'CREATE_CHAT':
    let chatsObj = {};

    for (var keys in state) {
      if (keys === 'chats') {
        chatsObj[keys] = [];
        chatsObj[keys].push(action.payload[0]);
        state[keys].forEach((key, i) => {
          chatsObj[keys].push(key);
        });
      } else {
        chatsObj[keys] = state[keys];
      }
    }

    return Object.assign({}, chatsObj);
  
  case 'GET_CHATS':
    return Object.assign({}, state, {
      chats: action.payload
    });
  
  case 'SEEN_CHAT':
    let readChat = {};

    for (var keys in state) {
      if (keys === 'chats') {
        readChat[keys] = [];
        state[keys].forEach(key => {
          readChat[keys].push(key);
        });
        readChat[keys].forEach(chat => {
          if (chat.id === action.payload[0].id) {
            if (chat.new === 1) {
              chat.new = 0;
            } else {
              chat.new = 1;
            }
          }
        });
      } else {
        readChat[keys] = state[keys];
      }
    }

    return Object.assign({}, readChat);
  
  case 'SET_DISPLAY_CHATS':
    return Object.assign({}, state, {
      displayChats: action.payload
    });
  
  default: return state;
  }
  
};

export default reducer;

