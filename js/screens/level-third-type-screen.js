class LevelThirdTypeScreen {
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

  getAnswer(target) {
    const imageSrc = target.querySelector(`img`).src;
    const selectedImage = this.currentLevel.images.find((image) => {
      return image.url === imageSrc;
    });
    return selectedImage.type === this.currentLevel.answer;
  }
}

export default new LevelThirdTypeScreen();
