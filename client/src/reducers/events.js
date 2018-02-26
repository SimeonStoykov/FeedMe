const initialState = {
    selectedCategory: '',
    selectedSubcategory: '',
    selectedFixture: null,
    events: [],
    fetchingEventsError: false,
    eventsAreLoading: false
};

const eventsReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_EVENT':
            return { ...state, events: [...state.events, action.data] };
        case 'SELECT_CATEGORY':
            return {
                ...state,
                selectedCategory: action.data,
                selectedSubcategory: initialState.selectedSubcategory,
                eventsAreLoading: initialState.eventsAreLoading,
                fetchingEventsError: initialState.fetchingEventsError,
                events: initialState.events,
                selectedFixture: initialState.selectedFixture
            };
        case 'SELECT_SUBCATEGORY':
            return {
                ...state,
                selectedSubcategory: action.data,
                eventsAreLoading: initialState.eventsAreLoading,
                fetchingEventsError: initialState.fetchingEventsError,
                events: initialState.events
            };
        case 'SHOW_FIXTURE':
            return {
                ...state,
                selectedFixture: action.data,
                selectedCategory: initialState.selectedCategory,
                selectedSubcategory: initialState.selectedSubcategory,
                eventsAreLoading: initialState.eventsAreLoading,
                fetchingEventsError: initialState.fetchingEventsError,
                events: initialState.events
            };
        case 'EVENTS_ARE_LOADING':
            let eventsAreLoadingData = { ...state, eventsAreLoading: action.eventsAreLoading };
            if (action.eventsAreLoading) {
                eventsAreLoadingData.fetchingEventsError = initialState.fetchingEventsError;
            }
            return eventsAreLoadingData;
        case 'EVENTS_FETCH_SUCCESS':
            return { ...state, events: action.response.events, eventsAreLoading: false, fetchingEventsError: false };
        case 'EVENTS_FETCH_ERROR':
            let eventsFetchErrorData = { ...state, fetchingEventsError: action.fetchingEventsError };
            if (action.fetchingEventsError) {
                eventsFetchErrorData.eventsAreLoading = initialState.eventsAreLoading;
            }
            return eventsFetchErrorData;
        default:
            return state;
    }
}

export default eventsReducer;