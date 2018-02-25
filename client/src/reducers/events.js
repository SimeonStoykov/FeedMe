const initialState = {
    selectedCategory: '',
    events: [],
    fetchingEventsError: false,
    eventsAreLoading: false
};

const eventsReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_EVENT':
            return { ...state, events: [...state.events, action.data] };
        case 'SELECT_CATEGORY':
            return { ...state, selectedCategory: action.data };
        case 'EVENTS_ARE_LOADING':
            return { ...state, eventsAreLoading: action.eventsAreLoading };
        case 'EVENTS_FETCH_SUCCESS':
            return { ...state, events: action.response.events, eventsAreLoading: false };
        case 'EVENTS_FETCH_ERROR':
            return { ...state, fetchingEventsError: action.fetchingEventsError, eventsAreLoading: false };
        default:
            return state;
    }
}

export default eventsReducer;