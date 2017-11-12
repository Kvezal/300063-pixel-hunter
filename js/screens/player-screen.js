import App from '../application';

class PlayerScreen {
  init() {
    this.buttonBackHandler = (evt) => {
      window.clearTimeout(this.timerId);
      evt.preventDefault();
      App.showGreetingScreen();
    };
    return this;
  }
}

export default new PlayerScreen();
