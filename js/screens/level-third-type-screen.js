import App from '../application';

class LevelThirdTypeScreen {
  init(gameModel) {
    this.answerHandler = (evt) => {
      console.log(evt.currentTarget);
      ++gameModel.state.level;
      if (gameModel.isCanPlay()) {
        gameModel.state.lives--;
        App.showGameScreen(gameModel.state);
        return;
      }
      App.showStatsScreen();
    };

    return this;
  }
}

export default new LevelThirdTypeScreen();
