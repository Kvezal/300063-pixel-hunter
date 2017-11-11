// import App from '../application';
import GameModel from '../models/game-model';
import GameView from '../views/game-view';
import Utils from '../lib/utils';
import firstLevelType from './level-first-type-screen';
import secondLevelType from './level-second-type-screen';
import thirdLevelType from './level-third-type-screen';

class GameScreen {
  constructor(gameData) {
    this.model = new GameModel(gameData);
  }

  init(state) {
    this.model.updateState(state);
    this.view = new GameView(this.model);

    this.view.firstLevelType = firstLevelType.init(this.model);
    this.view.secondLevelType = secondLevelType.init(this.model);
    this.view.thirdLevelType = thirdLevelType.init(this.model);

    Utils.displayScreen(this.view.element);
  }
}

export default GameScreen;
