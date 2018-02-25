const initialState = {
    selectedCategory: '',
    events: []
};

const eventsReducer = (state = initialState, action) => {
    switch (action.type) {
        case 'ADD_EVENT':
            return { ...state, events: [...state.events, action.data] };
        case 'SELECT_CATEGORY':
            return { ...state, selectedCategory: action.data };
        case 'GET_EVENTS':
            console.log(action.response);
            return state;
        default:
            return state;
    }
}

export default eventsReducer;