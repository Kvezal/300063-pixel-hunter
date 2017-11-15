import AbstractView from './abstract-view';
import Utils from '../lib/utils';

const IMAGE_PARAMETERS = {
  WIDTH: 468,
  HEIGHT: 458
};

class LevelFirstTypeView extends AbstractView {
  constructor(gameView) {
    super();

    this.answerHandler = gameView.firstLevelType.answerHandler;
    this.imagesBuffer = gameView.model.imagesBuffer;
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
    const imageParameters = Utils.getImageParameters(this.imagesBuffer, url);
    const newImageParameters = Utils.resize(imageParameters, IMAGE_PARAMETERS);

    return (
      `<div class="game__option">
        <img src="${url}" alt="Option ${index + 1}" width="${newImageParameters.width}" height="${newImageParameters.height}">
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
    return this.currentLevel.images.map((item, index) => {
      return this.templateOption(item.url, index);
    }).join(` `);
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
