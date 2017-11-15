import Utils from '../lib/utils';
import {initialState, GameParameters} from '../data/data';

const timeAnswers = {
  FAST: 10,
  SLOW: 20
};

class GameModel {
  constructor(data, imagesBuffer) {
    this.data = data;
    this.imagesBuffer = imagesBuffer;
  }

  updateState(newState) {
    this.state = newState;
    this.resetTimer();
  }

  resetTimer() {
    this.state.time = initialState.time;
  }

  isCanPlay() {
    return (
      (this.state.level < GameParameters.NUMBER_ANSWERS) &&
      (this.state.answers.length < GameParameters.NUMBER_ANSWERS) &&
      (this.state.lives > GameParameters.MIN_COUNT_LIVES)
    );
  }

  get currentLevel() {
    return Utils.getLevel(this.state.level, this.data);
  }

  static getTypeAnswer(answer, time) {
    if (!answer) {
      return `wrong`;
    }
    if (time < timeAnswers.FAST) {
      return `fast`;
    }
    if (time >= timeAnswers.FAST && time < timeAnswers.SLOW) {
      return `correct`;
    }
    if (time >= timeAnswers.SLOW && time < initialState.time) {
      return `slow`;
    }
    return `wrong`;
  }

  addAnswer(answer, time) {
    time = (new Date() - time) / GameParameters.AMOUNT_MILISECONDS_IN_SECONDS;
    const type = GameModel.getTypeAnswer(answer, time);
    this.state.answers.push(type);
  }
}

export default GameModel;
