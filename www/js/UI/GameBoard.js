import StatefulHTML from './StatefulHTML.js';
import { smartGet, smartSet } from '../utils/arraysAndObjects.js';


export default class GameBoard extends StatefulHTML {
  connectedCallback() {
    const width = parseInt(this.getAttribute("width"));
    const height = parseInt(this.getAttribute("height"));
    const rules = this.getAttribute("rules");
    this.dispatch({ width, height, rules: rules ?? this.getState().rules });
    this.dispatch({ type: "INIT_BOARD" });
    this.render(this.getState());

    if (!window.getState) {
      window.getState = this.getState;
      window.dispatch = this.dispatch;
    }
  }

  render(state) {
    const { width, height, board, mouse, legalMoves, rules } = state;

    const topbar = this.querySelector("#topbar");
    topbar.innerHTML = `
      <button onclick="closest('game-board').backToLobby()">
        Back
      </button>
      <button onclick="closest('game-board').reset()">
        Reset
      </button>
      <button onclick="closest('game-board').toggleShowLegalMoves()">
        Show/Hide Legal Moves
      </button>
      ${rules == "CHECKERS" ? `<button onclick="closest('game-board').aiMove()">
          AI Move
        </button>` : ""
      }
    `;

    const canvas = this.querySelector("canvas")
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const sqSize = canvas.width / width;

    ctx.fillStyle = "tan";
    ctx.fillRect(0, 0, canvas.width, canvas.height);

    // grid squares
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        if (x % 2 != y % 2) continue;
        ctx.fillStyle = "brown";
        ctx.fillRect(x * sqSize, y * sqSize, sqSize, sqSize);
        if ((state.prevMove?.toPos.x == x && state.prevMove?.toPos.y == y) ||
          (state.prevMove?.fromPos.x == x && state.prevMove?.fromPos.y == y)
        ) {
          ctx.lineWidth = 4;
          ctx.strokeStyle = "steelblue";
          ctx.strokeRect(x * sqSize, y * sqSize, sqSize, sqSize);
        }
      }
    }

    // pieces
    for (let x = 0; x < width; x++) {
      for (let y = 0; y < height; y++) {
        const piece = smartGet(board, { x, y });
        if (piece == null) continue;
        if (mouse.downPos?.x == x && mouse.downPos?.y == y) continue;

        ctx.fillStyle = piece.color;
        ctx.beginPath();
        ctx.arc(x * sqSize + sqSize / 2, y * sqSize + sqSize / 2, sqSize / 2 - 3, 0, Math.PI * 2);
        ctx.fill();

        if (piece.isKing) {
          ctx.strokeStyle = "gold";
          ctx.lineWidth = 5;
          ctx.beginPath();
          ctx.arc(x * sqSize + sqSize / 2, y * sqSize + sqSize / 2, sqSize / 2 - 3, 0, Math.PI * 2);
          ctx.stroke();
        }
      }
    }

    // legal moves
    if (state.showLegalMoves) {
      for (let move of legalMoves) {
        const { toPos } = move;
        const { x, y } = toPos;
        ctx.fillStyle = "yellow";
        ctx.beginPath();
        ctx.arc(x * sqSize + sqSize / 2, y * sqSize + sqSize / 2, sqSize / 12 - 3, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    if (mouse.piece != null) {
      ctx.fillStyle = mouse.piece.color;
      ctx.beginPath();
      ctx.arc(mouse.curPos.x, mouse.curPos.y, sqSize / 2 - 3, 0, Math.PI * 2);
      ctx.fill();
      if (mouse.piece.isKing) {
        ctx.strokeStyle = "gold";
        ctx.lineWidth = 5;
        ctx.beginPath();
        ctx.arc(mouse.curPos.x, mouse.curPos.y, sqSize / 2 - 3, 0, Math.PI * 2);
        ctx.stroke();
      }
    }
  }

  onChange(state) {
    this.render(state);
  }

  convertPixelToBoardSquare(ev) {
    const { width, height } = this.getState();
    const canvas = this.querySelector("canvas")
    if (!canvas) return;
    const sqWidth = canvas.getBoundingClientRect().width / width;
    const sqHeight = canvas.getBoundingClientRect().height / height;

    const x = Math.floor(ev.offsetX / sqWidth);
    const y = Math.floor(ev.offsetY / sqHeight);
    return { x, y }
  }

  /////////////////////////////////////////////////////////////////////////////
  // Mouse Handlers
  canvasMouseDown(ev) {
    const { x, y } = this.convertPixelToBoardSquare(ev);
    const { mouse, board, turn, colors } = this.getState();
    const piece = smartGet(board, { x, y });
    if (piece?.color != colors[turn % 2]) return;
    const curPos = { x: ev.offsetX, y: ev.offsetY };
    this.dispatch({ mouse: { ...mouse, piece, downPos: { x, y }, curPos } });
  }

  canvasMouseUp(ev) {
    const toPos = this.convertPixelToBoardSquare(ev);
    const { mouse } = this.getState();
    const fromPos = mouse.downPos;
    this.dispatch({ mouse: { ...mouse, downPos: null, curPos: null, piece: null } });
    this.dispatch({ type: 'MOVE_PIECE', fromPos, toPos });
  }

  canvasMouseMove(ev) {
    const { mouse } = this.getState();
    if (mouse.piece == null) return;
    const x = ev.offsetX;
    const y = ev.offsetY;

    this.dispatch({ mouse: { ...mouse, curPos: { x, y } } });
  }

  /////////////////////////////////////////////////////////////////////////////
  // TopBar Navigation
  backToLobby() {
    this.dispatch({ screen: "LOBBY" });
  }

  reset() {
    this.dispatch({ type: "INIT_BOARD" });
  }

  toggleShowLegalMoves() {
    this.dispatch({ showLegalMoves: !this.getState().showLegalMoves });
  }

  aiMove() {
    this.dispatch({ type: "DO_AI_MOVE" });
  }
}


