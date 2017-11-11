import App from '../application';
import GreetingView from '../views/greeting-view';
import Utils from '../lib/utils';

class GreetingScreen {
  constructor() {
    this.view = new GreetingView();
  }

  init() {
    this.view.continueHandler = () => {
      App.showRulesScreen();
    };

    Utils.displayScreen(this.view.element);
  }
}

export default new GreetingScreen();
