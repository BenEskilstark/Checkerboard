import { smartGet, smartSet, deepCopy } from '../utils/arraysAndObjects.js';
import { moveReducer } from './moveReducer.js';
import { getAllLegalMoves } from './selectors.js';

const evalFunc = ({ board, rules }) => {
    let score = 0;
    for (let coord in board) {
        const piece = board[coord];
        if (piece == null) continue;
        let delta = piece.isKing ? 4 : 1;
        if (piece.color == "red") delta *= -1;
        score += delta;
    }
    return score;
};


export const minimax = (state) => {
    if (!state.inMinimax) state.inMinimax = true;
    if (state.curAIDepth >= state.aiDepth) {
        state.curBestScore = evalFunc(state);
        return state;
    }

    const curColor = state.colors[state.turn % 2];
    const moves = getAllLegalMoves(state, curColor);
    const moveScores = [];
    let bestScore = curColor == "black" ? -Infinity : Infinity;
    let bestMove = null;
    for (let move of moves) {
        let nextState = moveReducer(deepCopy(state), move);
        nextState.curAIDepth++;
        nextState = minimax(nextState);
        moveScores.push({ ...move, score: nextState.curBestScore });
        if (curColor == "black") {
            if (nextState.curBestScore > bestScore ||
                (nextState.curBestScore == bestScore && Math.random() < 0.3)
            ) {
                bestScore = nextState.curBestScore;
                bestMove = move;
            }
        } else {
            if (nextState.curBestScore < bestScore ||
                (nextState.curBestScore == bestScore && Math.random() < 0.4)

            ) {
                bestScore = nextState.curBestScore;
                bestMove = move;
            }
        }
    }

    state.nextMoveScores = [...moveScores];
    state.curBestScore = bestScore;
    state.prevMove = bestMove;
    return state;
}