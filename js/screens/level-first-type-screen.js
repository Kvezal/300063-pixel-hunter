class LevelFirstTypeScreen {
  constructor(gameView) {
    super();

    this.answerHandler = gameView.firstTypeLevel.answerHandler;
  }

  checkedForm(form) {
    const gameOptions = form.querySelectorAll(`.game__option`);
    [...gameOptions].every((option) => {
      const groupRadios = option.querySelectorAll(`input[type='radio']`);
      return [...groupRadios].some((radio) => radio.checked);
    });
  }

  answerHandler(evt, form) {
    evt.preventDefault();
    if (!this.checkedForm(form)) {
      form.submit();
    }
  }

  formHandler(evt) {
    evt.preventDefault();
  }
}

export default LevelFirstTypeScreen;
