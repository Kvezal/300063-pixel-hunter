import App from '../application';

class LevelFirstTypeScreen {
  init(gameModel) {
    this.currentLevel = gameModel.currentLevel;
    const time = new Date();

    this.answerHandler = (evt, form) => {
      evt.preventDefault();
      window.clearTimeout(gameModel.state.timerId);

      const gameOptions = form.querySelectorAll(`.game__option`);
      if (!LevelFirstTypeScreen.checkForm(gameOptions)) {
        return;
      }

      const answer = this.getAnswer(gameOptions);
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

  static checkForm(gameOptions) {
    return [...gameOptions].every((option) => {
      const groupRadios = option.querySelectorAll(`input[type='radio']`);
      return [...groupRadios].some((radio) => radio.checked);
    });
  }

  getAnswer(gameOptions) {
    return [...gameOptions].every((option, index) => {
      const imageType = this.currentLevel.images[index].type;
      const groupRadios = option.querySelectorAll(`input[type='radio']`);

      return [...groupRadios].some((radio) => {
        if (radio.checked) {
          return radio.value === imageType;
        }
        return false;
      });
    });
  }
}

export default new LevelFirstTypeScreen();
