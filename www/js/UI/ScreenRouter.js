import StatefulHTML from './StatefulHTML.js';

export default class ScreenRouter extends StatefulHTML {
  screen = null;

  connectedCallback() {
    this.screen = this.getAttribute("initial");
    this.setDisplay(this.screen);
  }

  onChange(state) {
    if (this.screen == state.screen) return;

    this.screen = state.screen;
    this.setDisplay(this.screen);
  }

  setDisplay(screen) {
    for (const child of this.children) {
      if (child.getAttribute("screen") == screen) {
        child.style.display = child.getAttribute("display");
      } else {
        child.style.display = "none";
      }
    }
  }

}


