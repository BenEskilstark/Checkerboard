
import { smartGet, smartSet, deepCopy } from '../utils/arraysAndObjects.js';
import { moveReducer } from './moveReducer.js';
import { getAllLegalMoves } from './selectors.js';
import { minimax } from './ai.js';

export const rootReducer = (state, action) => {
  if (state === undefined) state = initState();

  switch (action.type) {
    case 'INIT_BOARD': {
      const { rules, width, height, colors } = state;
      const board = {};
      switch (rules) {
        case "CHECKERS": {
          for (let r = 0; r < height / 2 - 1; r++) {
            for (let c = 0; c < width; c += 2) {
              smartSet(board,
                { x: c + r % 2, y: r },
                { x: c + r % 2, y: r, color: colors[0] },
              );
              smartSet(board,
                { x: c + (r + 1) % 2, y: height - r - 1 },
                { x: c + (r + 1) % 2, y: height - r - 1, color: colors[1] },
              );
            }
          }
          break;
        }
        case "FOX_AND_HOUNDS": {
          smartSet(board, { x: 0, y: 0 }, { x: 0, y: 0, color: colors[0], isKing: true });
          for (let c = 1; c < width; c += 2) {
            smartSet(board, { x: c, y: height - 1 }, { x: c, y: height - 1, color: colors[1] });
          }
          break;
        }
      }
      state = { ...state, turn: 0, board, };
      state.legalMoves = getAllLegalMoves(state, colors[state.turn % 2])
      state.inDoubleJump = null;
      state.prevMove = null;
      state.nextMoveScores = [];
      return state;
    }
    case 'TURN':
      return { ...state, turn: state.turn + 1 };
    case 'DO_AI_MOVE': {
      const aiState = minimax(deepCopy(state));
      return moveReducer(state, aiState.prevMove);
    }
    case 'MOVE_PIECE': {
      return moveReducer(state, action);
    }
    default:
      return state;
  }
};



export const initState = () => {
  return {
    screen: "LOBBY",
    rules: "CHECKERS", // | FOX_AND_HOUNDS
    turn: 0,
    colors: ["black", "red"],
    inDoubleJump: null, // or a piece
    legalMoves: [], // { fromPos: {x,y}, toPos: {x,y}, isJump: bool }
    showLegalMoves: false,
    width: 8, height: 8,
    board: {}, // smartMap<{x, y, color, isKing}>

    aiDepth: 5, // plies
    curAIDepth: 0,
    inMinimax: false,
    curBestScore: 0,
    prevMove: null,
    showNextMoveScores: false,
    nextMoveScores: [], // { fromPos, toPos, score }

    mouse: {
      piece: null,
      downPos: null,
      curPos: null,
      upPos: null,
    }
  };
}


