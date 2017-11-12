import App from '../application';

class LevelThirdTypeScreen {
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
        gameModel.state.lives--;
        App.showGameScreen(gameModel.state);
        return;
      }
      App.showStatsScreen();
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
