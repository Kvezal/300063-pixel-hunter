class LevelSecondTypeScreen {
  init(gameView) {
    const gameModel = gameView.model;
    const state = gameModel.state;

    this.currentLevel = gameModel.currentLevel;

    this.answerHandler = (evt) => {
      evt.preventDefault();
      window.clearTimeout(state.timerId);

      const answer = this.getAnswer(evt.currentTarget);
      gameView.showNextScreen(answer);
    };

    return this;
  }

  getAnswer(radio) {
    const imageType = this.currentLevel.image.type;
    return radio.value === imageType;
  }
}

export default new LevelSecondTypeScreen();
