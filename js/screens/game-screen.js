import App from '../application';
import GameModel from '../models/game-model';
import GameView from '../views/game-view';
import Utils from '../lib/utils';
import player from './player-screen';
import firstLevelType from './level-first-type-screen';
import secondLevelType from './level-second-type-screen';
import thirdLevelType from './level-third-type-screen';

class GameScreen {
  constructor(gameData, imagesBuffer) {
    this.model = new GameModel(gameData, imagesBuffer);
  }

  init(state) {
    this.model.updateState(state);
    this.view = new GameView(this.model);
    const time = new Date();

    this.view.showNextScreen = (answer) => {
      window.clearTimeout(this.view.model.state.timerId);

      if (!answer) {
        --state.lives;
      }
      this.model.addAnswer(answer, time);

      ++state.level;
      if (this.model.isCanPlay()) {
        App.showGameScreen(state);
        return;
      }
      App.showStatsScreen(state);
    };

    this.view.player = player.init(this.view);
    this.view.firstLevelType = firstLevelType.init(this.view);
    this.view.secondLevelType = secondLevelType.init(this.view);
    this.view.thirdLevelType = thirdLevelType.init(this.view);

    Utils.displayScreen(this.view.element);
  }
}

export default GameScreen;
