import AbstractView from './abstract-view';

class LevelThirdTypeView extends AbstractView {
  constructor(gameView) {
    super();

    this.answerHandler = gameView.thirdLevelType.answerHandler;
    this.currentLevel = gameView.model.data[gameView.model.state.level];
  }

  get template() {
    return (
      `<p class="game__task">Найдите рисунок среди изображений</p>
      <form class="game__content  game__content--triple">
        ${this.templateGameOptions}
      </form>`
    );
  }

  templateOption(url, index) {
    return (
      `<div class="game__option">
        <img src="${url}" alt="Option ${index + 1}" width="304" height="455">
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
    const options = element.querySelectorAll(`.game__option`);
    [...options].forEach((option) => {
      option.onclick = (evt) => this.answerHandler(evt);
    });
  }
}

export default LevelThirdTypeView;
