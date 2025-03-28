// Have components that are children of <stateful-client> extend this
// class in order for them to get access to
// this.getState, this.dispatch, etc.
// Implement onChange(state) which fires whenever the state changes
// And call this.toServer(action) to dispatch to the server

export default class StatefulHTML extends HTMLElement {
  token = null;

  constructor() {
    super();
    this.registerState();
    this.token = this.subscribe(this.onChange.bind(this))
  }

  registerState() {
    const storeEvent = new CustomEvent('requestStore', {bubbles: true, detail: {}});
    this.dispatchEvent(storeEvent);
    Object.assign(this, storeEvent.detail);
  }

  disconnectedCallback() {
    this.unsubscribe(this.token);
  }

  onChange(state) {
    // override this
  }

  // call these
  // dispatchToServer(action) {
  //   dispatchToServer(this.getState().socket, action);
  // }

  // dispatchToServerAndSelf(action) {
  //   this.dispatch(action);
  //   dispatchToServer(this.getState().socket, action);
  // }

}
