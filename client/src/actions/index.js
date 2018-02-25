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

export function getEvents({ category, subCategory }) {
  try {
    fetch(`http://127.0.0.1:8787/api/events?category=${encodeURIComponent(category)}&subCategory=${encodeURIComponent(subCategory)}`, {
      method: 'GET'
    })
      .then(response => response.json())
      .then(response => {
        console.log(response);
        return {
          type: 'GET_EVENTS',
          response
        };
      });
  } catch (e) {
    return {
      type: 'GET_EVENTS'
    };
  }
}
