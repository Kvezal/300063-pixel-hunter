class LevelFirstTypeScreen {
  init(gameView) {
    this.gameModel = gameView.model;
    this.state = this.gameModel.state;

    this.currentLevel = this.gameModel.currentLevel;

    this.answerHandler = (evt, form) => {
      evt.preventDefault();

      const gameOptions = form.querySelectorAll(`.game__option`);
      if (!LevelFirstTypeScreen.checkForm(gameOptions)) {
        return;
      }

      const answer = this.getAnswer(gameOptions);
      gameView.showNextScreen(answer);
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
    window.clearTimeout(this.state.timerId);

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
