class LevelSecondTypeScreen {
  init(gameView) {
    const gameModel = gameView.model;
    this.currentLevel = gameModel.currentLevel;

    this.answerHandler = (evt) => {
      evt.preventDefault();

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
