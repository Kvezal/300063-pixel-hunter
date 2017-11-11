import AbstractView from './abstract-view';

class LevelSecondTypeView extends AbstractView {
  constructor(gameView) {
    super();

    this.answerHandler = gameView.secondLevelType.answerHandler;
  }

  get template() {
    return (
      `<p class="game__task">Угадай, фото или рисунок?</p>
      <form class="game__content  game__content--wide">
        <div class="game__option">
          <img src="http://placehold.it/705x455" alt="Option 1" width="705" height="455">
          <label class="game__answer  game__answer--photo">
            <input name="question1" type="radio" value="photo">
            <span>Фото</span>
          </label>
          <label class="game__answer  game__answer--wide  game__answer--paint">
            <input name="question1" type="radio" value="paint">
            <span>Рисунок</span>
          </label>
        </div>
      </form>`
    );
  }

  bind(element) {
    const radioButtons = element.querySelectorAll(`input[type='radio']`);
    [...radioButtons].forEach((radio) => {
      radio.onclick = (evt) => this.answerHandler(evt);
    });
  }
}

export default LevelSecondTypeView;
