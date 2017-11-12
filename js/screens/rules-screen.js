import App from '../application';
import RulesView from '../views/rules-view';
import Utils from '../lib/utils';
import {initialState} from '../data/data';
import player from './player-screen';

class RulesScreen {
  constructor() {
    this.view = new RulesView();
  }

  init() {
    this.view.startHandler = () => {
      const state = Object.assign({}, initialState);
      state.answers = [];
      App.showGameScreen(state);
    };

    this.view.formSubmitHandler = (evt) => {
      evt.preventDefault();
    };

    this.view.player = player.init();

    Utils.displayScreen(this.view.element);
  }
}

export default new RulesScreen();
