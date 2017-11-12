import StatsView from '../views/stats-veiw';
import Utils from '../lib/utils';
import player from './player-screen';

class StatsScreen {
  constructor() {
    this.view = new StatsView();
  }

  init() {
    this.view.player = player.init();

    Utils.displayScreen(this.view.element);
  }
}

export default new StatsScreen();
