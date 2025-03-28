import StatefulHTML from './StatefulHTML.js';

const lobbyStyle = `
    display: flex; 
    flex-direction: column; 
    align-items: center;
    gap: 10px;
`;

export default class Lobby extends StatefulHTML {
    connectedCallback() {
        this.render();
    }

    render() {
        this.innerHTML = `
            <div style="${lobbyStyle}">
                <h3>Choose a Checkerboard Game:</h3>
                <button onclick="closest('game-lobby').playCheckers()">
                    Checkers
                </button>
                <button onclick="closest('game-lobby').playFoxAndHounds()">
                    Fox and Hounds
                </button>
            </div>
        `;
    }

    playCheckers() {
        this.dispatch({ screen: "GAME", rules: "CHECKERS" });
        this.dispatch({ type: "INIT_BOARD" });
    }

    playFoxAndHounds() {
        this.dispatch({ screen: "GAME", rules: "FOX_AND_HOUNDS" });
        this.dispatch({ type: "INIT_BOARD" });
    }
}