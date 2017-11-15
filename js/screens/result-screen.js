import ResultView from '../views/result-veiw';
import Utils from '../lib/utils';
import player from './player-screen';

class ResultScreen {
  init(state) {
    const view = new ResultView(state);
    view.player = player.init();

    Utils.displayScreen(view.element);
  }
}

export default new ResultScreen();
