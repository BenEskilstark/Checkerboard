
export const rootReducer = (state, action) => {
  if (state === undefined) state = initState();

  switch (action.type) {
    case 'TURN':
      return {...state, turn: state.turn + 1};
    case 'PLACE_PIECE': {
      const {x, y, color} = action;
      state.pieces = [...state.pieces, {color, x, y}];
      return state;
    }
    default:
      return state;
  }
};

export const initState = () => {
  return {
    turn: 0,
    color: 'black',
    pieces: [],
  };
}


