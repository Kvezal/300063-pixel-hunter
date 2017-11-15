import AbstractView from './abstract-view';
import Utils from '../lib/utils';

const IMAGE_PARAMETERS = {
  WIDTH: 304,
  HEIGHT: 455
};

class LevelThirdTypeView extends AbstractView {
  constructor(gameView) {
    super();

    this.answerHandler = gameView.thirdLevelType.answerHandler;
    this.imagesBuffer = gameView.model.imagesBuffer;
    this.currentLevel = gameView.model.data[gameView.model.state.level];
  }

  get template() {
    return (
      `<p class="game__task">${this.currentLevel.question}</p>
      <form class="game__content  game__content--triple">
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
      </div>`
    );
  }

  get templateGameOptions() {
    return this.currentLevel.images.map((item, index) => {
      return this.templateOption(item.url, index);
    }).join(` `);
  }

  bind(element) {
    const options = element.querySelectorAll(`.game__option`);
    [...options].forEach((option) => {
      option.onclick = (evt) => this.answerHandler(evt);
    });
  }
}

export default LevelThirdTypeView;
