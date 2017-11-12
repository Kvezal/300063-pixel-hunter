import App from '../application';

class LevelFirstTypeScreen {
  init(gameModel) {
    this.answerHandler = (evt, form) => {
      evt.preventDefault();
      if (!this.checkedForm(form)) {
        return;
      }
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

  checkedForm(form) {
    const gameOptions = form.querySelectorAll(`.game__option`);
    return [...gameOptions].every((option) => {
      const groupRadios = option.querySelectorAll(`input[type='radio']`);
      return [...groupRadios].some((radio) => radio.checked);
    });
  }
}

export default new LevelFirstTypeScreen();
