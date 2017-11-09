import AbstractView from './abstract-view';

class LevelFirstTypeView extends AbstractView {
  constructor() {
    super();
  }

  get template() {
    return (
      `<p class="game__task">Угадайте для каждого изображения фото или рисунок?</p>
      <form class="game__content">
        <div class="game__option">
          <img src="http://placehold.it/468x458" alt="Option 1" width="468" height="458">
          <label class="game__answer game__answer--photo">
            <input name="question1" type="radio" value="photo">
            <span>Фото</span>
          </label>
          <label class="game__answer game__answer--paint">
            <input name="question1" type="radio" value="paint">
            <span>Рисунок</span>
          </label>
        </div>
        <div class="game__option">
          <img src="http://placehold.it/468x458" alt="Option 2" width="468" height="458">
          <label class="game__answer  game__answer--photo">
            <input name="question2" type="radio" value="photo">
            <span>Фото</span>
          </label>
          <label class="game__answer  game__answer--paint">
            <input name="question2" type="radio" value="paint">
            <span>Рисунок</span>
          </label>
        </div>
      </form>`
    );
  }

  bind(element) {
    const form = element.querySelector(`.game__content`);
    form.onsubmit = (evt) => this.formHandler(evt);

    const radioButtons = form.querySelectorAll(`input[type='radio']`);
    radioButtons.onclick = (evt) => this.answerHandler(evt, form);
  }
}

export default LevelFirstTypeView;
