export const addEvent = data => {
  return {
    type: 'ADD_EVENT',
    data
  }
};

export const selectCategory = data => {
  return {
    type: 'SELECT_CATEGORY',
    data
  }
};

export const selectSubcategory = data => {
  return {
    type: 'SELECT_SUBCATEGORY',
    data
  }
};

export const showFixture = data => {
  return {
    type: 'SHOW_FIXTURE',
    data
  }
};

export const eventsFetchError = bool => {
  return {
    type: 'EVENTS_FETCH_ERROR',
    fetchingEventsError: bool
  };
}

export const eventsAreLoading = bool => {
  return {
    type: 'EVENTS_ARE_LOADING',
    eventsAreLoading: bool
  };
}

export const eventsFetchSuccess = response => {
  return {
    type: 'EVENTS_FETCH_SUCCESS',
    response
  };
}

export function fetchEvents(url) {
  return dispatch => {
    dispatch(eventsAreLoading(true));

    fetch(url)
      .then(response => response.json())
      .then(response => dispatch(eventsFetchSuccess(response)))
      .catch(() => dispatch(eventsFetchError(true)));
  };
}
