import React from 'react';
import { render } from 'react-dom';
import App from './components/App.jsx';
import configureStore from '../redux/store';
import { Provider } from 'react-redux';

let store = configureStore();

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
);