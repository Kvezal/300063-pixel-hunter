import App from '../application';

class LevelSecondTypeScreen {
  init(gameModel) {
    this.currentLevel = gameModel.currentLevel;
    const time = new Date();

    this.answerHandler = (evt) => {
      evt.preventDefault();
      window.clearTimeout(gameModel.state.timerId);

      const answer = this.getAnswer(evt.currentTarget);
      if (!answer) {
        gameModel.state.lives--;
      }
      gameModel.addAnswer(answer, time);

      ++gameModel.state.level;
      if (gameModel.isCanPlay()) {
        App.showGameScreen(gameModel.state);
        return;
      }
      App.showStatsScreen();
    };

    return this;
  }

  getAnswer(radio) {
    const imageType = this.currentLevel.image.type;
    return radio.value === imageType;
  }
}

export default new LevelSecondTypeScreen();
