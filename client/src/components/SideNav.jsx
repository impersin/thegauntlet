import React from 'react';
import {connect} from 'react-redux';
import actions from '../../redux/actions.js';
import css from '../styles/sideNav.css';

class SideNav extends React.Component {
  constructor(props) {
    super(props);
    this.onSideBarClick = this.onSideBarClick.bind(this);
    this.challengeSearch = this.challengeSearch.bind(this);
  }

  onSideBarClick(category) {
    const outer = this;
    this.props.dispatch(actions.setCurrentCategory(category));
    if (category === 'LeaderBoard') {
      $.get('/api/ranks').then((rankData) => {
        let users = rankData.filter(person =>person.upvotes > 0);
        outer.props.dispatch(actions.getRanks(users));
      });
    } else {
      $.get('/api/allchallenges').done(data => {
        if (category === 'all') {
          data = data.reverse();
        } else if (category === 'recent') {
          data.length < 6 ? data = data.reverse() : data = data.slice(-5).reverse();
        } else if (category === 'popular') {
          data = data.sort((a, b) => b.upvotes - a.upvotes);
        } else {
          data = data.filter(challenge => challenge.category === category);
        }
        outer.props.dispatch(actions.getChallenges(data));
      });
    }
  }

  challengeSearch (e) {
    e.preventDefault();
    const outer = this;
    $.get('/api/challengeSearch', {search: outer.refs.search.value})
    .then(data => {
      outer.props.dispatch(actions.getChallenges(data));
      outer.refs.search.value = '';
    });
  }

  render() {
    return (
      <div className="side-nav">
        <form className="input-group" onSubmit={ (e)=> this.challengeSearch(e)}>
          <span className="input-group-btn">
            <button className="btn btn-default" onClick={(e) => this.challengeSearch(e) }><span className="glyphicon glyphicon-search"></span></button>
          </span>
            <input type="text" required ref="search" className="form-control" placeholder="Search ..."/>

        </form>
        <div>
          <button onClick={()=>{ this.onSideBarClick('LeaderBoard'); }} className="list-item">LeaderBoard</button>
          <button onClick={()=>{ this.onSideBarClick('all'); }} className="list-item">All Challenges</button>
          <button onClick={()=>{ this.onSideBarClick('popular'); }} className="list-item">Most Popular</button>
          <button onClick={()=>{ this.onSideBarClick('recent'); }} className="list-item">Recent</button>
          <button onClick={()=>{ this.onSideBarClick('Sports'); }} className="list-item">Sports</button>
          <button onClick={()=>{ this.onSideBarClick('Funny'); }} className="list-item">Funny</button>
          <button onClick={()=>{ this.onSideBarClick('Charity'); }} className="list-item">Charity</button>
          <button onClick={()=>{ this.onSideBarClick('Fitness'); }} className="list-item">Fitness</button>
          <button onClick={()=>{ this.onSideBarClick('Music'); }} className="list-item">Music</button>
          <button onClick={()=>{ this.onSideBarClick('Gaming'); }} className="list-item">Gaming</button>
          <button onClick={()=>{ this.onSideBarClick('Other'); }} className="list-item">Other</button>
        </div>
      </div>
    );
  }
}


const mapStateToProps = (state) => {
  return state;
};

export default connect(mapStateToProps)(SideNav);
