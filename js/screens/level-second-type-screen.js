class LevelSecondTypeScreen {
  constructor() {

  }

  checkedForm(form) {
    const groupRadios = form.querySelectorAll(`input[type='radio']`);
    return [...groupRadios].some((radio) => radio.checked);
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

export default LevelSecondTypeScreen;
