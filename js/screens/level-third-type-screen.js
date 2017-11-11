import App from '../application';

class LevelThirdTypeScreen {
  init(gameModel) {
    this.answerHandler = (evt) => {
      ++gameModel.state.level;
      if (gameModel.isCanPlay()) {
        App.showGameScreen(gameModel.state);
        return;
      }
      App.showStatsScreen();
    };

    return this;
  }
}

export default new LevelThirdTypeScreen();
