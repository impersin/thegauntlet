import React from 'react';
import { connect } from 'react-redux';
import actions from '../../redux/actions.js';
import $ from 'jquery';
import css from '../styles/response.css';
import { Link } from 'react-router';
import ResponseComponent from './ResponseComponent.jsx';

class ResponseList extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    if (this.props.responses.length) {
      return (
      <div className="response-list container">
        {this.props.responses.map((response, i) =>
          <ResponseComponent response={response} onResponseTitleClick={this.props.onResponseTitleClick} key={i} />
        )}
      </div>
      );
    } else {
      return (
      <div className="response-list container">
        <div className="text-center">
          <p>No one has responded to this challenge! Be the first!</p>
        </div>
      </div>
      );
    }
  }
}



const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps)(ResponseList);