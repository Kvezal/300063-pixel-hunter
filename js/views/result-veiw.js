import AbstractView from './abstract-view';
import displayHeader from '../lib/display-header';
import Utils from '../lib/utils';
import {GameParameters} from '../data/data';

const amountPoints = {
  CORRECT_ANSWER: 100,
  BONUS_FOR_FAST_ANSWER: 50,
  BONUS_FOR_SLOW_ANSWER: -50,
  BONUS_FOR_LIVES_LEFT: 50
};

class ResultView extends AbstractView {
  constructor() {
    super();
  }

  get template() {
    return (
      `<header class="header"></header>
      <div class="result">
        ${this.templateHeader(this.state)}
        ${[this.state].reverse().map((item, index) => this.templateResultTable(item, index + 1)).join(` `)}
      </div>`
    );
  }

  isWin(state) {
    return (
      state.answers.length === GameParameters.NUMBER_ANSWERS &&
      state.lives > GameParameters.MIN_COUNT_LIVES
    );
  }

  templateHeader(state) {
    if (this.isWin(state)) {
      return `<h1>Победа!</h1>`;
    }
    return `<h1>Поражение!</h1>`;
  }

  templateResultTable(state, index) {
    if (!this.isWin(state)) {
      return (
        `<table class="result__table">
          <tr>
            <td class="result__number">${index}.</td>
            <td>
              ${Utils.getStats(state.answers)}
            </td>
            <td class="result__total"></td>
            <td class="result__total  result__total--final">fail</td>
          </tr>
        </table>`
      );
    }

    const currentResult = Utils.getCurrentResult(state);
    const bonusesAndPenalties = [
      {
        name: `Бонус за скорость`,
        type: `fast`,
        pointsPerUnit: amountPoints.BONUS_FOR_FAST_ANSWER,
        amount: currentResult.amountFastAnswers,
        points: Utils.countOfPoints(currentResult.amountFastAnswers, amountPoints.BONUS_FOR_FAST_ANSWER)
      },
      {
        name: `Бонус за жизни`,
        type: `alive`,
        pointsPerUnit: amountPoints.BONUS_FOR_LIVES_LEFT,
        amount: currentResult.amountLivesLeft,
        points: Utils.countOfPoints(currentResult.amountLivesLeft, amountPoints.BONUS_FOR_LIVES_LEFT)
      },
      {
        name: `Штраф за медлительность`,
        type: `slow`,
        pointsPerUnit: -amountPoints.BONUS_FOR_SLOW_ANSWER,
        amount: currentResult.amountSlowAnswers,
        points: Utils.countOfPoints(currentResult.amountSlowAnswers, amountPoints.BONUS_FOR_SLOW_ANSWER)
      }
    ];

    const rows = bonusesAndPenalties.map((item) => this.getTemplateResultRow(item));

    return (
      `<table class="result__table">
        <tr>
          <td class="result__number">${index}.</td>
          <td colspan="2">
            ${Utils.getStats(state.answers)}
          </td>
          <td class="result__points">×&nbsp;${amountPoints.CORRECT_ANSWER}</td>
          <td class="result__total">${Utils.countOfPoints(currentResult.amountCorrectAnswers,
          amountPoints.CORRECT_ANSWER)}</td>
        </tr>
        ${rows.join(` `)}
        <tr>
          <td colspan="5" class="result__total  result__total--final">${currentResult.totalPoints}</td>
        </tr>
      </table>`
    );
  }

  getTemplateResultRow(item) {
    return (
      `<tr>
        <td></td>
        <td class="result__extra">${item.name}:</td>
        <td class="result__extra">${item.amount}&nbsp;<span class="stats__result stats__result--${item.type}"></span></td>
        <td class="result__points">×&nbsp;${item.pointsPerUnit}</td>
        <td class="result__total">${item.points}</td>
      </tr>`
    );
  }

  bind(element) {
    this.header = element.querySelector(`.header`);
    displayHeader(this);
  }
}

export default ResultView;
