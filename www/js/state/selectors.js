import { smartGet } from '../utils/arraysAndObjects.js';

export const getNeighbors = (piece) => {
    const blackMoves = [{ x: -1, y: 1 }, { x: 1, y: 1 }]
        .map(p => ({ x: p.x + piece.x, y: p.y + piece.y }));
    const redMoves = [{ x: -1, y: -1 }, { x: 1, y: - 1 }]
        .map(p => ({ x: p.x + piece.x, y: p.y + piece.y }));
    if (piece.isKing) {
        return [...blackMoves, ...redMoves];
    }
    return piece.color == "black" ? blackMoves : redMoves;
}


export const getJumpNeighbors = ({ board }, piece) => {
    const otherColor = piece.color == "red" ? "black" : "red";
    const blackMoves = [{ x: -1, y: 1 }, { x: 1, y: 1 }]
        .map(p => ({ x: p.x + piece.x, y: p.y + piece.y }))
        .filter(m => smartGet(board, m)?.color == otherColor);
    const redMoves = [{ x: -1, y: -1 }, { x: 1, y: -1 }]
        .map(p => ({ x: p.x + piece.x, y: p.y + piece.y }))
        .filter(m => smartGet(board, m)?.color == otherColor);
    if (piece.isKing) {
        return [...blackMoves, ...redMoves];
    }
    return piece.color == "black" ? blackMoves : redMoves;
}


export const isLegalMove = (state, piece, { x, y }) => {
    const { width, height, board, colors, turn, rules, inDoubleJump } = state;
    if (piece == null) return { isLegal: false };

    if (piece.color != colors[turn % 2]) return { isLegal: false };

    if (x < 0 || x >= width || y < 0 || y >= height) return { isLegal: false };

    if (smartGet(board, { x, y }) != null) return { isLegal: false };

    if (inDoubleJump && (inDoubleJump.x != piece.x || inDoubleJump.y != piece.y)) {
        return false;
    }

    // check for jumps
    if (rules == "CHECKERS") {
        const diff = { x: (x - piece.x) / 2 + piece.x, y: (y - piece.y) / 2 + piece.y }
        const jumpPos = getJumpNeighbors(state, piece)
            .filter(n => n.x == diff.x && n.y == diff.y)[0];
        if (jumpPos) {
            return { isLegal: true, isJump: true, jumpPos };
        }
    }

    if (state.legalMoves[0]?.isJump) return false; // must jump

    if (state.inDoubleJump) return false; // must jump

    // check for moves
    const neighbors = getNeighbors(piece);
    if (!neighbors.some(n => n.x == x && n.y == y)) return { isLegal: false };

    return { isLegal: true };
}


export const getAllLegalMoves = (state, color) => {
    const { width, height, board, rules } = state;
    let allRegularMoves = [];
    let allJumpMoves = [];
    for (let x = 0; x < width; x++) {
        for (let y = 0; y < height; y++) {
            const piece = smartGet(board, { x, y });
            if (piece?.color != color) continue;

            if (rules == "CHECKERS") {
                const blackJumpMoves = [{ x: -2, y: 2 }, { x: 2, y: 2 }]
                    .map(p => ({ x: p.x + piece.x, y: p.y + piece.y }));
                const redJumpMoves = [{ x: -2, y: -2 }, { x: 2, y: -2 }]
                    .map(p => ({ x: p.x + piece.x, y: p.y + piece.y }));
                let jumpMoves = color == "black" ? blackJumpMoves : redJumpMoves;
                if (piece.isKing) jumpMoves = [...blackJumpMoves, ...redJumpMoves];
                jumpMoves = jumpMoves
                    .filter(move => isLegalMove(state, piece, move).isLegal)
                    .map(move => {
                        return {
                            fromPos: { x: piece.x, y: piece.y },
                            toPos: { x: move.x, y: move.y },
                            isJump: true,
                        };
                    });
                if (jumpMoves.length > 0) {
                    allJumpMoves = [...allJumpMoves, ...jumpMoves];
                }
            }
            const possibleMoves = getNeighbors(piece)
                .filter(move => isLegalMove(state, piece, move).isLegal)
                .map(move => {
                    return {
                        fromPos: { x: piece.x, y: piece.y },
                        toPos: { x: move.x, y: move.y },
                    };
                });
            allRegularMoves = [...allRegularMoves, ...possibleMoves];
        }
    }

    return allJumpMoves.length > 0 ? allJumpMoves : allRegularMoves;
}


export const getAllLegalJumps = (state, color) => {
    const jumps = getAllLegalMoves(state, color)
        .filter(m => m.isJump);
    return jumps;
}

window.getAllLegalJumps = getAllLegalJumps;
window.getAllLegalMoves = getAllLegalMoves;