import StatefulHTML from './StatefulHTML.js';


export default class GameBoard extends StatefulHTML {
  connectedCallback() {
    const width = parseInt(this.getAttribute("width"));
    const height = parseInt(this.getAttribute("height"));
    this.dispatch({width, height});
    this.render(this.getState());
  }

  render(state) {
    const {width, height} = state;

    const canvas = this.querySelector("canvas")
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    const sqSize = canvas.width / width;

    ctx.fillStyle="tan";
    ctx.fillRect(0,0,canvas.width,canvas.height);

    // grid lines
    ctx.beginPath();
    for (let x = 0; x <= width; x++) {
      ctx.strokeStyle = "black";
      ctx.moveTo(x * sqSize, 0);
      ctx.lineTo(x * sqSize, canvas.height);
    }
    ctx.stroke();
    ctx.beginPath();
    for (let y = 0; y <= height; y++) {
      ctx.strokeStyle = "black";
      ctx.moveTo(0, y * sqSize);
      ctx.lineTo(canvas.width, y * sqSize);
    }
    ctx.stroke();

    // little grid helper circles
    for (let x = Math.round(width / 3 / 2); x < width; x += Math.round(width/3)) {
      for (let y = Math.round(height / 3 / 2); y < height; y += Math.round(height/3)) {
        ctx.fillStyle = "black";
        ctx.beginPath();
        ctx.arc(x * sqSize, y * sqSize, sqSize / 6, 0, Math.PI * 2);
        ctx.fill();
      }
    }

    for (const piece of state.pieces) {
      const {x, y, color} = piece;
      ctx.fillStyle = color;
      ctx.beginPath();
      ctx.arc(x * sqSize, y * sqSize, sqSize / 2 - 3, 0, Math.PI * 2);
      ctx.fill();
    }
  }

  onChange(state) {
    this.render(state);
  }

  canvasClick(ev) {
    const {width, height, color} = this.getState();
    const canvas = this.querySelector("canvas")
    if (!canvas) return;
    const sqSize = canvas.getBoundingClientRect().width / width;

    const x = Math.round(ev.offsetX / sqSize);
    const y = Math.round(ev.offsetY / sqSize);
    this.dispatch({type: 'PLACE_PIECE', x, y, color});
  }
}


