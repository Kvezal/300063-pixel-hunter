import App from '../application';
import StatsView from '../views/stats-veiw';
import Utils from '../lib/utils';

class StatsScreen {
  constructor() {
    this.view = new StatsView();
  }

  init() {
    this.view.backButtonHandler = (evt) => {
      evt.preventDefault();
      App.showGreetingScreen();
    };

    Utils.displayScreen(this.view.element);
  }
}

export default new StatsScreen();
