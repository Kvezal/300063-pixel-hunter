import App from '../application';
import {GameParameters} from '../data/data';

class PlayerScreen {
  init(gameView) {
    this.buttonBackHandler = (evt) => {
      evt.preventDefault();
      App.showGreetingScreen();
      if (gameView) {
        window.clearTimeout(gameModel.state.timerId);
      }
    };

    if (!gameView) {
      return this;
    }

    const gameModel = gameView.model;

    this.tick = () => {
      if (gameModel.state.time > GameParameters.MIN_COUNT_TIME) {
        return;
      }
      --gameModel.state.lives;
      ++gameModel.state.level;
      gameModel.addAnswer(false);

      if (!gameModel.isCanPlay()) {
        App.showStatsScreen(gameModel.state);
        return;
      }
      App.showGameScreen(gameModel.state);
    };

    return this;
  }
}

export default new PlayerScreen();
