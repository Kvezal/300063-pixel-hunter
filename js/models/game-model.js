import Utils from '../lib/utils';
import {GameParameters} from '../data/data';

class GameModel {
  constructor(data) {
    this.data = data;
  }

  updateState(newState) {
    this.state = newState;
  }

  isCanPlay() {
    return (
      (this.state.level < GameParameters.NUMBER_QUESTIONS) &&
      (this.state.answers.length < GameParameters.NUMBER_ANSWERS) &&
      (this.state.lives > GameParameters.MIN_COUNT_LIVES)
    );
  }

  get currentLevel() {
    return Utils.getLevel(this.state.level, this.data);
  }

  addAnswer(answer, time) {
    time = (new Date() - time) / GameParameters.AMOUNT_MILISECONDS_IN_SECONDS;
    this.state.answers.push({answer, time});
  }
}

export default GameModel;
