import ResultView from '../views/result-veiw';
import Utils from '../lib/utils';
import player from './player-screen';

class ResultScreen {
  init(state) {
    const view = new ResultView();

    view.player = player.init();
    view.state = state;

    Utils.displayScreen(view.element);
  }
}

export default new ResultScreen();
