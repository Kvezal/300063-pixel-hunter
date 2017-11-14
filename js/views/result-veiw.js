import AbstractView from './abstract-view';
import displayHeader from '../lib/display-header';
import Utils from '../lib/utils';

class ResultView extends AbstractView {
  constructor() {
    super();
  }

  get template() {
    this.getTemplateResultTable();

    return (
      `<header class="header"></header>
      <div class="result">
        <h1>Победа!</h1>
        <table class="result__table">
          <tr>
            <td class="result__number">1.</td>
            <td colspan="2">
              ${Utils.getStats(this.state.answers)}
            </td>
            <td class="result__points">×&nbsp;100</td>
            <td class="result__total">900</td>
          </tr>
          <tr>
            <td></td>
            <td class="result__extra">Бонус за скорость:</td>
            <td class="result__extra">1&nbsp;<span class="stats__result stats__result--fast"></span></td>
            <td class="result__points">×&nbsp;50</td>
            <td class="result__total">50</td>
          </tr>
          <tr>
            <td></td>
            <td class="result__extra">Бонус за жизни:</td>
            <td class="result__extra">2&nbsp;<span class="stats__result stats__result--alive"></span></td>
            <td class="result__points">×&nbsp;50</td>
            <td class="result__total">100</td>
          </tr>
          <tr>
            <td></td>
            <td class="result__extra">Штраф за медлительность:</td>
            <td class="result__extra">2&nbsp;<span class="stats__result stats__result--slow"></span></td>
            <td class="result__points">×&nbsp;50</td>
            <td class="result__total">-100</td>
          </tr>
          <tr>
            <td colspan="5" class="result__total  result__total--final">950</td>
          </tr>
        </table>



        <table class="result__table">
          <tr>
            <td class="result__number">2.</td>
            <td>
              <ul class="stats">
                <li class="stats__result stats__result--wrong"></li>
                <li class="stats__result stats__result--slow"></li>
                <li class="stats__result stats__result--fast"></li>
                <li class="stats__result stats__result--correct"></li>
                <li class="stats__result stats__result--wrong"></li>
                <li class="stats__result stats__result--unknown"></li>
                <li class="stats__result stats__result--slow"></li>
                <li class="stats__result stats__result--wrong"></li>
                <li class="stats__result stats__result--fast"></li>
                <li class="stats__result stats__result--wrong"></li>
              </ul>
            </td>
            <td class="result__total"></td>
            <td class="result__total  result__total--final">fail</td>
          </tr>
        </table>
      </div>`
    );
  }

  getTemplateResultTable() {
    const currentResult = Utils.getCurrentResult(this.state);
    console.log(currentResult)
    console.log (
      `<table class="result__table">
        <tr>
          <td class="result__number">1.</td>
          <td colspan="2">
            ${Utils.getStats(this.state.answers)}
          </td>
          <td class="result__points">×&nbsp;100</td>
          <td class="result__total">${currentResult.correctAnswers.points}</td>
        </tr>
        <tr>
          <td></td>
          <td class="result__extra">Бонус за скорость:</td>
          <td class="result__extra">${currentResult.correctAnswers.amount}&nbsp;<span class="stats__result stats__result--fast"></span></td>
          <td class="result__points">×&nbsp;50</td>
          <td class="result__total">${currentResult.correctAnswers.points}</td>
        </tr>
        <tr>
          <td></td>
          <td class="result__extra">Бонус за жизни:</td>
          <td class="result__extra">${currentResult.livesLeft.amount}&nbsp;<span class="stats__result stats__result--alive"></span></td>
          <td class="result__points">×&nbsp;50</td>
          <td class="result__total">${currentResult.livesLeft.points}</td>
        </tr>
        <tr>
          <td></td>
          <td class="result__extra">Штраф за медлительность:</td>
          <td class="result__extra">${currentResult.slowAnswers.amount}&nbsp;<span class="stats__result stats__result--slow"></span></td>
          <td class="result__points">×&nbsp;50</td>
          <td class="result__total">${currentResult.slowAnswers.points}</td>
        </tr>
        <tr>
          <td colspan="5" class="result__total  result__total--final">950</td>
        </tr>
      </table>`
    );
  }

  bind(element) {
    this.header = element.querySelector(`.header`);
    displayHeader(this);
  }
}

export default ResultView;