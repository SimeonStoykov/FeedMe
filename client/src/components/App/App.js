import React, { Component } from 'react';
import './App.css';
import io from 'socket.io-client';
import { connect } from 'react-redux';
import {
  addEvent,
  selectCategory,
  getEvents
} from '../../actions';

import Category from '../Category/Category';
import Subcategory from '../Subcategory/Subcategory';

// let socket = io('http://127.0.0.1:8787');

let categories = [
  {
    id: 1,
    name: 'Football'
  },
  {
    id: 2,
    name: 'Tennis'
  }
];

let subcategories = {
  Football: [
    {
      id: 1,
      name: 'Premier League'
    },
    {
      id: 2,
      name: 'Scottish Premiership'
    },
    {
      id: 3,
      name: 'Sky Bet Championship'
    },
    {
      id: 4,
      name: 'Sky Bet League One'
    },
    {
      id: 5,
      name: 'Sky Bet League Two'
    }
  ],
  Tennis: [
    {
      id: 1,
      name: 'French Open'
    },
    {
      id: 2,
      name: 'Wimbledon'
    },
    {
      id: 3,
      name: 'US Open'
    },
    {
      id: 4,
      name: 'Australian Open'
    },
    {
      id: 5,
      name: 'Davis Cup'
    }
  ]
};

class App extends Component {
  constructor(props) {
    super(props);
    // socket.on('eventAdded', data => {
    //   console.log(data);
    //   props.addEvent(data);
    // });
  }

  componentWillUnmount() {
    // socket.disconnect();
  }

  // getEvents(subCategory) {
  //   fetch(`http://127.0.0.1:8787/api/events?category=${encodeURIComponent(this.props.selectedCategory)}&subCategory=${encodeURIComponent(subCategory)}`, {
  //     method: 'GET'
  //   })
  //     .then(response => response.json())
  //     // .then(response => {
  //     //   return dispatch({
  //     //     type: 'GET_EVENTS',
  //     //     response
  //     //   });
  //     // });
  // }

  render() {
    return (
      <div className="app">
        <h1 className="app-title">Bet</h1>
        <Category categories={categories} selectCategory={this.props.selectCategory} />
        {
          this.props.selectedCategory &&
          <Subcategory subcategories={subcategories[this.props.selectedCategory]} selectedCategory={this.props.selectedCategory} getEvents={this.props.getEvents} />
        }
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    selectedCategory: state.eventsReducer.selectedCategory,
    events: state.eventsReducer.events
  };
}

const mapDispatchToProps = {
  addEvent,
  selectCategory,
  getEvents
};

const EventsApp = connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

export default EventsApp;
