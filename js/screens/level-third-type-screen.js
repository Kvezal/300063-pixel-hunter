class LevelThirdTypeScreen {
  constructor() {

  }

  answerHandler(evt, form) {
    evt.preventDefault();
    form.submit();
  }

  formHandler(evt) {
    evt.preventDefault();
  }
}

export default LevelThirdTypeScreen;
