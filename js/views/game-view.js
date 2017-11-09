import AbstractView from './abstract-view';
import LevelFirstTypeView from './level-first-type-view';
import LevelSecondTypeView from './level-second-type-view';
import LevelThirdTypeView from './level-third-type-view';
import Utils from '../lib/utils';

const TypeOfLevels = {
  FIRST: `first`,
  SECOND: `second`,
  THIRD: `third`
};

/*const TypeOfLevels = {
  FIRST: `two-of-two`,
  SECOND: `tinder-like`,
  THIRD: `one-of-three`
};*/

const routesLevel = {
  [TypeOfLevels.FIRST]: LevelFirstTypeView,
  [TypeOfLevels.SECOND]: LevelSecondTypeView,
  [TypeOfLevels.THIRD]: LevelThirdTypeView
};

class GameView extends AbstractView {
  constructor(model) {
    super();
    this.model = model;
  }

  get template() {
    return (
      `<header class="header">
        <div class="header__back">
          <button class="back">
            <img src="img/arrow_left.svg" width="45" height="45" alt="Back">
            <img src="img/logo_small.svg" width="101" height="44">
          </button>
        </div>
        <h1 class="game__timer">NN</h1>
        <div class="game__lives">
          <img src="img/heart__empty.svg" class="game__heart" alt="Life" width="32" height="32">
          <img src="img/heart__full.svg" class="game__heart" alt="Life" width="32" height="32">
          <img src="img/heart__full.svg" class="game__heart" alt="Life" width="32" height="32">
        </div>
      </header>
      <div class="game">
        <div class="stats">
          <ul class="stats">
            <li class="stats__result stats__result--wrong"></li>
            <li class="stats__result stats__result--slow"></li>
            <li class="stats__result stats__result--fast"></li>
            <li class="stats__result stats__result--correct"></li>
            <li class="stats__result stats__result--wrong"></li>
            <li class="stats__result stats__result--unknown"></li>
            <li class="stats__result stats__result--slow"></li>
            <li class="stats__result stats__result--unknown"></li>
            <li class="stats__result stats__result--fast"></li>
            <li class="stats__result stats__result--unknown"></li>
          </ul>
        </div>
      </div>`
    );
  }

  bind(element) {
    this.levelContainer = element.querySelector(`.game`);
    this.updateLevel();
  }

  updateLevel() {
    const currentTypeLevel = this.model.currentLevel.type;
    const level = new routesLevel[currentTypeLevel](this).element;
    Utils.displayElement(level, this.levelContainer);
  }
}

export default GameView;
