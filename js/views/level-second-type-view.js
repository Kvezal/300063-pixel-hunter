import AbstractView from './abstract-view';
import Utils from '../lib/utils';

const IMAGE_PARAMETERS = {
  WIDTH: 705,
  HEIGHT: 455
};

class LevelSecondTypeView extends AbstractView {
  constructor(gameView) {
    super();

    this.answerHandler = gameView.secondLevelType.answerHandler;
    this.imagesBuffer = gameView.model.imagesBuffer;
    this.currentLevel = gameView.model.data[gameView.model.state.level];
  }

  get template() {
    const imageParameters = Utils.getImageParameters(this.imagesBuffer,
        this.currentLevel.image.url);
    const newImageParameters = Utils.resize(imageParameters, IMAGE_PARAMETERS);

    return (
      `<p class="game__task">Угадай, фото или рисунок?</p>
      <form class="game__content  game__content--wide">
        <div class="game__option">
          <img src="${this.currentLevel.image.url}" alt="Option 1" width="${newImageParameters.width}" height="${newImageParameters.height}">
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
      radio.onclick = (evt) => this.answerHandler(evt, [...radioButtons]);
    });
  }
}

export default LevelSecondTypeView;
