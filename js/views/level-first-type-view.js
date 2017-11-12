import AbstractView from './abstract-view';

class LevelFirstTypeView extends AbstractView {
  constructor(gameView) {
    super();

    this.answerHandler = gameView.firstLevelType.answerHandler;
    this.currentLevel = gameView.model.data[gameView.model.state.level];
  }

  get template() {
    return (
      `<p class="game__task">${this.currentLevel.question}</p>
      <form class="game__content">
        ${this.templateGameOptions}
      </form>`
    );
  }

  templateOption(url, index) {
    return (
      `<div class="game__option">
        <img src="${url}" alt="Option ${index + 1}" width="468" height="458">
        <label class="game__answer game__answer--photo">
          <input name="question${index + 1}" type="radio" value="photo">
          <span>Фото</span>
        </label>
        <label class="game__answer game__answer--paint">
          <input name="question${index + 1}" type="radio" value="paint">
          <span>Рисунок</span>
        </label>
      </div>`
    );
  }

  get templateGameOptions() {
    const options = [];
    this.currentLevel.images.forEach((item, index) => {
      options.push(this.templateOption(item.url, index));
    });
    return options.join(` `);
  }

  bind(element) {
    const form = element.querySelector(`.game__content`);

    const radioButtons = form.querySelectorAll(`input[type='radio']`);
    [...radioButtons].forEach((radio) => {
      radio.onchange = (evt) => this.answerHandler(evt, form);
    });
  }
}

export default LevelFirstTypeView;
