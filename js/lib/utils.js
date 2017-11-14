import {GameParameters} from '../data/data';

const main = document.querySelector(`.central`);

class Utils {
  static getElementFromTemplate(murkup) {
    const template = document.createElement(`template`);
    template.innerHTML = murkup;
    return template.content;
  }

  static clearElement(parent) {
    while (parent.firstChild) {
      parent.removeChild(parent.firstChild);
    }
  }

  static displayElement(newElement, parent, clear) {
    if (clear) {
      this.clearElement(parent);
    }
    if (parent.firstElementChild) {
      parent.insertBefore(newElement, parent.firstElementChild);
      return;
    }
    parent.appendChild(newElement);
  }

  static displayScreen(newElement) {
    this.displayElement(newElement, main, true);
  }

  static getLevel(level, data) {
    return data[level];
  }

  static getStats(listAnswers) {
    const stats = [`<ul class="stats">`];
    listAnswers.forEach((item) => {
      stats.push(`<li class="stats__result stats__result--${item}"></li>`);
    });

    const amountUnknownAnswers = GameParameters.NUMBER_ANSWERS - listAnswers.length;
    for (let i = 0; i < amountUnknownAnswers; i++) {
      stats.push(`<li class="stats__result stats__result--unknown"></li>`);
    }
    stats.push(`</ul>`);
    return stats.join(` `);
  }

  static getCurrentResult(state) {
    const currentResult = {
      correctAnswers: {
        amount: 9,
        points: 900
      },
      fastAnswers: {
        amount: 1,
        points: 50
      },
      slowAnswers: {
        amount: 2,
        points: -100
      },
      livesLeft: {
        amount: 1,
        points: 1
      }
    };

    /*const currentResult = {
      amountCorrectAnswers: 9,
      amountFastAnswers: 1,
      amountSlowAnswers: 2,
      amountLivesLeft: 1,
      totalPoints: 950
      }
    };*/

    return currentResult;
  }
}

export default Utils;
