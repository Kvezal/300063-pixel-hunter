import AbstractView from './abstract-view';
import {initialState, GameParameters} from '../data/data';
import GameView from './game-view';

class PlayerView extends AbstractView {
  constructor(view) {
    super();

    this.view = view;
    this.buttonBackHandler = view.player.buttonBackHandler;
  }

  get template() {
    return (
      `<div class="header__back">
        <button class="back">
          <img src="img/arrow_left.svg" width="45" height="45" alt="Back">
          <img src="img/logo_small.svg" width="101" height="44">
        </button>
      </div>
      ${this.templateTimer}
      ${this.templateLives}`
    );
  }

  get templateTimer() {
    if (!(this.view instanceof GameView)) {
      return ``;
    }
    return `<h1 class="game__timer">NN</h1>`;
  }

  get templateLives() {
    if (!(this.view instanceof GameView)) {
      return ``;
    }

    const lives = [];
    for (let i = 0; i < initialState.lives - this.view.model.state.lives; i++) {
      lives.push(`<img src="img/heart__empty.svg" class="game__heart" alt="Life" width="32" height="32">`);
    }
    for (let j = 0; j < this.view.model.state.lives; j++) {
      lives.push(`<img src="img/heart__full.svg" class="game__heart" alt="Life" width="32" height="32">`);
    }

    return `<div class="game__lives">${lives.join(` `)}</div>`;
  }

  displayTimer() {
    if (this.state.time <= 5) {
      this.timer.classList.add(`game__timer--small-time`);
    }
    this.timer.textContent = this.state.time;
  }

  tick() {
    this.displayTimer();
    this.state.timerId = window.setTimeout(() => {
      --this.state.time;

      if (this.state.time > GameParameters.MIN_COUNT_TIME) {
        this.tick();
        return;
      }
      this.view.player.tick();

    }, GameParameters.AMOUNT_MILISECONDS_IN_SECONDS);
  }

  bind(element) {
    const buttonBack = element.querySelector(`.back`);
    buttonBack.onclick = (evt) => this.buttonBackHandler(evt);

    const timer = element.querySelector(`.game__timer`);
    if (timer) {
      this.timer = timer;
      this.state = this.view.model.state;
      this.tick();
    }
  }
}

export default PlayerView;
