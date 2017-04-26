import { applyMiddleware, compose, createStore } from 'redux';
import reducer from './reducers';
import logger from 'redux-logger';
import thunk from 'redux-thunk';

let finalCreateStore = compose(
  applyMiddleware(logger(), thunk)
)(createStore);

const configureStore = (initialState = {
  challenges: [],
  responses: [],
  comments: [],
  leaders: [],
  currentCategory: 'all',
  profileView: 'all',
  favorites: [],
  ranks: [],
  followers: [],
  upvoted: [],
  downvoted: [],
  messages: [],
  displayChats: '',
  displayMessages: '',
  displayNotifications: '',
  coverVideo: '',
  chats: []
}) => {
  return finalCreateStore(reducer, initialState);
};

export default configureStore;
