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
    return this.state.level < GameParameters.NUMBER_QUESTIONS;
  }

  get currentLevel() {
    return Utils.getLevel(this.state.level, this.data);
  }
}

export default GameModel;
