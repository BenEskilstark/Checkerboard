import { getAllLegalJumps, getAllLegalMoves, isLegalMove } from "./selectors.js";
import { smartGet, smartSet, deepCopy } from '../utils/arraysAndObjects.js';
import { minimax } from './ai.js';

export const moveReducer = (state, action) => {
    const { fromPos, toPos } = action;
    const { board, colors, height, rules } = state;
    const piece = smartGet(board, fromPos);

    const { isLegal, isJump, jumpPos } = isLegalMove(state, piece, toPos);
    if (!isLegal) return state;

    smartSet(board, fromPos, null);
    const movedPiece = { ...piece, ...toPos };
    smartSet(board, toPos, movedPiece);
    if (isJump) {
        smartSet(board, jumpPos, null);
        // now check for additional jumps from this piece
        state.inDoubleJump = movedPiece;
        const jumps = getAllLegalJumps(state, piece.color);
        if (!jumps.some(j => j.fromPos.x == movedPiece.x && j.fromPos.y == movedPiece.y)) {
            state.turn++;
            state.inDoubleJump = null;
        }
    } else {
        state.inDoubleJump = null;
        state.turn++;
    }

    if (rules == "CHECKERS") {
        if (movedPiece.color == "black" && movedPiece.y == height - 1) {
            movedPiece.isKing = true;
        }
        if (movedPiece.color == "red" && movedPiece.y == 0) {
            movedPiece.isKing = true;
        }
    }

    state.legalMoves = getAllLegalMoves(state, colors[state.turn % 2]);
    if (!state.inMinimax && state.showNextMoveScores) {
        state.nextMoveScores = minimax(deepCopy(state)).nextMoveScores;
    }
    state.prevMove = deepCopy(action);
    return state;
}