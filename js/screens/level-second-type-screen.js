import App from '../application';

class LevelSecondTypeScreen {
  init(gameModel) {
    this.answerHandler = (evt) => {
      evt.preventDefault();

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

export default new LevelSecondTypeScreen();
