import { combineReducers } from 'redux';
import eventsReducer from './events';
 
const eventsApp = combineReducers({
    eventsReducer
});
 
export default eventsApp;