import React, { Component } from 'react';
import './App.css';
import io from 'socket.io-client';
import { connect } from 'react-redux';
import {
  addEvent,
  updateEvent,
  selectCategory,
  selectSubcategory,
  fetchEvents,
  showFixture
} from '../../actions';

import Category from '../Category/Category';
import Subcategory from '../Subcategory/Subcategory';
import FixturesList from '../FixturesList/FixturesList';
import Fixture from '../Fixture/Fixture';
let socket = io('http://127.0.0.1:8787');

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
    socket.on('newEventAdded', newEvent => {
      props.addEvent(newEvent);
    });
    socket.on('eventUpdated', updatedEvent => {
      props.updateEvent(updatedEvent);
    });
  }

  componentWillUnmount() {
    socket.disconnect();
  }

  render() {
    return (
      <div className="app">
        <h1 className="app-title">Bet</h1>
        <Category categories={categories} selectCategory={this.props.selectCategory} selectedCategory={this.props.selectedCategory} />
        {
          this.props.selectedCategory &&
          <Subcategory subcategories={subcategories[this.props.selectedCategory]} selectedCategory={this.props.selectedCategory} selectedSubcategory={this.props.selectedSubcategory} selectSubcategory={this.props.selectSubcategory} fetchData={this.props.fetchData} />
        }
        {
          this.props.selectedSubcategory &&
          <FixturesList selectedSubcategory={this.props.selectedSubcategory} events={this.props.events} eventsAreLoading={this.props.eventsAreLoading} fetchingEventsError={this.props.fetchingEventsError} showFixture={this.props.showFixture} />
        }
        {
          this.props.selectedFixture &&
          <Fixture selectedFixture={this.props.selectedFixture} />
        }
      </div>
    );
  }
}

const mapStateToProps = state => {
  return {
    selectedCategory: state.eventsReducer.selectedCategory,
    selectedSubcategory: state.eventsReducer.selectedSubcategory,
    selectedFixture: state.eventsReducer.selectedFixture,
    events: state.eventsReducer.events,
    eventsAreLoading: state.eventsReducer.eventsAreLoading,
    fetchingEventsError: state.eventsReducer.fetchingEventsError
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    addEvent: (newEvent) => dispatch(addEvent(newEvent)),
    updateEvent: (updatedEvent) => dispatch(updateEvent(updatedEvent)),
    selectCategory: (selectedCategory) => dispatch(selectCategory(selectedCategory)),
    selectSubcategory: (selectedSubcategory) => dispatch(selectSubcategory(selectedSubcategory)),
    fetchData: (url) => dispatch(fetchEvents(url)),
    showFixture: (fixture) => dispatch(showFixture(fixture))
  }
};

const EventsApp = connect(
  mapStateToProps,
  mapDispatchToProps
)(App);

export default EventsApp;
