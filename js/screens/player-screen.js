import App from '../application';
import {GameParameters} from '../data/data';

class PlayerScreen {
  init(gameModel) {
    this.buttonBackHandler = (evt) => {
      window.clearTimeout(this.timerId);
      evt.preventDefault();
      App.showGreetingScreen();
    };

    if (!gameModel) {
      return this;
    }

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
