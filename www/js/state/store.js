import {rootReducer, initState} from './rootReducer.js';

// sorta like react's useReducer hook but with convenient handling
// for dispatching actions with no type. And giving sub/unsub functionality
// returns as an array so that you can easily pattern match into your own names
// if you want to use multiple independent reducers in your application
// Though note that the canonical getState, dispatch, etc exported here is a singleton
// meant for top-level application state.
export const useReducer = (reducer, state) => {
  if (state === undefined) state = {};
  const subscriptions = {};
  let token = 0;
  return [
    // getState:
    () => state,

    // dispatch:
    (action) => {
      // special case merge of action into state if action has no type:
      if (action.type == undefined) {
        state = {...state, ...action}
      } else { // else use the reducer like normal
        state = rootReducer(state, action);
      }

      // then call all your subscriber's callbacks
      for (const t in subscriptions) {
        subscriptions[t](state);
      }
    },

    // subscribe:
    (callback) => {
      subscriptions[token++] = callback;
      return token - 1;
     },

    // unsubscribe:
    (token) => delete subscriptions[token], // unsubscribe
  ];
}

// creating and exporting a singleton of getState and dispatch s.t.
// these functions can be imported anywhere and always share the same
// state
const [getState, dispatch, subscribe, unsubscribe] = useReducer(rootReducer, initState());
export {getState, dispatch, subscribe, unsubscribe};
