import App from '../application';
import RulesView from '../views/rules-view';
import Utils from '../lib/utils';
import {initialState} from '../data/data';
import player from './player-screen';

const AMOUNT_SIMBOLS = 2;

class RulesScreen {
  constructor() {
    this.view = new RulesView();
  }

  init() {
    this.view.ckeckedInput = (evt) => {
      evt.preventDefault();
      const value = evt.currentTarget.value;

      const form = evt.currentTarget.parentElement;
      const rulesButton = form.querySelector(`.rules__button`);
      rulesButton.disabled = true;

      if (!this.checkInput(value)) {
        return;
      }
      this.value = value;
      rulesButton.disabled = false;
    };

    this.view.formSubmitHandler = (evt) => {
      evt.preventDefault();

      const state = Object.assign({}, initialState);
      state.answers = [];
      state.name = this.value;

      App.showGameScreen(state);
    };

    this.view.player = player.init();

    Utils.displayScreen(this.view.element);
  }

  checkInput(value) {
    const checkedSimbols = /[{}*<>,.?!@#$:;%^&'"\\|/\s]/;
    const resultCheckSimbols = !checkedSimbols.test(value);

    return (
      value.length >= AMOUNT_SIMBOLS &&
      resultCheckSimbols
    );
  }
}

export default new RulesScreen();
