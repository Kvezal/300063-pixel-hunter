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

  static displayElement(newElement, parent, clear = false) {
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

  static countOfPoints(amount, points) {
    return amount * points;
  }

  static resize(image, defaultParameters) {
    const ratioImage = image.width / image.height;

    let newWidth = defaultParameters.WIDTH;
    let newHeight = newWidth / ratioImage;
    if (newHeight <= defaultParameters.HEIGHT) {
      return {
        width: newWidth,
        height: newHeight
      };
    }

    newHeight = defaultParameters.HEIGHT;
    newWidth = newHeight * ratioImage;
    return {
      width: newWidth,
      height: newHeight
    };
  }

  static getImageParameters(buffer, url) {
    const imageBuffer = buffer.find((image) => image.src === url);
    return {
      width: imageBuffer.width,
      height: imageBuffer.height
    };
  }
}

export default Utils;
