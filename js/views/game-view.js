import AbstractView from './abstract-view';
import LevelFirstTypeView from './level-first-type-view';
import LevelSecondTypeView from './level-second-type-view';
import LevelThirdTypeView from './level-third-type-view';
import Utils from '../lib/utils';
import displayHeader from '../lib/display-header';

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
      `<header class="header"></header>
      <div class="game">
        <div class="stats">
          ${Utils.getStats(this.model.state.answers)}
        </div>
      </div>`
    );
  }

  bind(element) {
    this.header = element.querySelector(`.header`);
    displayHeader(this);

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
