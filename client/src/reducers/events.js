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
            let newEvent = action.data;
            if (state.events.length < 10 && state.selectedCategory === newEvent.category && state.selectedSubcategory === newEvent.subCategory) {
                return {
                    ...state,
                    events: [...state.events, newEvent],
                    fetchingEventsError: initialState.fetchingEventsError
                };
            }
            return state;
        case 'UPDATE_EVENT':
            let updatedEvent = action.data || {};
            let existingEventIndex = state.events.findIndex(e => e.eventId === updatedEvent.eventId);

            if (state.selectedFixture) {
                if (updatedEvent.eventId === state.selectedFixture.eventId) {
                    let newFixture = updatedEvent;
                    if (!updatedEvent.displayed) {
                        newFixture = null;
                    }
                    return {
                        ...state,
                        selectedFixture: newFixture
                    };
                }
                return state;
            } else {
                if (existingEventIndex === -1) { // Event does not exists in current array
                    if (updatedEvent.displayed && state.events.length < 10 && state.selectedCategory === updatedEvent.category && state.selectedSubcategory === updatedEvent.subCategory) {
                        return {
                            ...state,
                            events: [...state.events, updatedEvent],
                            fetchingEventsError: initialState.fetchingEventsError
                        };
                    }
                    return state;
                } else {
                    if (!updatedEvent.displayed) { // The event should not be displayed so remove it from the events array
                        return {
                            ...state,
                            events: state.events.filter(e => e.eventId !== updatedEvent.eventId),
                            fetchingEventsError: initialState.fetchingEventsError
                        };
                    }

                    return {
                        ...state,
                        events: state.events.map((e, i) => {
                            if (i === existingEventIndex) {
                                return {
                                    ...e,
                                    category: updatedEvent.category,
                                    subCategory: updatedEvent.subCategory,
                                    name: updatedEvent.name,
                                    startTime: updatedEvent.startTime,
                                    displayed: updatedEvent.displayed,
                                    suspended: updatedEvent.suspended
                                };
                            }
                            return e;
                        }),
                        fetchingEventsError: initialState.fetchingEventsError
                    };
                }
            }

            return state;
        case 'ADD_MARKET':
            let newMarket = action.data;
            let eventMarketIsIn = state.events.find(e => e.eventId === newMarket.eventId);

            if (state.selectedFixture) {
                if (newMarket.eventId === state.selectedFixture.eventId) {
                    return {
                        ...state,
                        selectedFixture: {
                            ...state.selectedFixture,
                            markets: [...state.selectedFixture.markets, newMarket]
                        },
                        fetchingEventsError: initialState.fetchingEventsError
                    };
                }
            } else if (eventMarketIsIn) {
                return {
                    ...state,
                    events: state.events.map(e => {
                        if (e.eventId === eventMarketIsIn.eventId) {
                            return {
                                ...e,
                                markets: [...e.markets, newMarket]
                            };
                        }
                        return e;
                    }),
                    fetchingEventsError: initialState.fetchingEventsError
                };
            }
            return state;
        case 'UPDATE_MARKET':
            let updatedMarket = action.data;
            let eventOfTheMarket = state.events.find(e => e.eventId === updatedMarket.eventId);

            if (state.selectedFixture) {
                let marketInFixture = state.selectedFixture.markets.find(m => m.marketId === updatedMarket.marketId);
                if (marketInFixture) {
                    return {
                        ...state,
                        selectedFixture: {
                            ...state.selectedFixture,
                            markets: state.selectedFixture.markets.map(m => {
                                if (m.marketId === marketInFixture.marketId) {
                                    return updatedMarket;
                                }
                                return m;
                            })
                        },
                        fetchingEventsError: initialState.fetchingEventsError
                    };
                }
            } else if (eventOfTheMarket) {
                let indexOfTheMarket = eventOfTheMarket.markets.findIndex(m => m.marketId === updatedMarket.marketId);
                if (!updatedMarket.displayed) {
                    return {
                        ...state,
                        events: state.events.map(e => {
                            if (e.eventId === eventOfTheMarket.eventId) {
                                return {
                                    ...e,
                                    markets: e.markets.filter(m => m.marketId !== updatedMarket.marketId)
                                };
                            }
                            return e;
                        }),
                        fetchingEventsError: initialState.fetchingEventsError
                    };
                }
                return {
                    ...state,
                    events: state.events.map(e => {
                        if (e.eventId === eventOfTheMarket.eventId) {
                            return {
                                ...e,
                                markets: e.markets.map((m, i) => {
                                    if (i === indexOfTheMarket) {
                                        return {
                                            ...m,
                                            name: updatedMarket.name,
                                            displayed: updatedMarket.displayed,
                                            suspended: updatedMarket.suspended
                                        };
                                    }
                                    return m;
                                })
                            };
                        }
                        return e;
                    }),
                    fetchingEventsError: initialState.fetchingEventsError
                };
            }
            return state;
        case 'ADD_OUTCOME':
            let newOutcome = action.data;

            if (state.selectedFixture) {
                let isOutcomeMarketInFixture = false;
                for (let i = 0; i < state.selectedFixture.markets.length; i++) {
                    let currentMarket = state.selectedFixture.markets[i];
                    if (currentMarket.marketId === newOutcome.marketId) {
                        isOutcomeMarketInFixture = true;
                        break;
                    }
                }
                if (isOutcomeMarketInFixture) {
                    return {
                        ...state,
                        selectedFixture: {
                            ...state.selectedFixture,
                            markets: state.selectedFixture.markets.map(m => {
                                if (m.marketId === newOutcome.marketId) {
                                    return {
                                        ...m,
                                        outcomes: [...m.outcomes, newOutcome]
                                    }
                                }
                                return m;
                            })
                        },
                        fetchingEventsError: initialState.fetchingEventsError
                    };
                }
            } else {
                for (let i = 0; i < state.events.length; i++) {
                    let currentEventMarkets = state.events[i].markets;
                    for (let k = 0; k < currentEventMarkets.length; k++) {
                        let currentMarket = currentEventMarkets[k];
                        if (currentMarket.marketId === newOutcome.marketId) {
                            return {
                                ...state,
                                events: state.events.map((e, eventIndex) => {
                                    if (eventIndex === state.events[i]) {
                                        return {
                                            ...e,
                                            markets: e.markets.map(m => {
                                                if (m.marketId === currentMarket.marketId) {
                                                    return {
                                                        ...m,
                                                        outcomes: [...m.outcomes, newOutcome]
                                                    }
                                                }
                                                return m;
                                            })
                                        };
                                    }
                                    return e;
                                }),
                                fetchingEventsError: initialState.fetchingEventsError
                            };
                        }
                    }
                }
                return state;
            }
            return state;
        case 'UPDATE_OUTCOME':
            let updatedOutcome = action.data;

            if (state.selectedFixture) {
                let isUpdatedOutcomeMarketInFixture = false;
                for (let i = 0; i < state.selectedFixture.markets.length; i++) {
                    let currentMarket = state.selectedFixture.markets[i];
                    if (currentMarket.marketId === updatedOutcome.marketId) {
                        isUpdatedOutcomeMarketInFixture = true;
                        break;
                    }
                }
                if (isUpdatedOutcomeMarketInFixture) {
                    return {
                        ...state,
                        selectedFixture: {
                            ...state.selectedFixture,
                            markets: state.selectedFixture.markets.map(m => {
                                if (m.marketId === updatedOutcome.marketId) {
                                    return {
                                        ...m,
                                        outcomes: m.outcomes.map(o => {
                                            if (o.outcomeId === updatedOutcome.outcomeId) {
                                                return {
                                                    ...o,
                                                    name: updatedOutcome.name,
                                                    price: updatedOutcome.price,
                                                    displayed: updatedOutcome.displayed,
                                                    suspended: updatedOutcome.suspended
                                                }
                                            }
                                            return o;
                                        })
                                    }
                                }
                                return m;
                            })
                        },
                        fetchingEventsError: initialState.fetchingEventsError
                    };
                }
            } else {
                for (let i = 0; i < state.events.length; i++) {
                    let currentEventMarkets = state.events[i].markets;
                    for (let k = 0; k < currentEventMarkets.length; k++) {
                        let currentMarket = currentEventMarkets[k];
                        if (currentMarket.marketId === updatedOutcome.marketId) {
                            return {
                                ...state,
                                events: state.events.map((e, eventIndex) => {
                                    if (eventIndex === state.events[i]) {
                                        return {
                                            ...e,
                                            markets: e.markets.map(m => {
                                                if (m.marketId === currentMarket.marketId) {
                                                    return {
                                                        ...m,
                                                        outcomes: m.outcomes.map(o => {
                                                            if (o.outcomeId === updatedOutcome.outcomeId) {
                                                                return {
                                                                    ...o,
                                                                    name: updatedOutcome.name,
                                                                    price: updatedOutcome.price,
                                                                    displayed: updatedOutcome.displayed,
                                                                    suspended: updatedOutcome.suspended
                                                                }
                                                            }
                                                            return o;
                                                        })
                                                    }
                                                }
                                                return m;
                                            })
                                        };
                                    }
                                    return e;
                                }),
                                fetchingEventsError: initialState.fetchingEventsError
                            };
                        }
                    }
                }
                return state;
            }
            return state;
            break;
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
