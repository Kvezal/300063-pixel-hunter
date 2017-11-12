import App from '../application';

class PlayerScreen {
  init() {
    this.buttonBackHandler = (evt) => {
      evt.preventDefault();
      App.showGreetingScreen();
    };
    return this;
  }
}

export default new PlayerScreen();
