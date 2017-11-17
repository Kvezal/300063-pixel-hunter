(function () {
'use strict';

const initialState = {
  lives: 3,
  time: 30,
  level: 0
};

const GameParameters = {
  MIN_COUNT_LIVES: 0,
  MIN_COUNT_TIME: 0,
  NUMBER_ANSWERS: 10,
  AMOUNT_MILISECONDS_IN_SECONDS: 1000
};

const amountPoints = {
  CORRECT_ANSWER: 100,
  BONUS_FOR_FAST_ANSWER: 50,
  BONUS_FOR_SLOW_ANSWER: -50,
  BONUS_FOR_LIVES_LEFT: 50
};

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

class AbstractView {
  get template() {
    throw new Error(`You have to define template for view!`);
  }

  get element() {
    if (!this._element) {
      this._element = this.render();
    }
    const element = this._element.cloneNode(true);
    this.bind(element);
    return element;
  }

  bind() {

  }

  render() {
    return Utils.getElementFromTemplate(this.template);
  }

}

class GreetingView extends AbstractView {
  constructor() {
    super();
  }

  get template() {
    return (
      `<div class="greeting">
        <div class="greeting__logo"><img src="img/logo_big.png" width="201" height="89" alt="Pixel Hunter"></div>
        <h1 class="greeting__asterisk">*</h1>
        <div class="greeting__challenge">
          <h3>Лучшие художники-фотореалисты бросают&nbsp;тебе&nbsp;вызов!</h3>
          <p>Правила игры просты.<br>
            Нужно отличить рисунок&nbsp;от фотографии и сделать выбор.<br>
            Задача кажется тривиальной, но не думай, что все так просто.<br>
            Фотореализм обманчив и коварен.<br>
            Помни, главное — смотреть очень внимательно.</p>
        </div>
        <div class="greeting__continue"><span><img src="img/arrow_right.svg" width="64" height="64" alt="Next"></span></div>
      </div>`
    );
  }

  bind(element) {
    const buttonContinue = element.querySelector(`.greeting__continue`);
    buttonContinue.onclick = (evt) => this.continueHandler(evt);

    const greeting = element.querySelector(`.greeting`);
    window.setTimeout(() => {
      greeting.classList.add(`central--blur`);
    }, 10);
  }
}

class GreetingScreen {
  constructor() {
    this.view = new GreetingView();
  }

  init() {
    this.view.continueHandler = () => {
      Application.showRulesScreen();
    };

    Utils.displayScreen(this.view.element);
  }
}

var greetingScreen = new GreetingScreen();

const IMAGE_PARAMETERS = {
  WIDTH: 468,
  HEIGHT: 458
};

class LevelFirstTypeView extends AbstractView {
  constructor(gameView) {
    super();

    this.answerHandler = gameView.firstLevelType.answerHandler;
    this.imagesBuffer = gameView.model.imagesBuffer;
    this.currentLevel = gameView.model.data[gameView.model.state.level];
  }

  get template() {
    return (
      `<p class="game__task">${this.currentLevel.question}</p>
      <form class="game__content">
        ${this.templateGameOptions}
      </form>`
    );
  }

  templateOption(url, index) {
    const imageParameters = Utils.getImageParameters(this.imagesBuffer, url);
    const newImageParameters = Utils.resize(imageParameters, IMAGE_PARAMETERS);

    return (
      `<div class="game__option">
        <img src="${url}" alt="Option ${index + 1}" width="${newImageParameters.width}" height="${newImageParameters.height}">
        <label class="game__answer game__answer--photo">
          <input name="question${index + 1}" type="radio" value="photo">
          <span>Фото</span>
        </label>
        <label class="game__answer game__answer--paint">
          <input name="question${index + 1}" type="radio" value="paint">
          <span>Рисунок</span>
        </label>
      </div>`
    );
  }

  get templateGameOptions() {
    return this.currentLevel.images.map((item, index) => {
      return this.templateOption(item.url, index);
    }).join(` `);
  }

  bind(element) {
    const form = element.querySelector(`.game__content`);

    const radioButtons = form.querySelectorAll(`input[type='radio']`);
    [...radioButtons].forEach((radio) => {
      radio.onchange = (evt) => this.answerHandler(evt, form);
    });
  }
}

const IMAGE_PARAMETERS$1 = {
  WIDTH: 705,
  HEIGHT: 455
};

class LevelSecondTypeView extends AbstractView {
  constructor(gameView) {
    super();

    this.answerHandler = gameView.secondLevelType.answerHandler;
    this.imagesBuffer = gameView.model.imagesBuffer;
    this.currentLevel = gameView.model.data[gameView.model.state.level];
  }

  get template() {
    const imageParameters = Utils.getImageParameters(this.imagesBuffer,
        this.currentLevel.image.url);
    const newImageParameters = Utils.resize(imageParameters, IMAGE_PARAMETERS$1);

    return (
      `<p class="game__task">Угадай, фото или рисунок?</p>
      <form class="game__content  game__content--wide">
        <div class="game__option">
          <img src="${this.currentLevel.image.url}" alt="Option 1" width="${newImageParameters.width}" height="${newImageParameters.height}">
          <label class="game__answer  game__answer--photo">
            <input name="question1" type="radio" value="photo">
            <span>Фото</span>
          </label>
          <label class="game__answer  game__answer--wide  game__answer--paint">
            <input name="question1" type="radio" value="paint">
            <span>Рисунок</span>
          </label>
        </div>
      </form>`
    );
  }

  bind(element) {
    const radioButtons = element.querySelectorAll(`input[type='radio']`);
    [...radioButtons].forEach((radio) => {
      radio.onclick = (evt) => this.answerHandler(evt, [...radioButtons]);
    });
  }
}

const IMAGE_PARAMETERS$2 = {
  WIDTH: 304,
  HEIGHT: 455
};

class LevelThirdTypeView extends AbstractView {
  constructor(gameView) {
    super();

    this.answerHandler = gameView.thirdLevelType.answerHandler;
    this.imagesBuffer = gameView.model.imagesBuffer;
    this.currentLevel = gameView.model.data[gameView.model.state.level];
  }

  get template() {
    return (
      `<p class="game__task">${this.currentLevel.question}</p>
      <form class="game__content  game__content--triple">
        ${this.templateGameOptions}
      </form>`
    );
  }

  templateOption(url, index) {
    const imageParameters = Utils.getImageParameters(this.imagesBuffer, url);
    const newImageParameters = Utils.resize(imageParameters, IMAGE_PARAMETERS$2);

    return (
      `<div class="game__option">
        <img src="${url}" alt="Option ${index + 1}" width="${newImageParameters.width}" height="${newImageParameters.height}">
      </div>`
    );
  }

  get templateGameOptions() {
    return this.currentLevel.images.map((item, index) => {
      return this.templateOption(item.url, index);
    }).join(` `);
  }

  bind(element) {
    const options = element.querySelectorAll(`.game__option`);
    [...options].forEach((option) => {
      option.onclick = (evt) => this.answerHandler(evt);
    });
  }
}

const TypeOfLevels = {
  FIRST: `first`,
  SECOND: `second`,
  THIRD: `third`
};

const routesLevel = {
  [TypeOfLevels.FIRST]: LevelFirstTypeView,
  [TypeOfLevels.SECOND]: LevelSecondTypeView,
  [TypeOfLevels.THIRD]: LevelThirdTypeView
};

class GameView extends AbstractView {
  constructor(model) {
    super();
    this.model = model;
  }

  get template() {
    return (
      `<header class="header"></header>
      <div class="game">
        <div class="stats">
          ${Utils.getStats(this.model.state.answers)}
        </div>
      </div>`
    );
  }

  bind(element) {
    this.header = element.querySelector(`.header`);
    displayHeader(this);

    this.levelContainer = element.querySelector(`.game`);
    this.updateLevel();
  }

  updateLevel() {
    const currentTypeLevel = this.model.currentLevel.type;
    const level = new routesLevel[currentTypeLevel](this).element;
    Utils.displayElement(level, this.levelContainer);
  }
}

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

const displayHeader = (view) => {
  const player = new PlayerView(view).element;
  Utils.displayElement(player, view.header);
};

class RulesView extends AbstractView {
  constructor() {
    super();
  }

  get template() {
    return (
      `<header class="header"></header>
      <div class="rules">
        <h1 class="rules__title">Правила</h1>
        <p class="rules__description">Угадай 10 раз для каждого изображения фото <img
          src="img/photo_icon.png" width="16" height="16"> или рисунок <img
          src="img/paint_icon.png" width="16" height="16" alt="">.<br>
          Фотографиями или рисунками могут быть оба изображения.<br>
          На каждую попытку отводится 30 секунд.<br>
          Ошибиться можно не более 3 раз.<br>
          <br>
          Готовы?
        </p>
        <form class="rules__form">
          <input class="rules__input" type="text" placeholder="Ваше Имя" required>
          <button class="rules__button  continue" type="submit" disabled>Go!</button>
        </form>
      </div>`
    );
  }

  bind(element) {
    this.header = element.querySelector(`.header`);
    displayHeader(this);

    const form = element.querySelector(`.rules__form`);
    form.onsubmit = (evt) => this.formSubmitHandler(evt);

    const input = element.querySelector(`.rules__input`);
    input.oninput = (evt) => this.ckeckedInput(evt);
  }
}

class PlayerScreen {
  init(gameView) {
    this.buttonBackHandler = (evt) => {
      evt.preventDefault();
      Application.showGreetingScreen();
      if (gameView) {
        window.clearTimeout(gameModel.state.timerId);
      }
    };

    if (!gameView) {
      return this;
    }

    const gameModel = gameView.model;

    this.tick = () => {
      if (gameModel.state.time > GameParameters.MIN_COUNT_TIME) {
        return;
      }
      --gameModel.state.lives;
      ++gameModel.state.level;
      gameModel.addAnswer(false);

      if (!gameModel.isCanPlay()) {
        Application.showStatsScreen(gameModel.state);
        return;
      }
      Application.showGameScreen(gameModel.state);
    };

    return this;
  }
}

var player = new PlayerScreen();

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

      Application.showGameScreen(state);
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

var rulesScreen = new RulesScreen();

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
      (this.state.lives >= GameParameters.MIN_COUNT_LIVES)
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

class LevelFirstTypeScreen {
  init(gameView) {
    this.gameModel = gameView.model;
    this.currentLevel = this.gameModel.currentLevel;

    this.answerHandler = (evt, form) => {
      evt.preventDefault();

      const gameOptions = form.querySelectorAll(`.game__option`);
      if (!LevelFirstTypeScreen.checkForm(gameOptions)) {
        return;
      }

      const answer = this.getAnswer(gameOptions);
      gameView.showNextScreen(answer);
    };

    return this;
  }

  static checkForm(gameOptions) {
    return [...gameOptions].every((option) => {
      const groupRadios = option.querySelectorAll(`input[type='radio']`);
      return [...groupRadios].some((radio) => radio.checked);
    });
  }

  getAnswer(gameOptions) {
    return [...gameOptions].every((option, index) => {
      const imageType = this.currentLevel.images[index].type;
      const groupRadios = option.querySelectorAll(`input[type='radio']`);

      return [...groupRadios].some((radio) => {
        if (radio.checked) {
          return radio.value === imageType;
        }
        return false;
      });
    });
  }
}

var firstLevelType = new LevelFirstTypeScreen();

class LevelSecondTypeScreen {
  init(gameView) {
    const gameModel = gameView.model;
    this.currentLevel = gameModel.currentLevel;

    this.answerHandler = (evt) => {
      evt.preventDefault();

      const answer = this.getAnswer(evt.currentTarget);
      gameView.showNextScreen(answer);
    };

    return this;
  }

  getAnswer(radio) {
    const imageType = this.currentLevel.image.type;
    return radio.value === imageType;
  }
}

var secondLevelType = new LevelSecondTypeScreen();

class LevelThirdTypeScreen {
  init(gameView) {
    const gameModel = gameView.model;
    this.currentLevel = gameModel.currentLevel;

    this.answerHandler = (evt) => {
      evt.preventDefault();

      const answer = this.getAnswer(evt.currentTarget);
      gameView.showNextScreen(answer);
    };

    return this;
  }

  getAnswer(target) {
    const imageSrc = target.querySelector(`img`).src;
    const selectedImage = this.currentLevel.images.find((image) => {
      return image.url === imageSrc;
    });
    return selectedImage.type === this.currentLevel.answer;
  }
}

var thirdLevelType = new LevelThirdTypeScreen();

class GameScreen {
  constructor(gameData, imagesBuffer) {
    this.model = new GameModel(gameData, imagesBuffer);
  }

  init(state) {
    this.model.updateState(state);
    this.view = new GameView(this.model);
    const time = new Date();

    this.view.showNextScreen = (answer) => {
      window.clearTimeout(this.view.model.state.timerId);

      if (!answer) {
        --state.lives;
      }
      this.model.addAnswer(answer, time);

      ++state.level;
      if (this.model.isCanPlay()) {
        Application.showGameScreen(state);
        return;
      }
      Application.showStatsScreen(state);
    };

    this.view.player = player.init(this.view);
    this.view.firstLevelType = firstLevelType.init(this.view);
    this.view.secondLevelType = secondLevelType.init(this.view);
    this.view.thirdLevelType = thirdLevelType.init(this.view);

    Utils.displayScreen(this.view.element);
  }
}

const getCurrentResult = (state) => {
  const currentResult = {
    amountCorrectAnswers: 0,
    amountFastAnswers: 0,
    amountSlowAnswers: 0,
    amountLivesLeft: state.lives
  };

  const countTotalPoints = ((sum, item) => {
    switch (item) {
      case `correct`:
        ++currentResult.amountCorrectAnswers;
        sum += 100;
        break;
      case `fast`:
        ++currentResult.amountCorrectAnswers;
        ++currentResult.amountFastAnswers;
        sum += 150;
        break;
      case `slow`:
        ++currentResult.amountCorrectAnswers;
        ++currentResult.amountSlowAnswers;
        sum += 50;
        break;
    }
    return sum;
  });

  let totalPoints = state.answers.reduce(countTotalPoints, 0) +
      currentResult.amountLivesLeft * 50;

  return {
    totalPoints,

    correctAnswers: {
      pointsPerUnit: amountPoints.CORRECT_ANSWER,
      amount: currentResult.amountCorrectAnswers,
      points: Utils.countOfPoints(currentResult.amountCorrectAnswers, amountPoints.CORRECT_ANSWER)
    },

    bonusesAndPenalties: [
      {
        title: `Бонус за скорость`,
        type: `fast`,
        pointsPerUnit: amountPoints.BONUS_FOR_FAST_ANSWER,
        amount: currentResult.amountFastAnswers,
        points: Utils.countOfPoints(currentResult.amountFastAnswers, amountPoints.BONUS_FOR_FAST_ANSWER)
      },
      {
        title: `Бонус за жизни`,
        type: `alive`,
        pointsPerUnit: amountPoints.BONUS_FOR_LIVES_LEFT,
        amount: currentResult.amountLivesLeft,
        points: Utils.countOfPoints(currentResult.amountLivesLeft, amountPoints.BONUS_FOR_LIVES_LEFT)
      },
      {
        title: `Штраф за медлительность`,
        type: `slow`,
        pointsPerUnit: -amountPoints.BONUS_FOR_SLOW_ANSWER,
        amount: currentResult.amountSlowAnswers,
        points: Utils.countOfPoints(currentResult.amountSlowAnswers, amountPoints.BONUS_FOR_SLOW_ANSWER)
      }
    ]
  };
};

class ResultView extends AbstractView {
  constructor(data) {
    super();
    this.data = data.reverse();
  }

  get template() {
    return (
      `<header class="header"></header>
      <div class="result">
        ${this.templateHeader(this.data[0])}
        ${this.data.map((item, index) => this.templateResultTable(item, index + 1)).join(` `)}
      </div>`
    );
  }

  isWin(state) {
    return (
      state.answers.length === GameParameters.NUMBER_ANSWERS &&
      state.lives >= GameParameters.MIN_COUNT_LIVES
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

    const currentResult = getCurrentResult(state);

    const rows = currentResult.bonusesAndPenalties.map((item) => this.getTemplateResultRow(item));

    return (
      `<table class="result__table">
        <tr>
          <td class="result__number">${index}.</td>
          <td colspan="2">
            ${Utils.getStats(state.answers)}
          </td>
          <td class="result__points">×&nbsp;${currentResult.correctAnswers.pointsPerUnit}</td>
          <td class="result__total">${currentResult.correctAnswers.points}</td>
        </tr>
        ${rows.join(` `)}
        <tr>
          <td colspan="5" class="result__total  result__total--final">${currentResult.totalPoints}</td>
        </tr>
      </table>`
    );
  }

  getTemplateResultRow(item) {
    if (!item.amount) {
      return ``;
    }
    return (
      `<tr>
        <td></td>
        <td class="result__extra">${item.title}:</td>
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

class ResultScreen {
  init(state) {
    const view = new ResultView(state);
    view.player = player.init();

    Utils.displayScreen(view.element);
  }
}

var resultScreen = new ResultScreen();

const TypeOfLevels$1 = {
  FIRST: `two-of-two`,
  SECOND: `tinder-like`,
  THIRD: `one-of-three`
};

const getParametersOfImages = (level) => {
  return level.answers.map((item) => {
    if (item.type === `painting`) {
      item.type = `paint`;
    }
    return {
      url: item.image.url,
      type: item.type
    };
  });
};

const adaptFirstLevelType = (level) => {
  return {
    question: level.question,
    type: `first`,
    images: getParametersOfImages(level, `third`)
  };
};

const adaptSecondLevelType = (level) => {
  return {
    question: level.question,
    type: `second`,
    image: getParametersOfImages(level)[0]
  };
};

const adaptThirdLevelType = (level) => {
  let amountPaint = 0;

  const images = level.answers.map((item) => {
    if (item.type === `painting`) {
      item.type = `paint`;
      ++amountPaint;
    }
    return {
      url: item.image.url,
      width: item.image.width,
      height: item.image.height,
      type: item.type
    };
  });

  let answer = `paint`;
  if (amountPaint === 2) {
    answer = `photo`;
  }
  return {
    question: level.question,
    answer,
    type: `third`,
    images
  };
};

const AdaptTypeOfLevels = {
  [TypeOfLevels$1.FIRST]: adaptFirstLevelType,
  [TypeOfLevels$1.SECOND]: adaptSecondLevelType,
  [TypeOfLevels$1.THIRD]: adaptThirdLevelType
};

const adapt = (data) => {
  return data.map((item) => {
    return AdaptTypeOfLevels[item.type](item);
  });
};

const loadImage = (url) => {
  return new Promise((onLoad, onError) => {
    const image = new Image();
    image.onload = () => onLoad(image);
    image.onerror = () => onError;
    image.src = url;
  });
};

const SERVER_URL = `https://es.dump.academy/pixel-hunter`;
const DEFAULT_NAME = `kvezal`;

class Loader {
  static loadData() {
    return fetch(`${SERVER_URL}/questions`).
        then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw new Error(`Не удалось загрузить данные с сервера`);
        })
        .then(adapt);
  }

  static saveResult(data, name = DEFAULT_NAME) {
    const requestSettings = {
      body: JSON.stringify(data),
      headers: {
        'Content-Type': `application/json`
      },
      method: `POST`
    };

    return fetch(`${SERVER_URL}/stats/${name}`, requestSettings);
  }

  static loadResult(name = DEFAULT_NAME) {
    return fetch(`${SERVER_URL}/stats/${name}`).
        then((response) => {
          if (response.ok) {
            return response.json();
          }
          throw new Error(`Не удалось загрузить данные с сервера`);
        });
  }

  static loadFile(data) {
    const ListOfURLImages = new Set();

    data.forEach((item) => {
      if (item.type === `second`) {
        ListOfURLImages.add(item.image.url);
        return;
      }

      item.images.forEach((image) => {
        ListOfURLImages.add(image.url);
      });
    });

    return Promise.all([...ListOfURLImages].map((item) => loadImage(item)));
  }
}

class ErrorScreen extends AbstractView {
  constructor(message) {
    super();

    this.message = message;
  }

  get template() {
    return (
      `<div class="error-message">${this.message}</div>`
    );
  }

  static show(message) {
    const error = new ErrorScreen(message);
    Utils.displayElement(error.element, document.body, true);
  }
}

class SplashScreen extends AbstractView {
  constructor() {
    super();
  }

  get template() {
    return (
      `<svg xmlns="http://www.w3.org/2000/svg" class="splash" viewBox="0 0 780 780">
          <circle
            cx="390" cy="390" r="60"
            class="splash-line"
            style="transform: rotate(-90deg); transform-origin: center"></circle>
        </svg>`
    );
  }

  start() {
    Utils.displayScreen(this.element);
  }
}

var splash = new SplashScreen();

const ContrallerId = {
  GREETING: ``,
  RULES: `rules`,
  GAME: `game`,
  STATS: `stats`
};

class Application {
  static init(images) {
    Application.routes = {
      [ContrallerId.GREETING]: greetingScreen,
      [ContrallerId.RULES]: rulesScreen,
      [ContrallerId.GAME]: new GameScreen(quest, images),
      [ContrallerId.RESULT]: resultScreen
    };
    Application.showGreetingScreen();
  }

  static showGreetingScreen() {
    this.routes[ContrallerId.GREETING].init();
  }

  static showRulesScreen() {
    this.routes[ContrallerId.RULES].init();
  }

  static showGameScreen(state) {
    this.routes[ContrallerId.GAME].init(state);
  }

  static showStatsScreen(state) {
    splash.start();
    Loader.saveResult(state, state.name).
        then(() => Loader.loadResult(state.name)).
        then(this.routes[ContrallerId.RESULT].init);
  }
}

let quest = {};

const loadFile = (data) => {
  quest = data;
  return Loader.loadFile(data);
};

Loader.loadData()
    .then(loadFile)
    .then(Application.init)
    .catch(ErrorScreen.show);

}());

//# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJmaWxlIjoibWFpbi5qcyIsInNvdXJjZXMiOlsianMvZGF0YS9kYXRhLmpzIiwianMvbGliL3V0aWxzLmpzIiwianMvdmlld3MvYWJzdHJhY3Qtdmlldy5qcyIsImpzL3ZpZXdzL2dyZWV0aW5nLXZpZXcuanMiLCJqcy9zY3JlZW5zL2dyZWV0aW5nLXNjcmVlbi5qcyIsImpzL3ZpZXdzL2xldmVsLWZpcnN0LXR5cGUtdmlldy5qcyIsImpzL3ZpZXdzL2xldmVsLXNlY29uZC10eXBlLXZpZXcuanMiLCJqcy92aWV3cy9sZXZlbC10aGlyZC10eXBlLXZpZXcuanMiLCJqcy92aWV3cy9nYW1lLXZpZXcuanMiLCJqcy92aWV3cy9wbGF5ZXItdmlldy5qcyIsImpzL2xpYi9kaXNwbGF5LWhlYWRlci5qcyIsImpzL3ZpZXdzL3J1bGVzLXZpZXcuanMiLCJqcy9zY3JlZW5zL3BsYXllci1zY3JlZW4uanMiLCJqcy9zY3JlZW5zL3J1bGVzLXNjcmVlbi5qcyIsImpzL21vZGVscy9nYW1lLW1vZGVsLmpzIiwianMvc2NyZWVucy9sZXZlbC1maXJzdC10eXBlLXNjcmVlbi5qcyIsImpzL3NjcmVlbnMvbGV2ZWwtc2Vjb25kLXR5cGUtc2NyZWVuLmpzIiwianMvc2NyZWVucy9sZXZlbC10aGlyZC10eXBlLXNjcmVlbi5qcyIsImpzL3NjcmVlbnMvZ2FtZS1zY3JlZW4uanMiLCJqcy9saWIvZ2V0LWN1cnJlbnQtcmVzdWx0LmpzIiwianMvdmlld3MvcmVzdWx0LXZlaXcuanMiLCJqcy9zY3JlZW5zL3Jlc3VsdC1zY3JlZW4uanMiLCJqcy9kYXRhL2RhdGEtYWRhcHRlci5qcyIsImpzL2xpYi9sb2FkLWltYWdlLmpzIiwianMvbG9hZGVyLmpzIiwianMvc2NyZWVucy9lcnJvci1zY3JlZW4uanMiLCJqcy9zY3JlZW5zL3NwbGFzaC1zY3JlZW4uanMiLCJqcy9hcHBsaWNhdGlvbi5qcyJdLCJzb3VyY2VzQ29udGVudCI6WyJjb25zdCBpbml0aWFsU3RhdGUgPSB7XHJcbiAgbGl2ZXM6IDMsXHJcbiAgdGltZTogMzAsXHJcbiAgbGV2ZWw6IDBcclxufTtcclxuXHJcbmNvbnN0IEdhbWVQYXJhbWV0ZXJzID0ge1xyXG4gIE1JTl9DT1VOVF9MSVZFUzogMCxcclxuICBNSU5fQ09VTlRfVElNRTogMCxcclxuICBOVU1CRVJfQU5TV0VSUzogMTAsXHJcbiAgQU1PVU5UX01JTElTRUNPTkRTX0lOX1NFQ09ORFM6IDEwMDBcclxufTtcclxuXHJcbmNvbnN0IGFtb3VudFBvaW50cyA9IHtcclxuICBDT1JSRUNUX0FOU1dFUjogMTAwLFxyXG4gIEJPTlVTX0ZPUl9GQVNUX0FOU1dFUjogNTAsXHJcbiAgQk9OVVNfRk9SX1NMT1dfQU5TV0VSOiAtNTAsXHJcbiAgQk9OVVNfRk9SX0xJVkVTX0xFRlQ6IDUwXHJcbn07XHJcblxyXG5leHBvcnQge0dhbWVQYXJhbWV0ZXJzLCBpbml0aWFsU3RhdGUsIGFtb3VudFBvaW50c307XHJcbiIsImltcG9ydCB7R2FtZVBhcmFtZXRlcnN9IGZyb20gJy4uL2RhdGEvZGF0YSc7XHJcblxyXG5jb25zdCBtYWluID0gZG9jdW1lbnQucXVlcnlTZWxlY3RvcihgLmNlbnRyYWxgKTtcclxuXHJcbmNsYXNzIFV0aWxzIHtcclxuICBzdGF0aWMgZ2V0RWxlbWVudEZyb21UZW1wbGF0ZShtdXJrdXApIHtcclxuICAgIGNvbnN0IHRlbXBsYXRlID0gZG9jdW1lbnQuY3JlYXRlRWxlbWVudChgdGVtcGxhdGVgKTtcclxuICAgIHRlbXBsYXRlLmlubmVySFRNTCA9IG11cmt1cDtcclxuICAgIHJldHVybiB0ZW1wbGF0ZS5jb250ZW50O1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGNsZWFyRWxlbWVudChwYXJlbnQpIHtcclxuICAgIHdoaWxlIChwYXJlbnQuZmlyc3RDaGlsZCkge1xyXG4gICAgICBwYXJlbnQucmVtb3ZlQ2hpbGQocGFyZW50LmZpcnN0Q2hpbGQpO1xyXG4gICAgfVxyXG4gIH1cclxuXHJcbiAgc3RhdGljIGRpc3BsYXlFbGVtZW50KG5ld0VsZW1lbnQsIHBhcmVudCwgY2xlYXIgPSBmYWxzZSkge1xyXG4gICAgaWYgKGNsZWFyKSB7XHJcbiAgICAgIHRoaXMuY2xlYXJFbGVtZW50KHBhcmVudCk7XHJcbiAgICB9XHJcbiAgICBpZiAocGFyZW50LmZpcnN0RWxlbWVudENoaWxkKSB7XHJcbiAgICAgIHBhcmVudC5pbnNlcnRCZWZvcmUobmV3RWxlbWVudCwgcGFyZW50LmZpcnN0RWxlbWVudENoaWxkKTtcclxuICAgICAgcmV0dXJuO1xyXG4gICAgfVxyXG4gICAgcGFyZW50LmFwcGVuZENoaWxkKG5ld0VsZW1lbnQpO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGRpc3BsYXlTY3JlZW4obmV3RWxlbWVudCkge1xyXG4gICAgdGhpcy5kaXNwbGF5RWxlbWVudChuZXdFbGVtZW50LCBtYWluLCB0cnVlKTtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBnZXRMZXZlbChsZXZlbCwgZGF0YSkge1xyXG4gICAgcmV0dXJuIGRhdGFbbGV2ZWxdO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGdldFN0YXRzKGxpc3RBbnN3ZXJzKSB7XHJcbiAgICBjb25zdCBzdGF0cyA9IFtgPHVsIGNsYXNzPVwic3RhdHNcIj5gXTtcclxuICAgIGxpc3RBbnN3ZXJzLmZvckVhY2goKGl0ZW0pID0+IHtcclxuICAgICAgc3RhdHMucHVzaChgPGxpIGNsYXNzPVwic3RhdHNfX3Jlc3VsdCBzdGF0c19fcmVzdWx0LS0ke2l0ZW19XCI+PC9saT5gKTtcclxuICAgIH0pO1xyXG5cclxuICAgIGNvbnN0IGFtb3VudFVua25vd25BbnN3ZXJzID0gR2FtZVBhcmFtZXRlcnMuTlVNQkVSX0FOU1dFUlMgLSBsaXN0QW5zd2Vycy5sZW5ndGg7XHJcbiAgICBmb3IgKGxldCBpID0gMDsgaSA8IGFtb3VudFVua25vd25BbnN3ZXJzOyBpKyspIHtcclxuICAgICAgc3RhdHMucHVzaChgPGxpIGNsYXNzPVwic3RhdHNfX3Jlc3VsdCBzdGF0c19fcmVzdWx0LS11bmtub3duXCI+PC9saT5gKTtcclxuICAgIH1cclxuICAgIHN0YXRzLnB1c2goYDwvdWw+YCk7XHJcbiAgICByZXR1cm4gc3RhdHMuam9pbihgIGApO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIGNvdW50T2ZQb2ludHMoYW1vdW50LCBwb2ludHMpIHtcclxuICAgIHJldHVybiBhbW91bnQgKiBwb2ludHM7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgcmVzaXplKGltYWdlLCBkZWZhdWx0UGFyYW1ldGVycykge1xyXG4gICAgY29uc3QgcmF0aW9JbWFnZSA9IGltYWdlLndpZHRoIC8gaW1hZ2UuaGVpZ2h0O1xyXG5cclxuICAgIGxldCBuZXdXaWR0aCA9IGRlZmF1bHRQYXJhbWV0ZXJzLldJRFRIO1xyXG4gICAgbGV0IG5ld0hlaWdodCA9IG5ld1dpZHRoIC8gcmF0aW9JbWFnZTtcclxuICAgIGlmIChuZXdIZWlnaHQgPD0gZGVmYXVsdFBhcmFtZXRlcnMuSEVJR0hUKSB7XHJcbiAgICAgIHJldHVybiB7XHJcbiAgICAgICAgd2lkdGg6IG5ld1dpZHRoLFxyXG4gICAgICAgIGhlaWdodDogbmV3SGVpZ2h0XHJcbiAgICAgIH07XHJcbiAgICB9XHJcblxyXG4gICAgbmV3SGVpZ2h0ID0gZGVmYXVsdFBhcmFtZXRlcnMuSEVJR0hUO1xyXG4gICAgbmV3V2lkdGggPSBuZXdIZWlnaHQgKiByYXRpb0ltYWdlO1xyXG4gICAgcmV0dXJuIHtcclxuICAgICAgd2lkdGg6IG5ld1dpZHRoLFxyXG4gICAgICBoZWlnaHQ6IG5ld0hlaWdodFxyXG4gICAgfTtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBnZXRJbWFnZVBhcmFtZXRlcnMoYnVmZmVyLCB1cmwpIHtcclxuICAgIGNvbnN0IGltYWdlQnVmZmVyID0gYnVmZmVyLmZpbmQoKGltYWdlKSA9PiBpbWFnZS5zcmMgPT09IHVybCk7XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB3aWR0aDogaW1hZ2VCdWZmZXIud2lkdGgsXHJcbiAgICAgIGhlaWdodDogaW1hZ2VCdWZmZXIuaGVpZ2h0XHJcbiAgICB9O1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgVXRpbHM7XHJcbiIsImltcG9ydCBVdGlscyBmcm9tICcuLi9saWIvdXRpbHMnO1xyXG5cclxuY2xhc3MgQWJzdHJhY3RWaWV3IHtcclxuICBnZXQgdGVtcGxhdGUoKSB7XHJcbiAgICB0aHJvdyBuZXcgRXJyb3IoYFlvdSBoYXZlIHRvIGRlZmluZSB0ZW1wbGF0ZSBmb3IgdmlldyFgKTtcclxuICB9XHJcblxyXG4gIGdldCBlbGVtZW50KCkge1xyXG4gICAgaWYgKCF0aGlzLl9lbGVtZW50KSB7XHJcbiAgICAgIHRoaXMuX2VsZW1lbnQgPSB0aGlzLnJlbmRlcigpO1xyXG4gICAgfVxyXG4gICAgY29uc3QgZWxlbWVudCA9IHRoaXMuX2VsZW1lbnQuY2xvbmVOb2RlKHRydWUpO1xyXG4gICAgdGhpcy5iaW5kKGVsZW1lbnQpO1xyXG4gICAgcmV0dXJuIGVsZW1lbnQ7XHJcbiAgfVxyXG5cclxuICBiaW5kKCkge1xyXG5cclxuICB9XHJcblxyXG4gIHJlbmRlcigpIHtcclxuICAgIHJldHVybiBVdGlscy5nZXRFbGVtZW50RnJvbVRlbXBsYXRlKHRoaXMudGVtcGxhdGUpO1xyXG4gIH1cclxuXHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEFic3RyYWN0VmlldztcclxuIiwiaW1wb3J0IEFic3RyYWN0VmlldyBmcm9tICcuL2Fic3RyYWN0LXZpZXcnO1xyXG5cclxuY2xhc3MgR3JlZXRpbmdWaWV3IGV4dGVuZHMgQWJzdHJhY3RWaWV3IHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHN1cGVyKCk7XHJcbiAgfVxyXG5cclxuICBnZXQgdGVtcGxhdGUoKSB7XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICBgPGRpdiBjbGFzcz1cImdyZWV0aW5nXCI+XHJcbiAgICAgICAgPGRpdiBjbGFzcz1cImdyZWV0aW5nX19sb2dvXCI+PGltZyBzcmM9XCJpbWcvbG9nb19iaWcucG5nXCIgd2lkdGg9XCIyMDFcIiBoZWlnaHQ9XCI4OVwiIGFsdD1cIlBpeGVsIEh1bnRlclwiPjwvZGl2PlxyXG4gICAgICAgIDxoMSBjbGFzcz1cImdyZWV0aW5nX19hc3Rlcmlza1wiPio8L2gxPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJncmVldGluZ19fY2hhbGxlbmdlXCI+XHJcbiAgICAgICAgICA8aDM+0JvRg9GH0YjQuNC1INGF0YPQtNC+0LbQvdC40LrQuC3RhNC+0YLQvtGA0LXQsNC70LjRgdGC0Ysg0LHRgNC+0YHQsNGO0YImbmJzcDvRgtC10LHQtSZuYnNwO9Cy0YvQt9C+0LIhPC9oMz5cclxuICAgICAgICAgIDxwPtCf0YDQsNCy0LjQu9CwINC40LPRgNGLINC/0YDQvtGB0YLRiy48YnI+XHJcbiAgICAgICAgICAgINCd0YPQttC90L4g0L7RgtC70LjRh9C40YLRjCDRgNC40YHRg9C90L7QuiZuYnNwO9C+0YIg0YTQvtGC0L7Qs9GA0LDRhNC40Lgg0Lgg0YHQtNC10LvQsNGC0Ywg0LLRi9Cx0L7RgC48YnI+XHJcbiAgICAgICAgICAgINCX0LDQtNCw0YfQsCDQutCw0LbQtdGC0YHRjyDRgtGA0LjQstC40LDQu9GM0L3QvtC5LCDQvdC+INC90LUg0LTRg9C80LDQuSwg0YfRgtC+INCy0YHQtSDRgtCw0Log0L/RgNC+0YHRgtC+Ljxicj5cclxuICAgICAgICAgICAg0KTQvtGC0L7RgNC10LDQu9C40LfQvCDQvtCx0LzQsNC90YfQuNCyINC4INC60L7QstCw0YDQtdC9Ljxicj5cclxuICAgICAgICAgICAg0J/QvtC80L3QuCwg0LPQu9Cw0LLQvdC+0LUg4oCUINGB0LzQvtGC0YDQtdGC0Ywg0L7Rh9C10L3RjCDQstC90LjQvNCw0YLQtdC70YzQvdC+LjwvcD5cclxuICAgICAgICA8L2Rpdj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiZ3JlZXRpbmdfX2NvbnRpbnVlXCI+PHNwYW4+PGltZyBzcmM9XCJpbWcvYXJyb3dfcmlnaHQuc3ZnXCIgd2lkdGg9XCI2NFwiIGhlaWdodD1cIjY0XCIgYWx0PVwiTmV4dFwiPjwvc3Bhbj48L2Rpdj5cclxuICAgICAgPC9kaXY+YFxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIGJpbmQoZWxlbWVudCkge1xyXG4gICAgY29uc3QgYnV0dG9uQ29udGludWUgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoYC5ncmVldGluZ19fY29udGludWVgKTtcclxuICAgIGJ1dHRvbkNvbnRpbnVlLm9uY2xpY2sgPSAoZXZ0KSA9PiB0aGlzLmNvbnRpbnVlSGFuZGxlcihldnQpO1xyXG5cclxuICAgIGNvbnN0IGdyZWV0aW5nID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yKGAuZ3JlZXRpbmdgKTtcclxuICAgIHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgZ3JlZXRpbmcuY2xhc3NMaXN0LmFkZChgY2VudHJhbC0tYmx1cmApO1xyXG4gICAgfSwgMTApO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgR3JlZXRpbmdWaWV3O1xyXG4iLCJpbXBvcnQgQXBwIGZyb20gJy4uL2FwcGxpY2F0aW9uJztcclxuaW1wb3J0IEdyZWV0aW5nVmlldyBmcm9tICcuLi92aWV3cy9ncmVldGluZy12aWV3JztcclxuaW1wb3J0IFV0aWxzIGZyb20gJy4uL2xpYi91dGlscyc7XHJcblxyXG5jbGFzcyBHcmVldGluZ1NjcmVlbiB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLnZpZXcgPSBuZXcgR3JlZXRpbmdWaWV3KCk7XHJcbiAgfVxyXG5cclxuICBpbml0KCkge1xyXG4gICAgdGhpcy52aWV3LmNvbnRpbnVlSGFuZGxlciA9ICgpID0+IHtcclxuICAgICAgQXBwLnNob3dSdWxlc1NjcmVlbigpO1xyXG4gICAgfTtcclxuXHJcbiAgICBVdGlscy5kaXNwbGF5U2NyZWVuKHRoaXMudmlldy5lbGVtZW50KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IG5ldyBHcmVldGluZ1NjcmVlbigpO1xyXG4iLCJpbXBvcnQgQWJzdHJhY3RWaWV3IGZyb20gJy4vYWJzdHJhY3Qtdmlldyc7XHJcbmltcG9ydCBVdGlscyBmcm9tICcuLi9saWIvdXRpbHMnO1xyXG5cclxuY29uc3QgSU1BR0VfUEFSQU1FVEVSUyA9IHtcclxuICBXSURUSDogNDY4LFxyXG4gIEhFSUdIVDogNDU4XHJcbn07XHJcblxyXG5jbGFzcyBMZXZlbEZpcnN0VHlwZVZpZXcgZXh0ZW5kcyBBYnN0cmFjdFZpZXcge1xyXG4gIGNvbnN0cnVjdG9yKGdhbWVWaWV3KSB7XHJcbiAgICBzdXBlcigpO1xyXG5cclxuICAgIHRoaXMuYW5zd2VySGFuZGxlciA9IGdhbWVWaWV3LmZpcnN0TGV2ZWxUeXBlLmFuc3dlckhhbmRsZXI7XHJcbiAgICB0aGlzLmltYWdlc0J1ZmZlciA9IGdhbWVWaWV3Lm1vZGVsLmltYWdlc0J1ZmZlcjtcclxuICAgIHRoaXMuY3VycmVudExldmVsID0gZ2FtZVZpZXcubW9kZWwuZGF0YVtnYW1lVmlldy5tb2RlbC5zdGF0ZS5sZXZlbF07XHJcbiAgfVxyXG5cclxuICBnZXQgdGVtcGxhdGUoKSB7XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICBgPHAgY2xhc3M9XCJnYW1lX190YXNrXCI+JHt0aGlzLmN1cnJlbnRMZXZlbC5xdWVzdGlvbn08L3A+XHJcbiAgICAgIDxmb3JtIGNsYXNzPVwiZ2FtZV9fY29udGVudFwiPlxyXG4gICAgICAgICR7dGhpcy50ZW1wbGF0ZUdhbWVPcHRpb25zfVxyXG4gICAgICA8L2Zvcm0+YFxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIHRlbXBsYXRlT3B0aW9uKHVybCwgaW5kZXgpIHtcclxuICAgIGNvbnN0IGltYWdlUGFyYW1ldGVycyA9IFV0aWxzLmdldEltYWdlUGFyYW1ldGVycyh0aGlzLmltYWdlc0J1ZmZlciwgdXJsKTtcclxuICAgIGNvbnN0IG5ld0ltYWdlUGFyYW1ldGVycyA9IFV0aWxzLnJlc2l6ZShpbWFnZVBhcmFtZXRlcnMsIElNQUdFX1BBUkFNRVRFUlMpO1xyXG5cclxuICAgIHJldHVybiAoXHJcbiAgICAgIGA8ZGl2IGNsYXNzPVwiZ2FtZV9fb3B0aW9uXCI+XHJcbiAgICAgICAgPGltZyBzcmM9XCIke3VybH1cIiBhbHQ9XCJPcHRpb24gJHtpbmRleCArIDF9XCIgd2lkdGg9XCIke25ld0ltYWdlUGFyYW1ldGVycy53aWR0aH1cIiBoZWlnaHQ9XCIke25ld0ltYWdlUGFyYW1ldGVycy5oZWlnaHR9XCI+XHJcbiAgICAgICAgPGxhYmVsIGNsYXNzPVwiZ2FtZV9fYW5zd2VyIGdhbWVfX2Fuc3dlci0tcGhvdG9cIj5cclxuICAgICAgICAgIDxpbnB1dCBuYW1lPVwicXVlc3Rpb24ke2luZGV4ICsgMX1cIiB0eXBlPVwicmFkaW9cIiB2YWx1ZT1cInBob3RvXCI+XHJcbiAgICAgICAgICA8c3Bhbj7QpNC+0YLQvjwvc3Bhbj5cclxuICAgICAgICA8L2xhYmVsPlxyXG4gICAgICAgIDxsYWJlbCBjbGFzcz1cImdhbWVfX2Fuc3dlciBnYW1lX19hbnN3ZXItLXBhaW50XCI+XHJcbiAgICAgICAgICA8aW5wdXQgbmFtZT1cInF1ZXN0aW9uJHtpbmRleCArIDF9XCIgdHlwZT1cInJhZGlvXCIgdmFsdWU9XCJwYWludFwiPlxyXG4gICAgICAgICAgPHNwYW4+0KDQuNGB0YPQvdC+0Lo8L3NwYW4+XHJcbiAgICAgICAgPC9sYWJlbD5cclxuICAgICAgPC9kaXY+YFxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIGdldCB0ZW1wbGF0ZUdhbWVPcHRpb25zKCkge1xyXG4gICAgcmV0dXJuIHRoaXMuY3VycmVudExldmVsLmltYWdlcy5tYXAoKGl0ZW0sIGluZGV4KSA9PiB7XHJcbiAgICAgIHJldHVybiB0aGlzLnRlbXBsYXRlT3B0aW9uKGl0ZW0udXJsLCBpbmRleCk7XHJcbiAgICB9KS5qb2luKGAgYCk7XHJcbiAgfVxyXG5cclxuICBiaW5kKGVsZW1lbnQpIHtcclxuICAgIGNvbnN0IGZvcm0gPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoYC5nYW1lX19jb250ZW50YCk7XHJcblxyXG4gICAgY29uc3QgcmFkaW9CdXR0b25zID0gZm9ybS5xdWVyeVNlbGVjdG9yQWxsKGBpbnB1dFt0eXBlPSdyYWRpbyddYCk7XHJcbiAgICBbLi4ucmFkaW9CdXR0b25zXS5mb3JFYWNoKChyYWRpbykgPT4ge1xyXG4gICAgICByYWRpby5vbmNoYW5nZSA9IChldnQpID0+IHRoaXMuYW5zd2VySGFuZGxlcihldnQsIGZvcm0pO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBMZXZlbEZpcnN0VHlwZVZpZXc7XHJcbiIsImltcG9ydCBBYnN0cmFjdFZpZXcgZnJvbSAnLi9hYnN0cmFjdC12aWV3JztcclxuaW1wb3J0IFV0aWxzIGZyb20gJy4uL2xpYi91dGlscyc7XHJcblxyXG5jb25zdCBJTUFHRV9QQVJBTUVURVJTID0ge1xyXG4gIFdJRFRIOiA3MDUsXHJcbiAgSEVJR0hUOiA0NTVcclxufTtcclxuXHJcbmNsYXNzIExldmVsU2Vjb25kVHlwZVZpZXcgZXh0ZW5kcyBBYnN0cmFjdFZpZXcge1xyXG4gIGNvbnN0cnVjdG9yKGdhbWVWaWV3KSB7XHJcbiAgICBzdXBlcigpO1xyXG5cclxuICAgIHRoaXMuYW5zd2VySGFuZGxlciA9IGdhbWVWaWV3LnNlY29uZExldmVsVHlwZS5hbnN3ZXJIYW5kbGVyO1xyXG4gICAgdGhpcy5pbWFnZXNCdWZmZXIgPSBnYW1lVmlldy5tb2RlbC5pbWFnZXNCdWZmZXI7XHJcbiAgICB0aGlzLmN1cnJlbnRMZXZlbCA9IGdhbWVWaWV3Lm1vZGVsLmRhdGFbZ2FtZVZpZXcubW9kZWwuc3RhdGUubGV2ZWxdO1xyXG4gIH1cclxuXHJcbiAgZ2V0IHRlbXBsYXRlKCkge1xyXG4gICAgY29uc3QgaW1hZ2VQYXJhbWV0ZXJzID0gVXRpbHMuZ2V0SW1hZ2VQYXJhbWV0ZXJzKHRoaXMuaW1hZ2VzQnVmZmVyLFxyXG4gICAgICAgIHRoaXMuY3VycmVudExldmVsLmltYWdlLnVybCk7XHJcbiAgICBjb25zdCBuZXdJbWFnZVBhcmFtZXRlcnMgPSBVdGlscy5yZXNpemUoaW1hZ2VQYXJhbWV0ZXJzLCBJTUFHRV9QQVJBTUVURVJTKTtcclxuXHJcbiAgICByZXR1cm4gKFxyXG4gICAgICBgPHAgY2xhc3M9XCJnYW1lX190YXNrXCI+0KPQs9Cw0LTQsNC5LCDRhNC+0YLQviDQuNC70Lgg0YDQuNGB0YPQvdC+0Lo/PC9wPlxyXG4gICAgICA8Zm9ybSBjbGFzcz1cImdhbWVfX2NvbnRlbnQgIGdhbWVfX2NvbnRlbnQtLXdpZGVcIj5cclxuICAgICAgICA8ZGl2IGNsYXNzPVwiZ2FtZV9fb3B0aW9uXCI+XHJcbiAgICAgICAgICA8aW1nIHNyYz1cIiR7dGhpcy5jdXJyZW50TGV2ZWwuaW1hZ2UudXJsfVwiIGFsdD1cIk9wdGlvbiAxXCIgd2lkdGg9XCIke25ld0ltYWdlUGFyYW1ldGVycy53aWR0aH1cIiBoZWlnaHQ9XCIke25ld0ltYWdlUGFyYW1ldGVycy5oZWlnaHR9XCI+XHJcbiAgICAgICAgICA8bGFiZWwgY2xhc3M9XCJnYW1lX19hbnN3ZXIgIGdhbWVfX2Fuc3dlci0tcGhvdG9cIj5cclxuICAgICAgICAgICAgPGlucHV0IG5hbWU9XCJxdWVzdGlvbjFcIiB0eXBlPVwicmFkaW9cIiB2YWx1ZT1cInBob3RvXCI+XHJcbiAgICAgICAgICAgIDxzcGFuPtCk0L7RgtC+PC9zcGFuPlxyXG4gICAgICAgICAgPC9sYWJlbD5cclxuICAgICAgICAgIDxsYWJlbCBjbGFzcz1cImdhbWVfX2Fuc3dlciAgZ2FtZV9fYW5zd2VyLS13aWRlICBnYW1lX19hbnN3ZXItLXBhaW50XCI+XHJcbiAgICAgICAgICAgIDxpbnB1dCBuYW1lPVwicXVlc3Rpb24xXCIgdHlwZT1cInJhZGlvXCIgdmFsdWU9XCJwYWludFwiPlxyXG4gICAgICAgICAgICA8c3Bhbj7QoNC40YHRg9C90L7Qujwvc3Bhbj5cclxuICAgICAgICAgIDwvbGFiZWw+XHJcbiAgICAgICAgPC9kaXY+XHJcbiAgICAgIDwvZm9ybT5gXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgYmluZChlbGVtZW50KSB7XHJcbiAgICBjb25zdCByYWRpb0J1dHRvbnMgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3JBbGwoYGlucHV0W3R5cGU9J3JhZGlvJ11gKTtcclxuICAgIFsuLi5yYWRpb0J1dHRvbnNdLmZvckVhY2goKHJhZGlvKSA9PiB7XHJcbiAgICAgIHJhZGlvLm9uY2xpY2sgPSAoZXZ0KSA9PiB0aGlzLmFuc3dlckhhbmRsZXIoZXZ0LCBbLi4ucmFkaW9CdXR0b25zXSk7XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IExldmVsU2Vjb25kVHlwZVZpZXc7XHJcbiIsImltcG9ydCBBYnN0cmFjdFZpZXcgZnJvbSAnLi9hYnN0cmFjdC12aWV3JztcclxuaW1wb3J0IFV0aWxzIGZyb20gJy4uL2xpYi91dGlscyc7XHJcblxyXG5jb25zdCBJTUFHRV9QQVJBTUVURVJTID0ge1xyXG4gIFdJRFRIOiAzMDQsXHJcbiAgSEVJR0hUOiA0NTVcclxufTtcclxuXHJcbmNsYXNzIExldmVsVGhpcmRUeXBlVmlldyBleHRlbmRzIEFic3RyYWN0VmlldyB7XHJcbiAgY29uc3RydWN0b3IoZ2FtZVZpZXcpIHtcclxuICAgIHN1cGVyKCk7XHJcblxyXG4gICAgdGhpcy5hbnN3ZXJIYW5kbGVyID0gZ2FtZVZpZXcudGhpcmRMZXZlbFR5cGUuYW5zd2VySGFuZGxlcjtcclxuICAgIHRoaXMuaW1hZ2VzQnVmZmVyID0gZ2FtZVZpZXcubW9kZWwuaW1hZ2VzQnVmZmVyO1xyXG4gICAgdGhpcy5jdXJyZW50TGV2ZWwgPSBnYW1lVmlldy5tb2RlbC5kYXRhW2dhbWVWaWV3Lm1vZGVsLnN0YXRlLmxldmVsXTtcclxuICB9XHJcblxyXG4gIGdldCB0ZW1wbGF0ZSgpIHtcclxuICAgIHJldHVybiAoXHJcbiAgICAgIGA8cCBjbGFzcz1cImdhbWVfX3Rhc2tcIj4ke3RoaXMuY3VycmVudExldmVsLnF1ZXN0aW9ufTwvcD5cclxuICAgICAgPGZvcm0gY2xhc3M9XCJnYW1lX19jb250ZW50ICBnYW1lX19jb250ZW50LS10cmlwbGVcIj5cclxuICAgICAgICAke3RoaXMudGVtcGxhdGVHYW1lT3B0aW9uc31cclxuICAgICAgPC9mb3JtPmBcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICB0ZW1wbGF0ZU9wdGlvbih1cmwsIGluZGV4KSB7XHJcbiAgICBjb25zdCBpbWFnZVBhcmFtZXRlcnMgPSBVdGlscy5nZXRJbWFnZVBhcmFtZXRlcnModGhpcy5pbWFnZXNCdWZmZXIsIHVybCk7XHJcbiAgICBjb25zdCBuZXdJbWFnZVBhcmFtZXRlcnMgPSBVdGlscy5yZXNpemUoaW1hZ2VQYXJhbWV0ZXJzLCBJTUFHRV9QQVJBTUVURVJTKTtcclxuXHJcbiAgICByZXR1cm4gKFxyXG4gICAgICBgPGRpdiBjbGFzcz1cImdhbWVfX29wdGlvblwiPlxyXG4gICAgICAgIDxpbWcgc3JjPVwiJHt1cmx9XCIgYWx0PVwiT3B0aW9uICR7aW5kZXggKyAxfVwiIHdpZHRoPVwiJHtuZXdJbWFnZVBhcmFtZXRlcnMud2lkdGh9XCIgaGVpZ2h0PVwiJHtuZXdJbWFnZVBhcmFtZXRlcnMuaGVpZ2h0fVwiPlxyXG4gICAgICA8L2Rpdj5gXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgZ2V0IHRlbXBsYXRlR2FtZU9wdGlvbnMoKSB7XHJcbiAgICByZXR1cm4gdGhpcy5jdXJyZW50TGV2ZWwuaW1hZ2VzLm1hcCgoaXRlbSwgaW5kZXgpID0+IHtcclxuICAgICAgcmV0dXJuIHRoaXMudGVtcGxhdGVPcHRpb24oaXRlbS51cmwsIGluZGV4KTtcclxuICAgIH0pLmpvaW4oYCBgKTtcclxuICB9XHJcblxyXG4gIGJpbmQoZWxlbWVudCkge1xyXG4gICAgY29uc3Qgb3B0aW9ucyA9IGVsZW1lbnQucXVlcnlTZWxlY3RvckFsbChgLmdhbWVfX29wdGlvbmApO1xyXG4gICAgWy4uLm9wdGlvbnNdLmZvckVhY2goKG9wdGlvbikgPT4ge1xyXG4gICAgICBvcHRpb24ub25jbGljayA9IChldnQpID0+IHRoaXMuYW5zd2VySGFuZGxlcihldnQpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBMZXZlbFRoaXJkVHlwZVZpZXc7XHJcbiIsImltcG9ydCBBYnN0cmFjdFZpZXcgZnJvbSAnLi9hYnN0cmFjdC12aWV3JztcclxuaW1wb3J0IExldmVsRmlyc3RUeXBlVmlldyBmcm9tICcuL2xldmVsLWZpcnN0LXR5cGUtdmlldyc7XHJcbmltcG9ydCBMZXZlbFNlY29uZFR5cGVWaWV3IGZyb20gJy4vbGV2ZWwtc2Vjb25kLXR5cGUtdmlldyc7XHJcbmltcG9ydCBMZXZlbFRoaXJkVHlwZVZpZXcgZnJvbSAnLi9sZXZlbC10aGlyZC10eXBlLXZpZXcnO1xyXG5pbXBvcnQgVXRpbHMgZnJvbSAnLi4vbGliL3V0aWxzJztcclxuaW1wb3J0IGRpc3BsYXlIZWFkZXIgZnJvbSAnLi4vbGliL2Rpc3BsYXktaGVhZGVyJztcclxuXHJcbmNvbnN0IFR5cGVPZkxldmVscyA9IHtcclxuICBGSVJTVDogYGZpcnN0YCxcclxuICBTRUNPTkQ6IGBzZWNvbmRgLFxyXG4gIFRISVJEOiBgdGhpcmRgXHJcbn07XHJcblxyXG5jb25zdCByb3V0ZXNMZXZlbCA9IHtcclxuICBbVHlwZU9mTGV2ZWxzLkZJUlNUXTogTGV2ZWxGaXJzdFR5cGVWaWV3LFxyXG4gIFtUeXBlT2ZMZXZlbHMuU0VDT05EXTogTGV2ZWxTZWNvbmRUeXBlVmlldyxcclxuICBbVHlwZU9mTGV2ZWxzLlRISVJEXTogTGV2ZWxUaGlyZFR5cGVWaWV3XHJcbn07XHJcblxyXG5jbGFzcyBHYW1lVmlldyBleHRlbmRzIEFic3RyYWN0VmlldyB7XHJcbiAgY29uc3RydWN0b3IobW9kZWwpIHtcclxuICAgIHN1cGVyKCk7XHJcbiAgICB0aGlzLm1vZGVsID0gbW9kZWw7XHJcbiAgfVxyXG5cclxuICBnZXQgdGVtcGxhdGUoKSB7XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICBgPGhlYWRlciBjbGFzcz1cImhlYWRlclwiPjwvaGVhZGVyPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwiZ2FtZVwiPlxyXG4gICAgICAgIDxkaXYgY2xhc3M9XCJzdGF0c1wiPlxyXG4gICAgICAgICAgJHtVdGlscy5nZXRTdGF0cyh0aGlzLm1vZGVsLnN0YXRlLmFuc3dlcnMpfVxyXG4gICAgICAgIDwvZGl2PlxyXG4gICAgICA8L2Rpdj5gXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgYmluZChlbGVtZW50KSB7XHJcbiAgICB0aGlzLmhlYWRlciA9IGVsZW1lbnQucXVlcnlTZWxlY3RvcihgLmhlYWRlcmApO1xyXG4gICAgZGlzcGxheUhlYWRlcih0aGlzKTtcclxuXHJcbiAgICB0aGlzLmxldmVsQ29udGFpbmVyID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yKGAuZ2FtZWApO1xyXG4gICAgdGhpcy51cGRhdGVMZXZlbCgpO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlTGV2ZWwoKSB7XHJcbiAgICBjb25zdCBjdXJyZW50VHlwZUxldmVsID0gdGhpcy5tb2RlbC5jdXJyZW50TGV2ZWwudHlwZTtcclxuICAgIGNvbnN0IGxldmVsID0gbmV3IHJvdXRlc0xldmVsW2N1cnJlbnRUeXBlTGV2ZWxdKHRoaXMpLmVsZW1lbnQ7XHJcbiAgICBVdGlscy5kaXNwbGF5RWxlbWVudChsZXZlbCwgdGhpcy5sZXZlbENvbnRhaW5lcik7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBHYW1lVmlldztcclxuIiwiaW1wb3J0IEFic3RyYWN0VmlldyBmcm9tICcuL2Fic3RyYWN0LXZpZXcnO1xyXG5pbXBvcnQge2luaXRpYWxTdGF0ZSwgR2FtZVBhcmFtZXRlcnN9IGZyb20gJy4uL2RhdGEvZGF0YSc7XHJcbmltcG9ydCBHYW1lVmlldyBmcm9tICcuL2dhbWUtdmlldyc7XHJcblxyXG5jbGFzcyBQbGF5ZXJWaWV3IGV4dGVuZHMgQWJzdHJhY3RWaWV3IHtcclxuICBjb25zdHJ1Y3Rvcih2aWV3KSB7XHJcbiAgICBzdXBlcigpO1xyXG5cclxuICAgIHRoaXMudmlldyA9IHZpZXc7XHJcbiAgICB0aGlzLmJ1dHRvbkJhY2tIYW5kbGVyID0gdmlldy5wbGF5ZXIuYnV0dG9uQmFja0hhbmRsZXI7XHJcbiAgfVxyXG5cclxuICBnZXQgdGVtcGxhdGUoKSB7XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICBgPGRpdiBjbGFzcz1cImhlYWRlcl9fYmFja1wiPlxyXG4gICAgICAgIDxidXR0b24gY2xhc3M9XCJiYWNrXCI+XHJcbiAgICAgICAgICA8aW1nIHNyYz1cImltZy9hcnJvd19sZWZ0LnN2Z1wiIHdpZHRoPVwiNDVcIiBoZWlnaHQ9XCI0NVwiIGFsdD1cIkJhY2tcIj5cclxuICAgICAgICAgIDxpbWcgc3JjPVwiaW1nL2xvZ29fc21hbGwuc3ZnXCIgd2lkdGg9XCIxMDFcIiBoZWlnaHQ9XCI0NFwiPlxyXG4gICAgICAgIDwvYnV0dG9uPlxyXG4gICAgICA8L2Rpdj5cclxuICAgICAgJHt0aGlzLnRlbXBsYXRlVGltZXJ9XHJcbiAgICAgICR7dGhpcy50ZW1wbGF0ZUxpdmVzfWBcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBnZXQgdGVtcGxhdGVUaW1lcigpIHtcclxuICAgIGlmICghKHRoaXMudmlldyBpbnN0YW5jZW9mIEdhbWVWaWV3KSkge1xyXG4gICAgICByZXR1cm4gYGA7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYDxoMSBjbGFzcz1cImdhbWVfX3RpbWVyXCI+Tk48L2gxPmA7XHJcbiAgfVxyXG5cclxuICBnZXQgdGVtcGxhdGVMaXZlcygpIHtcclxuICAgIGlmICghKHRoaXMudmlldyBpbnN0YW5jZW9mIEdhbWVWaWV3KSkge1xyXG4gICAgICByZXR1cm4gYGA7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgbGl2ZXMgPSBbXTtcclxuICAgIGZvciAobGV0IGkgPSAwOyBpIDwgaW5pdGlhbFN0YXRlLmxpdmVzIC0gdGhpcy52aWV3Lm1vZGVsLnN0YXRlLmxpdmVzOyBpKyspIHtcclxuICAgICAgbGl2ZXMucHVzaChgPGltZyBzcmM9XCJpbWcvaGVhcnRfX2VtcHR5LnN2Z1wiIGNsYXNzPVwiZ2FtZV9faGVhcnRcIiBhbHQ9XCJMaWZlXCIgd2lkdGg9XCIzMlwiIGhlaWdodD1cIjMyXCI+YCk7XHJcbiAgICB9XHJcbiAgICBmb3IgKGxldCBqID0gMDsgaiA8IHRoaXMudmlldy5tb2RlbC5zdGF0ZS5saXZlczsgaisrKSB7XHJcbiAgICAgIGxpdmVzLnB1c2goYDxpbWcgc3JjPVwiaW1nL2hlYXJ0X19mdWxsLnN2Z1wiIGNsYXNzPVwiZ2FtZV9faGVhcnRcIiBhbHQ9XCJMaWZlXCIgd2lkdGg9XCIzMlwiIGhlaWdodD1cIjMyXCI+YCk7XHJcbiAgICB9XHJcblxyXG4gICAgcmV0dXJuIGA8ZGl2IGNsYXNzPVwiZ2FtZV9fbGl2ZXNcIj4ke2xpdmVzLmpvaW4oYCBgKX08L2Rpdj5gO1xyXG4gIH1cclxuXHJcbiAgZGlzcGxheVRpbWVyKCkge1xyXG4gICAgaWYgKHRoaXMuc3RhdGUudGltZSA8PSA1KSB7XHJcbiAgICAgIHRoaXMudGltZXIuY2xhc3NMaXN0LmFkZChgZ2FtZV9fdGltZXItLXNtYWxsLXRpbWVgKTtcclxuICAgIH1cclxuICAgIHRoaXMudGltZXIudGV4dENvbnRlbnQgPSB0aGlzLnN0YXRlLnRpbWU7XHJcbiAgfVxyXG5cclxuICB0aWNrKCkge1xyXG4gICAgdGhpcy5kaXNwbGF5VGltZXIoKTtcclxuICAgIHRoaXMuc3RhdGUudGltZXJJZCA9IHdpbmRvdy5zZXRUaW1lb3V0KCgpID0+IHtcclxuICAgICAgLS10aGlzLnN0YXRlLnRpbWU7XHJcblxyXG4gICAgICBpZiAodGhpcy5zdGF0ZS50aW1lID4gR2FtZVBhcmFtZXRlcnMuTUlOX0NPVU5UX1RJTUUpIHtcclxuICAgICAgICB0aGlzLnRpY2soKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgICAgdGhpcy52aWV3LnBsYXllci50aWNrKCk7XHJcblxyXG4gICAgfSwgR2FtZVBhcmFtZXRlcnMuQU1PVU5UX01JTElTRUNPTkRTX0lOX1NFQ09ORFMpO1xyXG4gIH1cclxuXHJcbiAgYmluZChlbGVtZW50KSB7XHJcbiAgICBjb25zdCBidXR0b25CYWNrID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yKGAuYmFja2ApO1xyXG4gICAgYnV0dG9uQmFjay5vbmNsaWNrID0gKGV2dCkgPT4gdGhpcy5idXR0b25CYWNrSGFuZGxlcihldnQpO1xyXG5cclxuICAgIGNvbnN0IHRpbWVyID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yKGAuZ2FtZV9fdGltZXJgKTtcclxuICAgIGlmICh0aW1lcikge1xyXG4gICAgICB0aGlzLnRpbWVyID0gdGltZXI7XHJcbiAgICAgIHRoaXMuc3RhdGUgPSB0aGlzLnZpZXcubW9kZWwuc3RhdGU7XHJcbiAgICAgIHRoaXMudGljaygpO1xyXG4gICAgfVxyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgUGxheWVyVmlldztcclxuIiwiaW1wb3J0IFBsYXllclZpZXcgZnJvbSAnLi4vdmlld3MvcGxheWVyLXZpZXcnO1xyXG5pbXBvcnQgVXRpbHMgZnJvbSAnLi91dGlscyc7XHJcblxyXG5jb25zdCBkaXNwbGF5SGVhZGVyID0gKHZpZXcpID0+IHtcclxuICBjb25zdCBwbGF5ZXIgPSBuZXcgUGxheWVyVmlldyh2aWV3KS5lbGVtZW50O1xyXG4gIFV0aWxzLmRpc3BsYXlFbGVtZW50KHBsYXllciwgdmlldy5oZWFkZXIpO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgZGlzcGxheUhlYWRlcjtcclxuIiwiaW1wb3J0IEFic3RyYWN0VmlldyBmcm9tICcuL2Fic3RyYWN0LXZpZXcnO1xyXG5pbXBvcnQgZGlzcGxheUhlYWRlciBmcm9tICcuLi9saWIvZGlzcGxheS1oZWFkZXInO1xyXG5cclxuY2xhc3MgUnVsZXNWaWV3IGV4dGVuZHMgQWJzdHJhY3RWaWV3IHtcclxuICBjb25zdHJ1Y3RvcigpIHtcclxuICAgIHN1cGVyKCk7XHJcbiAgfVxyXG5cclxuICBnZXQgdGVtcGxhdGUoKSB7XHJcbiAgICByZXR1cm4gKFxyXG4gICAgICBgPGhlYWRlciBjbGFzcz1cImhlYWRlclwiPjwvaGVhZGVyPlxyXG4gICAgICA8ZGl2IGNsYXNzPVwicnVsZXNcIj5cclxuICAgICAgICA8aDEgY2xhc3M9XCJydWxlc19fdGl0bGVcIj7Qn9GA0LDQstC40LvQsDwvaDE+XHJcbiAgICAgICAgPHAgY2xhc3M9XCJydWxlc19fZGVzY3JpcHRpb25cIj7Qo9Cz0LDQtNCw0LkgMTAg0YDQsNC3INC00LvRjyDQutCw0LbQtNC+0LPQviDQuNC30L7QsdGA0LDQttC10L3QuNGPINGE0L7RgtC+IDxpbWdcclxuICAgICAgICAgIHNyYz1cImltZy9waG90b19pY29uLnBuZ1wiIHdpZHRoPVwiMTZcIiBoZWlnaHQ9XCIxNlwiPiDQuNC70Lgg0YDQuNGB0YPQvdC+0LogPGltZ1xyXG4gICAgICAgICAgc3JjPVwiaW1nL3BhaW50X2ljb24ucG5nXCIgd2lkdGg9XCIxNlwiIGhlaWdodD1cIjE2XCIgYWx0PVwiXCI+Ljxicj5cclxuICAgICAgICAgINCk0L7RgtC+0LPRgNCw0YTQuNGP0LzQuCDQuNC70Lgg0YDQuNGB0YPQvdC60LDQvNC4INC80L7Qs9GD0YIg0LHRi9GC0Ywg0L7QsdCwINC40LfQvtCx0YDQsNC20LXQvdC40Y8uPGJyPlxyXG4gICAgICAgICAg0J3QsCDQutCw0LbQtNGD0Y4g0L/QvtC/0YvRgtC60YMg0L7RgtCy0L7QtNC40YLRgdGPIDMwINGB0LXQutGD0L3QtC48YnI+XHJcbiAgICAgICAgICDQntGI0LjQsdC40YLRjNGB0Y8g0LzQvtC20L3QviDQvdC1INCx0L7Qu9C10LUgMyDRgNCw0LcuPGJyPlxyXG4gICAgICAgICAgPGJyPlxyXG4gICAgICAgICAg0JPQvtGC0L7QstGLP1xyXG4gICAgICAgIDwvcD5cclxuICAgICAgICA8Zm9ybSBjbGFzcz1cInJ1bGVzX19mb3JtXCI+XHJcbiAgICAgICAgICA8aW5wdXQgY2xhc3M9XCJydWxlc19faW5wdXRcIiB0eXBlPVwidGV4dFwiIHBsYWNlaG9sZGVyPVwi0JLQsNGI0LUg0JjQvNGPXCIgcmVxdWlyZWQ+XHJcbiAgICAgICAgICA8YnV0dG9uIGNsYXNzPVwicnVsZXNfX2J1dHRvbiAgY29udGludWVcIiB0eXBlPVwic3VibWl0XCIgZGlzYWJsZWQ+R28hPC9idXR0b24+XHJcbiAgICAgICAgPC9mb3JtPlxyXG4gICAgICA8L2Rpdj5gXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgYmluZChlbGVtZW50KSB7XHJcbiAgICB0aGlzLmhlYWRlciA9IGVsZW1lbnQucXVlcnlTZWxlY3RvcihgLmhlYWRlcmApO1xyXG4gICAgZGlzcGxheUhlYWRlcih0aGlzKTtcclxuXHJcbiAgICBjb25zdCBmb3JtID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yKGAucnVsZXNfX2Zvcm1gKTtcclxuICAgIGZvcm0ub25zdWJtaXQgPSAoZXZ0KSA9PiB0aGlzLmZvcm1TdWJtaXRIYW5kbGVyKGV2dCk7XHJcblxyXG4gICAgY29uc3QgaW5wdXQgPSBlbGVtZW50LnF1ZXJ5U2VsZWN0b3IoYC5ydWxlc19faW5wdXRgKTtcclxuICAgIGlucHV0Lm9uaW5wdXQgPSAoZXZ0KSA9PiB0aGlzLmNrZWNrZWRJbnB1dChldnQpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgUnVsZXNWaWV3O1xyXG4iLCJpbXBvcnQgQXBwIGZyb20gJy4uL2FwcGxpY2F0aW9uJztcclxuaW1wb3J0IHtHYW1lUGFyYW1ldGVyc30gZnJvbSAnLi4vZGF0YS9kYXRhJztcclxuXHJcbmNsYXNzIFBsYXllclNjcmVlbiB7XHJcbiAgaW5pdChnYW1lVmlldykge1xyXG4gICAgdGhpcy5idXR0b25CYWNrSGFuZGxlciA9IChldnQpID0+IHtcclxuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIEFwcC5zaG93R3JlZXRpbmdTY3JlZW4oKTtcclxuICAgICAgaWYgKGdhbWVWaWV3KSB7XHJcbiAgICAgICAgd2luZG93LmNsZWFyVGltZW91dChnYW1lTW9kZWwuc3RhdGUudGltZXJJZCk7XHJcbiAgICAgIH1cclxuICAgIH07XHJcblxyXG4gICAgaWYgKCFnYW1lVmlldykge1xyXG4gICAgICByZXR1cm4gdGhpcztcclxuICAgIH1cclxuXHJcbiAgICBjb25zdCBnYW1lTW9kZWwgPSBnYW1lVmlldy5tb2RlbDtcclxuXHJcbiAgICB0aGlzLnRpY2sgPSAoKSA9PiB7XHJcbiAgICAgIGlmIChnYW1lTW9kZWwuc3RhdGUudGltZSA+IEdhbWVQYXJhbWV0ZXJzLk1JTl9DT1VOVF9USU1FKSB7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcbiAgICAgIC0tZ2FtZU1vZGVsLnN0YXRlLmxpdmVzO1xyXG4gICAgICArK2dhbWVNb2RlbC5zdGF0ZS5sZXZlbDtcclxuICAgICAgZ2FtZU1vZGVsLmFkZEFuc3dlcihmYWxzZSk7XHJcblxyXG4gICAgICBpZiAoIWdhbWVNb2RlbC5pc0NhblBsYXkoKSkge1xyXG4gICAgICAgIEFwcC5zaG93U3RhdHNTY3JlZW4oZ2FtZU1vZGVsLnN0YXRlKTtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuICAgICAgQXBwLnNob3dHYW1lU2NyZWVuKGdhbWVNb2RlbC5zdGF0ZSk7XHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgbmV3IFBsYXllclNjcmVlbigpO1xyXG4iLCJpbXBvcnQgQXBwIGZyb20gJy4uL2FwcGxpY2F0aW9uJztcclxuaW1wb3J0IFJ1bGVzVmlldyBmcm9tICcuLi92aWV3cy9ydWxlcy12aWV3JztcclxuaW1wb3J0IFV0aWxzIGZyb20gJy4uL2xpYi91dGlscyc7XHJcbmltcG9ydCB7aW5pdGlhbFN0YXRlfSBmcm9tICcuLi9kYXRhL2RhdGEnO1xyXG5pbXBvcnQgcGxheWVyIGZyb20gJy4vcGxheWVyLXNjcmVlbic7XHJcblxyXG5jb25zdCBBTU9VTlRfU0lNQk9MUyA9IDI7XHJcblxyXG5jbGFzcyBSdWxlc1NjcmVlbiB7XHJcbiAgY29uc3RydWN0b3IoKSB7XHJcbiAgICB0aGlzLnZpZXcgPSBuZXcgUnVsZXNWaWV3KCk7XHJcbiAgfVxyXG5cclxuICBpbml0KCkge1xyXG4gICAgdGhpcy52aWV3LmNrZWNrZWRJbnB1dCA9IChldnQpID0+IHtcclxuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcbiAgICAgIGNvbnN0IHZhbHVlID0gZXZ0LmN1cnJlbnRUYXJnZXQudmFsdWU7XHJcblxyXG4gICAgICBjb25zdCBmb3JtID0gZXZ0LmN1cnJlbnRUYXJnZXQucGFyZW50RWxlbWVudDtcclxuICAgICAgY29uc3QgcnVsZXNCdXR0b24gPSBmb3JtLnF1ZXJ5U2VsZWN0b3IoYC5ydWxlc19fYnV0dG9uYCk7XHJcbiAgICAgIHJ1bGVzQnV0dG9uLmRpc2FibGVkID0gdHJ1ZTtcclxuXHJcbiAgICAgIGlmICghdGhpcy5jaGVja0lucHV0KHZhbHVlKSkge1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgICB0aGlzLnZhbHVlID0gdmFsdWU7XHJcbiAgICAgIHJ1bGVzQnV0dG9uLmRpc2FibGVkID0gZmFsc2U7XHJcbiAgICB9O1xyXG5cclxuICAgIHRoaXMudmlldy5mb3JtU3VibWl0SGFuZGxlciA9IChldnQpID0+IHtcclxuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICBjb25zdCBzdGF0ZSA9IE9iamVjdC5hc3NpZ24oe30sIGluaXRpYWxTdGF0ZSk7XHJcbiAgICAgIHN0YXRlLmFuc3dlcnMgPSBbXTtcclxuICAgICAgc3RhdGUubmFtZSA9IHRoaXMudmFsdWU7XHJcblxyXG4gICAgICBBcHAuc2hvd0dhbWVTY3JlZW4oc3RhdGUpO1xyXG4gICAgfTtcclxuXHJcbiAgICB0aGlzLnZpZXcucGxheWVyID0gcGxheWVyLmluaXQoKTtcclxuXHJcbiAgICBVdGlscy5kaXNwbGF5U2NyZWVuKHRoaXMudmlldy5lbGVtZW50KTtcclxuICB9XHJcblxyXG4gIGNoZWNrSW5wdXQodmFsdWUpIHtcclxuICAgIGNvbnN0IGNoZWNrZWRTaW1ib2xzID0gL1t7fSo8PiwuPyFAIyQ6OyVeJidcIlxcXFx8L1xcc10vO1xyXG4gICAgY29uc3QgcmVzdWx0Q2hlY2tTaW1ib2xzID0gIWNoZWNrZWRTaW1ib2xzLnRlc3QodmFsdWUpO1xyXG5cclxuICAgIHJldHVybiAoXHJcbiAgICAgIHZhbHVlLmxlbmd0aCA+PSBBTU9VTlRfU0lNQk9MUyAmJlxyXG4gICAgICByZXN1bHRDaGVja1NpbWJvbHNcclxuICAgICk7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBuZXcgUnVsZXNTY3JlZW4oKTtcclxuIiwiaW1wb3J0IFV0aWxzIGZyb20gJy4uL2xpYi91dGlscyc7XHJcbmltcG9ydCB7aW5pdGlhbFN0YXRlLCBHYW1lUGFyYW1ldGVyc30gZnJvbSAnLi4vZGF0YS9kYXRhJztcclxuXHJcbmNvbnN0IHRpbWVBbnN3ZXJzID0ge1xyXG4gIEZBU1Q6IDEwLFxyXG4gIFNMT1c6IDIwXHJcbn07XHJcblxyXG5jbGFzcyBHYW1lTW9kZWwge1xyXG4gIGNvbnN0cnVjdG9yKGRhdGEsIGltYWdlc0J1ZmZlcikge1xyXG4gICAgdGhpcy5kYXRhID0gZGF0YTtcclxuICAgIHRoaXMuaW1hZ2VzQnVmZmVyID0gaW1hZ2VzQnVmZmVyO1xyXG4gIH1cclxuXHJcbiAgdXBkYXRlU3RhdGUobmV3U3RhdGUpIHtcclxuICAgIHRoaXMuc3RhdGUgPSBuZXdTdGF0ZTtcclxuICAgIHRoaXMucmVzZXRUaW1lcigpO1xyXG4gIH1cclxuXHJcbiAgcmVzZXRUaW1lcigpIHtcclxuICAgIHRoaXMuc3RhdGUudGltZSA9IGluaXRpYWxTdGF0ZS50aW1lO1xyXG4gIH1cclxuXHJcbiAgaXNDYW5QbGF5KCkge1xyXG4gICAgcmV0dXJuIChcclxuICAgICAgKHRoaXMuc3RhdGUubGV2ZWwgPCBHYW1lUGFyYW1ldGVycy5OVU1CRVJfQU5TV0VSUykgJiZcclxuICAgICAgKHRoaXMuc3RhdGUuYW5zd2Vycy5sZW5ndGggPCBHYW1lUGFyYW1ldGVycy5OVU1CRVJfQU5TV0VSUykgJiZcclxuICAgICAgKHRoaXMuc3RhdGUubGl2ZXMgPj0gR2FtZVBhcmFtZXRlcnMuTUlOX0NPVU5UX0xJVkVTKVxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIGdldCBjdXJyZW50TGV2ZWwoKSB7XHJcbiAgICByZXR1cm4gVXRpbHMuZ2V0TGV2ZWwodGhpcy5zdGF0ZS5sZXZlbCwgdGhpcy5kYXRhKTtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBnZXRUeXBlQW5zd2VyKGFuc3dlciwgdGltZSkge1xyXG4gICAgaWYgKCFhbnN3ZXIpIHtcclxuICAgICAgcmV0dXJuIGB3cm9uZ2A7XHJcbiAgICB9XHJcbiAgICBpZiAodGltZSA8IHRpbWVBbnN3ZXJzLkZBU1QpIHtcclxuICAgICAgcmV0dXJuIGBmYXN0YDtcclxuICAgIH1cclxuICAgIGlmICh0aW1lID49IHRpbWVBbnN3ZXJzLkZBU1QgJiYgdGltZSA8IHRpbWVBbnN3ZXJzLlNMT1cpIHtcclxuICAgICAgcmV0dXJuIGBjb3JyZWN0YDtcclxuICAgIH1cclxuICAgIGlmICh0aW1lID49IHRpbWVBbnN3ZXJzLlNMT1cgJiYgdGltZSA8IGluaXRpYWxTdGF0ZS50aW1lKSB7XHJcbiAgICAgIHJldHVybiBgc2xvd2A7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYHdyb25nYDtcclxuICB9XHJcblxyXG4gIGFkZEFuc3dlcihhbnN3ZXIsIHRpbWUpIHtcclxuICAgIHRpbWUgPSAobmV3IERhdGUoKSAtIHRpbWUpIC8gR2FtZVBhcmFtZXRlcnMuQU1PVU5UX01JTElTRUNPTkRTX0lOX1NFQ09ORFM7XHJcbiAgICBjb25zdCB0eXBlID0gR2FtZU1vZGVsLmdldFR5cGVBbnN3ZXIoYW5zd2VyLCB0aW1lKTtcclxuICAgIHRoaXMuc3RhdGUuYW5zd2Vycy5wdXNoKHR5cGUpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgR2FtZU1vZGVsO1xyXG4iLCJjbGFzcyBMZXZlbEZpcnN0VHlwZVNjcmVlbiB7XHJcbiAgaW5pdChnYW1lVmlldykge1xyXG4gICAgdGhpcy5nYW1lTW9kZWwgPSBnYW1lVmlldy5tb2RlbDtcclxuICAgIHRoaXMuY3VycmVudExldmVsID0gdGhpcy5nYW1lTW9kZWwuY3VycmVudExldmVsO1xyXG5cclxuICAgIHRoaXMuYW5zd2VySGFuZGxlciA9IChldnQsIGZvcm0pID0+IHtcclxuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICBjb25zdCBnYW1lT3B0aW9ucyA9IGZvcm0ucXVlcnlTZWxlY3RvckFsbChgLmdhbWVfX29wdGlvbmApO1xyXG4gICAgICBpZiAoIUxldmVsRmlyc3RUeXBlU2NyZWVuLmNoZWNrRm9ybShnYW1lT3B0aW9ucykpIHtcclxuICAgICAgICByZXR1cm47XHJcbiAgICAgIH1cclxuXHJcbiAgICAgIGNvbnN0IGFuc3dlciA9IHRoaXMuZ2V0QW5zd2VyKGdhbWVPcHRpb25zKTtcclxuICAgICAgZ2FtZVZpZXcuc2hvd05leHRTY3JlZW4oYW5zd2VyKTtcclxuICAgIH07XHJcblxyXG4gICAgcmV0dXJuIHRoaXM7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgY2hlY2tGb3JtKGdhbWVPcHRpb25zKSB7XHJcbiAgICByZXR1cm4gWy4uLmdhbWVPcHRpb25zXS5ldmVyeSgob3B0aW9uKSA9PiB7XHJcbiAgICAgIGNvbnN0IGdyb3VwUmFkaW9zID0gb3B0aW9uLnF1ZXJ5U2VsZWN0b3JBbGwoYGlucHV0W3R5cGU9J3JhZGlvJ11gKTtcclxuICAgICAgcmV0dXJuIFsuLi5ncm91cFJhZGlvc10uc29tZSgocmFkaW8pID0+IHJhZGlvLmNoZWNrZWQpO1xyXG4gICAgfSk7XHJcbiAgfVxyXG5cclxuICBnZXRBbnN3ZXIoZ2FtZU9wdGlvbnMpIHtcclxuICAgIHJldHVybiBbLi4uZ2FtZU9wdGlvbnNdLmV2ZXJ5KChvcHRpb24sIGluZGV4KSA9PiB7XHJcbiAgICAgIGNvbnN0IGltYWdlVHlwZSA9IHRoaXMuY3VycmVudExldmVsLmltYWdlc1tpbmRleF0udHlwZTtcclxuICAgICAgY29uc3QgZ3JvdXBSYWRpb3MgPSBvcHRpb24ucXVlcnlTZWxlY3RvckFsbChgaW5wdXRbdHlwZT0ncmFkaW8nXWApO1xyXG5cclxuICAgICAgcmV0dXJuIFsuLi5ncm91cFJhZGlvc10uc29tZSgocmFkaW8pID0+IHtcclxuICAgICAgICBpZiAocmFkaW8uY2hlY2tlZCkge1xyXG4gICAgICAgICAgcmV0dXJuIHJhZGlvLnZhbHVlID09PSBpbWFnZVR5cGU7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIHJldHVybiBmYWxzZTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IG5ldyBMZXZlbEZpcnN0VHlwZVNjcmVlbigpO1xyXG4iLCJjbGFzcyBMZXZlbFNlY29uZFR5cGVTY3JlZW4ge1xyXG4gIGluaXQoZ2FtZVZpZXcpIHtcclxuICAgIGNvbnN0IGdhbWVNb2RlbCA9IGdhbWVWaWV3Lm1vZGVsO1xyXG4gICAgdGhpcy5jdXJyZW50TGV2ZWwgPSBnYW1lTW9kZWwuY3VycmVudExldmVsO1xyXG5cclxuICAgIHRoaXMuYW5zd2VySGFuZGxlciA9IChldnQpID0+IHtcclxuICAgICAgZXZ0LnByZXZlbnREZWZhdWx0KCk7XHJcblxyXG4gICAgICBjb25zdCBhbnN3ZXIgPSB0aGlzLmdldEFuc3dlcihldnQuY3VycmVudFRhcmdldCk7XHJcbiAgICAgIGdhbWVWaWV3LnNob3dOZXh0U2NyZWVuKGFuc3dlcik7XHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiB0aGlzO1xyXG4gIH1cclxuXHJcbiAgZ2V0QW5zd2VyKHJhZGlvKSB7XHJcbiAgICBjb25zdCBpbWFnZVR5cGUgPSB0aGlzLmN1cnJlbnRMZXZlbC5pbWFnZS50eXBlO1xyXG4gICAgcmV0dXJuIHJhZGlvLnZhbHVlID09PSBpbWFnZVR5cGU7XHJcbiAgfVxyXG59XHJcblxyXG5leHBvcnQgZGVmYXVsdCBuZXcgTGV2ZWxTZWNvbmRUeXBlU2NyZWVuKCk7XHJcbiIsImNsYXNzIExldmVsVGhpcmRUeXBlU2NyZWVuIHtcclxuICBpbml0KGdhbWVWaWV3KSB7XHJcbiAgICBjb25zdCBnYW1lTW9kZWwgPSBnYW1lVmlldy5tb2RlbDtcclxuICAgIHRoaXMuY3VycmVudExldmVsID0gZ2FtZU1vZGVsLmN1cnJlbnRMZXZlbDtcclxuXHJcbiAgICB0aGlzLmFuc3dlckhhbmRsZXIgPSAoZXZ0KSA9PiB7XHJcbiAgICAgIGV2dC5wcmV2ZW50RGVmYXVsdCgpO1xyXG5cclxuICAgICAgY29uc3QgYW5zd2VyID0gdGhpcy5nZXRBbnN3ZXIoZXZ0LmN1cnJlbnRUYXJnZXQpO1xyXG4gICAgICBnYW1lVmlldy5zaG93TmV4dFNjcmVlbihhbnN3ZXIpO1xyXG4gICAgfTtcclxuXHJcbiAgICByZXR1cm4gdGhpcztcclxuICB9XHJcblxyXG4gIGdldEFuc3dlcih0YXJnZXQpIHtcclxuICAgIGNvbnN0IGltYWdlU3JjID0gdGFyZ2V0LnF1ZXJ5U2VsZWN0b3IoYGltZ2ApLnNyYztcclxuICAgIGNvbnN0IHNlbGVjdGVkSW1hZ2UgPSB0aGlzLmN1cnJlbnRMZXZlbC5pbWFnZXMuZmluZCgoaW1hZ2UpID0+IHtcclxuICAgICAgcmV0dXJuIGltYWdlLnVybCA9PT0gaW1hZ2VTcmM7XHJcbiAgICB9KTtcclxuICAgIHJldHVybiBzZWxlY3RlZEltYWdlLnR5cGUgPT09IHRoaXMuY3VycmVudExldmVsLmFuc3dlcjtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IG5ldyBMZXZlbFRoaXJkVHlwZVNjcmVlbigpO1xyXG4iLCJpbXBvcnQgQXBwIGZyb20gJy4uL2FwcGxpY2F0aW9uJztcclxuaW1wb3J0IEdhbWVNb2RlbCBmcm9tICcuLi9tb2RlbHMvZ2FtZS1tb2RlbCc7XHJcbmltcG9ydCBHYW1lVmlldyBmcm9tICcuLi92aWV3cy9nYW1lLXZpZXcnO1xyXG5pbXBvcnQgVXRpbHMgZnJvbSAnLi4vbGliL3V0aWxzJztcclxuaW1wb3J0IHBsYXllciBmcm9tICcuL3BsYXllci1zY3JlZW4nO1xyXG5pbXBvcnQgZmlyc3RMZXZlbFR5cGUgZnJvbSAnLi9sZXZlbC1maXJzdC10eXBlLXNjcmVlbic7XHJcbmltcG9ydCBzZWNvbmRMZXZlbFR5cGUgZnJvbSAnLi9sZXZlbC1zZWNvbmQtdHlwZS1zY3JlZW4nO1xyXG5pbXBvcnQgdGhpcmRMZXZlbFR5cGUgZnJvbSAnLi9sZXZlbC10aGlyZC10eXBlLXNjcmVlbic7XHJcblxyXG5jbGFzcyBHYW1lU2NyZWVuIHtcclxuICBjb25zdHJ1Y3RvcihnYW1lRGF0YSwgaW1hZ2VzQnVmZmVyKSB7XHJcbiAgICB0aGlzLm1vZGVsID0gbmV3IEdhbWVNb2RlbChnYW1lRGF0YSwgaW1hZ2VzQnVmZmVyKTtcclxuICB9XHJcblxyXG4gIGluaXQoc3RhdGUpIHtcclxuICAgIHRoaXMubW9kZWwudXBkYXRlU3RhdGUoc3RhdGUpO1xyXG4gICAgdGhpcy52aWV3ID0gbmV3IEdhbWVWaWV3KHRoaXMubW9kZWwpO1xyXG4gICAgY29uc3QgdGltZSA9IG5ldyBEYXRlKCk7XHJcblxyXG4gICAgdGhpcy52aWV3LnNob3dOZXh0U2NyZWVuID0gKGFuc3dlcikgPT4ge1xyXG4gICAgICB3aW5kb3cuY2xlYXJUaW1lb3V0KHRoaXMudmlldy5tb2RlbC5zdGF0ZS50aW1lcklkKTtcclxuXHJcbiAgICAgIGlmICghYW5zd2VyKSB7XHJcbiAgICAgICAgLS1zdGF0ZS5saXZlcztcclxuICAgICAgfVxyXG4gICAgICB0aGlzLm1vZGVsLmFkZEFuc3dlcihhbnN3ZXIsIHRpbWUpO1xyXG5cclxuICAgICAgKytzdGF0ZS5sZXZlbDtcclxuICAgICAgaWYgKHRoaXMubW9kZWwuaXNDYW5QbGF5KCkpIHtcclxuICAgICAgICBBcHAuc2hvd0dhbWVTY3JlZW4oc3RhdGUpO1xyXG4gICAgICAgIHJldHVybjtcclxuICAgICAgfVxyXG4gICAgICBBcHAuc2hvd1N0YXRzU2NyZWVuKHN0YXRlKTtcclxuICAgIH07XHJcblxyXG4gICAgdGhpcy52aWV3LnBsYXllciA9IHBsYXllci5pbml0KHRoaXMudmlldyk7XHJcbiAgICB0aGlzLnZpZXcuZmlyc3RMZXZlbFR5cGUgPSBmaXJzdExldmVsVHlwZS5pbml0KHRoaXMudmlldyk7XHJcbiAgICB0aGlzLnZpZXcuc2Vjb25kTGV2ZWxUeXBlID0gc2Vjb25kTGV2ZWxUeXBlLmluaXQodGhpcy52aWV3KTtcclxuICAgIHRoaXMudmlldy50aGlyZExldmVsVHlwZSA9IHRoaXJkTGV2ZWxUeXBlLmluaXQodGhpcy52aWV3KTtcclxuXHJcbiAgICBVdGlscy5kaXNwbGF5U2NyZWVuKHRoaXMudmlldy5lbGVtZW50KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IEdhbWVTY3JlZW47XHJcbiIsImltcG9ydCB7YW1vdW50UG9pbnRzfSBmcm9tICcuLi9kYXRhL2RhdGEnO1xyXG5pbXBvcnQgVXRpbHMgZnJvbSAnLi91dGlscyc7XHJcblxyXG5jb25zdCBnZXRDdXJyZW50UmVzdWx0ID0gKHN0YXRlKSA9PiB7XHJcbiAgY29uc3QgY3VycmVudFJlc3VsdCA9IHtcclxuICAgIGFtb3VudENvcnJlY3RBbnN3ZXJzOiAwLFxyXG4gICAgYW1vdW50RmFzdEFuc3dlcnM6IDAsXHJcbiAgICBhbW91bnRTbG93QW5zd2VyczogMCxcclxuICAgIGFtb3VudExpdmVzTGVmdDogc3RhdGUubGl2ZXNcclxuICB9O1xyXG5cclxuICBjb25zdCBjb3VudFRvdGFsUG9pbnRzID0gKChzdW0sIGl0ZW0pID0+IHtcclxuICAgIHN3aXRjaCAoaXRlbSkge1xyXG4gICAgICBjYXNlIGBjb3JyZWN0YDpcclxuICAgICAgICArK2N1cnJlbnRSZXN1bHQuYW1vdW50Q29ycmVjdEFuc3dlcnM7XHJcbiAgICAgICAgc3VtICs9IDEwMDtcclxuICAgICAgICBicmVhaztcclxuICAgICAgY2FzZSBgZmFzdGA6XHJcbiAgICAgICAgKytjdXJyZW50UmVzdWx0LmFtb3VudENvcnJlY3RBbnN3ZXJzO1xyXG4gICAgICAgICsrY3VycmVudFJlc3VsdC5hbW91bnRGYXN0QW5zd2VycztcclxuICAgICAgICBzdW0gKz0gMTUwO1xyXG4gICAgICAgIGJyZWFrO1xyXG4gICAgICBjYXNlIGBzbG93YDpcclxuICAgICAgICArK2N1cnJlbnRSZXN1bHQuYW1vdW50Q29ycmVjdEFuc3dlcnM7XHJcbiAgICAgICAgKytjdXJyZW50UmVzdWx0LmFtb3VudFNsb3dBbnN3ZXJzO1xyXG4gICAgICAgIHN1bSArPSA1MDtcclxuICAgICAgICBicmVhaztcclxuICAgIH1cclxuICAgIHJldHVybiBzdW07XHJcbiAgfSk7XHJcblxyXG4gIGxldCB0b3RhbFBvaW50cyA9IHN0YXRlLmFuc3dlcnMucmVkdWNlKGNvdW50VG90YWxQb2ludHMsIDApICtcclxuICAgICAgY3VycmVudFJlc3VsdC5hbW91bnRMaXZlc0xlZnQgKiA1MDtcclxuXHJcbiAgcmV0dXJuIHtcclxuICAgIHRvdGFsUG9pbnRzLFxyXG5cclxuICAgIGNvcnJlY3RBbnN3ZXJzOiB7XHJcbiAgICAgIHBvaW50c1BlclVuaXQ6IGFtb3VudFBvaW50cy5DT1JSRUNUX0FOU1dFUixcclxuICAgICAgYW1vdW50OiBjdXJyZW50UmVzdWx0LmFtb3VudENvcnJlY3RBbnN3ZXJzLFxyXG4gICAgICBwb2ludHM6IFV0aWxzLmNvdW50T2ZQb2ludHMoY3VycmVudFJlc3VsdC5hbW91bnRDb3JyZWN0QW5zd2VycywgYW1vdW50UG9pbnRzLkNPUlJFQ1RfQU5TV0VSKVxyXG4gICAgfSxcclxuXHJcbiAgICBib251c2VzQW5kUGVuYWx0aWVzOiBbXHJcbiAgICAgIHtcclxuICAgICAgICB0aXRsZTogYNCR0L7QvdGD0YEg0LfQsCDRgdC60L7RgNC+0YHRgtGMYCxcclxuICAgICAgICB0eXBlOiBgZmFzdGAsXHJcbiAgICAgICAgcG9pbnRzUGVyVW5pdDogYW1vdW50UG9pbnRzLkJPTlVTX0ZPUl9GQVNUX0FOU1dFUixcclxuICAgICAgICBhbW91bnQ6IGN1cnJlbnRSZXN1bHQuYW1vdW50RmFzdEFuc3dlcnMsXHJcbiAgICAgICAgcG9pbnRzOiBVdGlscy5jb3VudE9mUG9pbnRzKGN1cnJlbnRSZXN1bHQuYW1vdW50RmFzdEFuc3dlcnMsIGFtb3VudFBvaW50cy5CT05VU19GT1JfRkFTVF9BTlNXRVIpXHJcbiAgICAgIH0sXHJcbiAgICAgIHtcclxuICAgICAgICB0aXRsZTogYNCR0L7QvdGD0YEg0LfQsCDQttC40LfQvdC4YCxcclxuICAgICAgICB0eXBlOiBgYWxpdmVgLFxyXG4gICAgICAgIHBvaW50c1BlclVuaXQ6IGFtb3VudFBvaW50cy5CT05VU19GT1JfTElWRVNfTEVGVCxcclxuICAgICAgICBhbW91bnQ6IGN1cnJlbnRSZXN1bHQuYW1vdW50TGl2ZXNMZWZ0LFxyXG4gICAgICAgIHBvaW50czogVXRpbHMuY291bnRPZlBvaW50cyhjdXJyZW50UmVzdWx0LmFtb3VudExpdmVzTGVmdCwgYW1vdW50UG9pbnRzLkJPTlVTX0ZPUl9MSVZFU19MRUZUKVxyXG4gICAgICB9LFxyXG4gICAgICB7XHJcbiAgICAgICAgdGl0bGU6IGDQqNGC0YDQsNGEINC30LAg0LzQtdC00LvQuNGC0LXQu9GM0L3QvtGB0YLRjGAsXHJcbiAgICAgICAgdHlwZTogYHNsb3dgLFxyXG4gICAgICAgIHBvaW50c1BlclVuaXQ6IC1hbW91bnRQb2ludHMuQk9OVVNfRk9SX1NMT1dfQU5TV0VSLFxyXG4gICAgICAgIGFtb3VudDogY3VycmVudFJlc3VsdC5hbW91bnRTbG93QW5zd2VycyxcclxuICAgICAgICBwb2ludHM6IFV0aWxzLmNvdW50T2ZQb2ludHMoY3VycmVudFJlc3VsdC5hbW91bnRTbG93QW5zd2VycywgYW1vdW50UG9pbnRzLkJPTlVTX0ZPUl9TTE9XX0FOU1dFUilcclxuICAgICAgfVxyXG4gICAgXVxyXG4gIH07XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBnZXRDdXJyZW50UmVzdWx0O1xyXG4iLCJpbXBvcnQgQWJzdHJhY3RWaWV3IGZyb20gJy4vYWJzdHJhY3Qtdmlldyc7XHJcbmltcG9ydCBkaXNwbGF5SGVhZGVyIGZyb20gJy4uL2xpYi9kaXNwbGF5LWhlYWRlcic7XHJcbmltcG9ydCBVdGlscyBmcm9tICcuLi9saWIvdXRpbHMnO1xyXG5pbXBvcnQge0dhbWVQYXJhbWV0ZXJzfSBmcm9tICcuLi9kYXRhL2RhdGEnO1xyXG5pbXBvcnQgZ2V0Q3VycmVudFJlc3VsdCBmcm9tICcuLi9saWIvZ2V0LWN1cnJlbnQtcmVzdWx0JztcclxuXHJcbmNsYXNzIFJlc3VsdFZpZXcgZXh0ZW5kcyBBYnN0cmFjdFZpZXcge1xyXG4gIGNvbnN0cnVjdG9yKGRhdGEpIHtcclxuICAgIHN1cGVyKCk7XHJcbiAgICB0aGlzLmRhdGEgPSBkYXRhLnJldmVyc2UoKTtcclxuICB9XHJcblxyXG4gIGdldCB0ZW1wbGF0ZSgpIHtcclxuICAgIHJldHVybiAoXHJcbiAgICAgIGA8aGVhZGVyIGNsYXNzPVwiaGVhZGVyXCI+PC9oZWFkZXI+XHJcbiAgICAgIDxkaXYgY2xhc3M9XCJyZXN1bHRcIj5cclxuICAgICAgICAke3RoaXMudGVtcGxhdGVIZWFkZXIodGhpcy5kYXRhWzBdKX1cclxuICAgICAgICAke3RoaXMuZGF0YS5tYXAoKGl0ZW0sIGluZGV4KSA9PiB0aGlzLnRlbXBsYXRlUmVzdWx0VGFibGUoaXRlbSwgaW5kZXggKyAxKSkuam9pbihgIGApfVxyXG4gICAgICA8L2Rpdj5gXHJcbiAgICApO1xyXG4gIH1cclxuXHJcbiAgaXNXaW4oc3RhdGUpIHtcclxuICAgIHJldHVybiAoXHJcbiAgICAgIHN0YXRlLmFuc3dlcnMubGVuZ3RoID09PSBHYW1lUGFyYW1ldGVycy5OVU1CRVJfQU5TV0VSUyAmJlxyXG4gICAgICBzdGF0ZS5saXZlcyA+PSBHYW1lUGFyYW1ldGVycy5NSU5fQ09VTlRfTElWRVNcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICB0ZW1wbGF0ZUhlYWRlcihzdGF0ZSkge1xyXG4gICAgaWYgKHRoaXMuaXNXaW4oc3RhdGUpKSB7XHJcbiAgICAgIHJldHVybiBgPGgxPtCf0L7QsdC10LTQsCE8L2gxPmA7XHJcbiAgICB9XHJcbiAgICByZXR1cm4gYDxoMT7Qn9C+0YDQsNC20LXQvdC40LUhPC9oMT5gO1xyXG4gIH1cclxuXHJcbiAgdGVtcGxhdGVSZXN1bHRUYWJsZShzdGF0ZSwgaW5kZXgpIHtcclxuICAgIGlmICghdGhpcy5pc1dpbihzdGF0ZSkpIHtcclxuICAgICAgcmV0dXJuIChcclxuICAgICAgICBgPHRhYmxlIGNsYXNzPVwicmVzdWx0X190YWJsZVwiPlxyXG4gICAgICAgICAgPHRyPlxyXG4gICAgICAgICAgICA8dGQgY2xhc3M9XCJyZXN1bHRfX251bWJlclwiPiR7aW5kZXh9LjwvdGQ+XHJcbiAgICAgICAgICAgIDx0ZD5cclxuICAgICAgICAgICAgICAke1V0aWxzLmdldFN0YXRzKHN0YXRlLmFuc3dlcnMpfVxyXG4gICAgICAgICAgICA8L3RkPlxyXG4gICAgICAgICAgICA8dGQgY2xhc3M9XCJyZXN1bHRfX3RvdGFsXCI+PC90ZD5cclxuICAgICAgICAgICAgPHRkIGNsYXNzPVwicmVzdWx0X190b3RhbCAgcmVzdWx0X190b3RhbC0tZmluYWxcIj5mYWlsPC90ZD5cclxuICAgICAgICAgIDwvdHI+XHJcbiAgICAgICAgPC90YWJsZT5gXHJcbiAgICAgICk7XHJcbiAgICB9XHJcblxyXG4gICAgY29uc3QgY3VycmVudFJlc3VsdCA9IGdldEN1cnJlbnRSZXN1bHQoc3RhdGUpO1xyXG5cclxuICAgIGNvbnN0IHJvd3MgPSBjdXJyZW50UmVzdWx0LmJvbnVzZXNBbmRQZW5hbHRpZXMubWFwKChpdGVtKSA9PiB0aGlzLmdldFRlbXBsYXRlUmVzdWx0Um93KGl0ZW0pKTtcclxuXHJcbiAgICByZXR1cm4gKFxyXG4gICAgICBgPHRhYmxlIGNsYXNzPVwicmVzdWx0X190YWJsZVwiPlxyXG4gICAgICAgIDx0cj5cclxuICAgICAgICAgIDx0ZCBjbGFzcz1cInJlc3VsdF9fbnVtYmVyXCI+JHtpbmRleH0uPC90ZD5cclxuICAgICAgICAgIDx0ZCBjb2xzcGFuPVwiMlwiPlxyXG4gICAgICAgICAgICAke1V0aWxzLmdldFN0YXRzKHN0YXRlLmFuc3dlcnMpfVxyXG4gICAgICAgICAgPC90ZD5cclxuICAgICAgICAgIDx0ZCBjbGFzcz1cInJlc3VsdF9fcG9pbnRzXCI+w5cmbmJzcDske2N1cnJlbnRSZXN1bHQuY29ycmVjdEFuc3dlcnMucG9pbnRzUGVyVW5pdH08L3RkPlxyXG4gICAgICAgICAgPHRkIGNsYXNzPVwicmVzdWx0X190b3RhbFwiPiR7Y3VycmVudFJlc3VsdC5jb3JyZWN0QW5zd2Vycy5wb2ludHN9PC90ZD5cclxuICAgICAgICA8L3RyPlxyXG4gICAgICAgICR7cm93cy5qb2luKGAgYCl9XHJcbiAgICAgICAgPHRyPlxyXG4gICAgICAgICAgPHRkIGNvbHNwYW49XCI1XCIgY2xhc3M9XCJyZXN1bHRfX3RvdGFsICByZXN1bHRfX3RvdGFsLS1maW5hbFwiPiR7Y3VycmVudFJlc3VsdC50b3RhbFBvaW50c308L3RkPlxyXG4gICAgICAgIDwvdHI+XHJcbiAgICAgIDwvdGFibGU+YFxyXG4gICAgKTtcclxuICB9XHJcblxyXG4gIGdldFRlbXBsYXRlUmVzdWx0Um93KGl0ZW0pIHtcclxuICAgIGlmICghaXRlbS5hbW91bnQpIHtcclxuICAgICAgcmV0dXJuIGBgO1xyXG4gICAgfVxyXG4gICAgcmV0dXJuIChcclxuICAgICAgYDx0cj5cclxuICAgICAgICA8dGQ+PC90ZD5cclxuICAgICAgICA8dGQgY2xhc3M9XCJyZXN1bHRfX2V4dHJhXCI+JHtpdGVtLnRpdGxlfTo8L3RkPlxyXG4gICAgICAgIDx0ZCBjbGFzcz1cInJlc3VsdF9fZXh0cmFcIj4ke2l0ZW0uYW1vdW50fSZuYnNwOzxzcGFuIGNsYXNzPVwic3RhdHNfX3Jlc3VsdCBzdGF0c19fcmVzdWx0LS0ke2l0ZW0udHlwZX1cIj48L3NwYW4+PC90ZD5cclxuICAgICAgICA8dGQgY2xhc3M9XCJyZXN1bHRfX3BvaW50c1wiPsOXJm5ic3A7JHtpdGVtLnBvaW50c1BlclVuaXR9PC90ZD5cclxuICAgICAgICA8dGQgY2xhc3M9XCJyZXN1bHRfX3RvdGFsXCI+JHtpdGVtLnBvaW50c308L3RkPlxyXG4gICAgICA8L3RyPmBcclxuICAgICk7XHJcbiAgfVxyXG5cclxuICBiaW5kKGVsZW1lbnQpIHtcclxuICAgIHRoaXMuaGVhZGVyID0gZWxlbWVudC5xdWVyeVNlbGVjdG9yKGAuaGVhZGVyYCk7XHJcbiAgICBkaXNwbGF5SGVhZGVyKHRoaXMpO1xyXG4gIH1cclxufVxyXG5cclxuZXhwb3J0IGRlZmF1bHQgUmVzdWx0VmlldztcclxuIiwiaW1wb3J0IFJlc3VsdFZpZXcgZnJvbSAnLi4vdmlld3MvcmVzdWx0LXZlaXcnO1xyXG5pbXBvcnQgVXRpbHMgZnJvbSAnLi4vbGliL3V0aWxzJztcclxuaW1wb3J0IHBsYXllciBmcm9tICcuL3BsYXllci1zY3JlZW4nO1xyXG5cclxuY2xhc3MgUmVzdWx0U2NyZWVuIHtcclxuICBpbml0KHN0YXRlKSB7XHJcbiAgICBjb25zdCB2aWV3ID0gbmV3IFJlc3VsdFZpZXcoc3RhdGUpO1xyXG4gICAgdmlldy5wbGF5ZXIgPSBwbGF5ZXIuaW5pdCgpO1xyXG5cclxuICAgIFV0aWxzLmRpc3BsYXlTY3JlZW4odmlldy5lbGVtZW50KTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IG5ldyBSZXN1bHRTY3JlZW4oKTtcclxuIiwiY29uc3QgVHlwZU9mTGV2ZWxzID0ge1xyXG4gIEZJUlNUOiBgdHdvLW9mLXR3b2AsXHJcbiAgU0VDT05EOiBgdGluZGVyLWxpa2VgLFxyXG4gIFRISVJEOiBgb25lLW9mLXRocmVlYFxyXG59O1xyXG5cclxuY29uc3QgZ2V0UGFyYW1ldGVyc09mSW1hZ2VzID0gKGxldmVsKSA9PiB7XHJcbiAgcmV0dXJuIGxldmVsLmFuc3dlcnMubWFwKChpdGVtKSA9PiB7XHJcbiAgICBpZiAoaXRlbS50eXBlID09PSBgcGFpbnRpbmdgKSB7XHJcbiAgICAgIGl0ZW0udHlwZSA9IGBwYWludGA7XHJcbiAgICB9XHJcbiAgICByZXR1cm4ge1xyXG4gICAgICB1cmw6IGl0ZW0uaW1hZ2UudXJsLFxyXG4gICAgICB0eXBlOiBpdGVtLnR5cGVcclxuICAgIH07XHJcbiAgfSk7XHJcbn07XHJcblxyXG5jb25zdCBhZGFwdEZpcnN0TGV2ZWxUeXBlID0gKGxldmVsKSA9PiB7XHJcbiAgcmV0dXJuIHtcclxuICAgIHF1ZXN0aW9uOiBsZXZlbC5xdWVzdGlvbixcclxuICAgIHR5cGU6IGBmaXJzdGAsXHJcbiAgICBpbWFnZXM6IGdldFBhcmFtZXRlcnNPZkltYWdlcyhsZXZlbCwgYHRoaXJkYClcclxuICB9O1xyXG59O1xyXG5cclxuY29uc3QgYWRhcHRTZWNvbmRMZXZlbFR5cGUgPSAobGV2ZWwpID0+IHtcclxuICByZXR1cm4ge1xyXG4gICAgcXVlc3Rpb246IGxldmVsLnF1ZXN0aW9uLFxyXG4gICAgdHlwZTogYHNlY29uZGAsXHJcbiAgICBpbWFnZTogZ2V0UGFyYW1ldGVyc09mSW1hZ2VzKGxldmVsKVswXVxyXG4gIH07XHJcbn07XHJcblxyXG5jb25zdCBhZGFwdFRoaXJkTGV2ZWxUeXBlID0gKGxldmVsKSA9PiB7XHJcbiAgbGV0IGFtb3VudFBhaW50ID0gMDtcclxuXHJcbiAgY29uc3QgaW1hZ2VzID0gbGV2ZWwuYW5zd2Vycy5tYXAoKGl0ZW0pID0+IHtcclxuICAgIGlmIChpdGVtLnR5cGUgPT09IGBwYWludGluZ2ApIHtcclxuICAgICAgaXRlbS50eXBlID0gYHBhaW50YDtcclxuICAgICAgKythbW91bnRQYWludDtcclxuICAgIH1cclxuICAgIHJldHVybiB7XHJcbiAgICAgIHVybDogaXRlbS5pbWFnZS51cmwsXHJcbiAgICAgIHdpZHRoOiBpdGVtLmltYWdlLndpZHRoLFxyXG4gICAgICBoZWlnaHQ6IGl0ZW0uaW1hZ2UuaGVpZ2h0LFxyXG4gICAgICB0eXBlOiBpdGVtLnR5cGVcclxuICAgIH07XHJcbiAgfSk7XHJcblxyXG4gIGxldCBhbnN3ZXIgPSBgcGFpbnRgO1xyXG4gIGlmIChhbW91bnRQYWludCA9PT0gMikge1xyXG4gICAgYW5zd2VyID0gYHBob3RvYDtcclxuICB9XHJcbiAgcmV0dXJuIHtcclxuICAgIHF1ZXN0aW9uOiBsZXZlbC5xdWVzdGlvbixcclxuICAgIGFuc3dlcixcclxuICAgIHR5cGU6IGB0aGlyZGAsXHJcbiAgICBpbWFnZXNcclxuICB9O1xyXG59O1xyXG5cclxuY29uc3QgQWRhcHRUeXBlT2ZMZXZlbHMgPSB7XHJcbiAgW1R5cGVPZkxldmVscy5GSVJTVF06IGFkYXB0Rmlyc3RMZXZlbFR5cGUsXHJcbiAgW1R5cGVPZkxldmVscy5TRUNPTkRdOiBhZGFwdFNlY29uZExldmVsVHlwZSxcclxuICBbVHlwZU9mTGV2ZWxzLlRISVJEXTogYWRhcHRUaGlyZExldmVsVHlwZVxyXG59O1xyXG5cclxuY29uc3QgYWRhcHQgPSAoZGF0YSkgPT4ge1xyXG4gIHJldHVybiBkYXRhLm1hcCgoaXRlbSkgPT4ge1xyXG4gICAgcmV0dXJuIEFkYXB0VHlwZU9mTGV2ZWxzW2l0ZW0udHlwZV0oaXRlbSk7XHJcbiAgfSk7XHJcbn07XHJcblxyXG5leHBvcnQgZGVmYXVsdCBhZGFwdDtcclxuIiwiY29uc3QgbG9hZEltYWdlID0gKHVybCkgPT4ge1xyXG4gIHJldHVybiBuZXcgUHJvbWlzZSgob25Mb2FkLCBvbkVycm9yKSA9PiB7XHJcbiAgICBjb25zdCBpbWFnZSA9IG5ldyBJbWFnZSgpO1xyXG4gICAgaW1hZ2Uub25sb2FkID0gKCkgPT4gb25Mb2FkKGltYWdlKTtcclxuICAgIGltYWdlLm9uZXJyb3IgPSAoKSA9PiBvbkVycm9yO1xyXG4gICAgaW1hZ2Uuc3JjID0gdXJsO1xyXG4gIH0pO1xyXG59O1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgbG9hZEltYWdlO1xyXG4iLCJpbXBvcnQgYWRhcHQgZnJvbSAnLi9kYXRhL2RhdGEtYWRhcHRlcic7XHJcbmltcG9ydCBsb2FkSW1hZ2UgZnJvbSAnLi9saWIvbG9hZC1pbWFnZSc7XHJcblxyXG5jb25zdCBTRVJWRVJfVVJMID0gYGh0dHBzOi8vZXMuZHVtcC5hY2FkZW15L3BpeGVsLWh1bnRlcmA7XHJcbmNvbnN0IERFRkFVTFRfTkFNRSA9IGBrdmV6YWxgO1xyXG5cclxuY2xhc3MgTG9hZGVyIHtcclxuICBzdGF0aWMgbG9hZERhdGEoKSB7XHJcbiAgICByZXR1cm4gZmV0Y2goYCR7U0VSVkVSX1VSTH0vcXVlc3Rpb25zYCkuXHJcbiAgICAgICAgdGhlbigocmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgIGlmIChyZXNwb25zZS5vaykge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGDQndC1INGD0LTQsNC70L7RgdGMINC30LDQs9GA0YPQt9C40YLRjCDQtNCw0L3QvdGL0LUg0YEg0YHQtdGA0LLQtdGA0LBgKTtcclxuICAgICAgICB9KVxyXG4gICAgICAgIC50aGVuKGFkYXB0KTtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBzYXZlUmVzdWx0KGRhdGEsIG5hbWUgPSBERUZBVUxUX05BTUUpIHtcclxuICAgIGNvbnN0IHJlcXVlc3RTZXR0aW5ncyA9IHtcclxuICAgICAgYm9keTogSlNPTi5zdHJpbmdpZnkoZGF0YSksXHJcbiAgICAgIGhlYWRlcnM6IHtcclxuICAgICAgICAnQ29udGVudC1UeXBlJzogYGFwcGxpY2F0aW9uL2pzb25gXHJcbiAgICAgIH0sXHJcbiAgICAgIG1ldGhvZDogYFBPU1RgXHJcbiAgICB9O1xyXG5cclxuICAgIHJldHVybiBmZXRjaChgJHtTRVJWRVJfVVJMfS9zdGF0cy8ke25hbWV9YCwgcmVxdWVzdFNldHRpbmdzKTtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBsb2FkUmVzdWx0KG5hbWUgPSBERUZBVUxUX05BTUUpIHtcclxuICAgIHJldHVybiBmZXRjaChgJHtTRVJWRVJfVVJMfS9zdGF0cy8ke25hbWV9YCkuXHJcbiAgICAgICAgdGhlbigocmVzcG9uc2UpID0+IHtcclxuICAgICAgICAgIGlmIChyZXNwb25zZS5vaykge1xyXG4gICAgICAgICAgICByZXR1cm4gcmVzcG9uc2UuanNvbigpO1xyXG4gICAgICAgICAgfVxyXG4gICAgICAgICAgdGhyb3cgbmV3IEVycm9yKGDQndC1INGD0LTQsNC70L7RgdGMINC30LDQs9GA0YPQt9C40YLRjCDQtNCw0L3QvdGL0LUg0YEg0YHQtdGA0LLQtdGA0LBgKTtcclxuICAgICAgICB9KTtcclxuICB9XHJcblxyXG4gIHN0YXRpYyBsb2FkRmlsZShkYXRhKSB7XHJcbiAgICBjb25zdCBMaXN0T2ZVUkxJbWFnZXMgPSBuZXcgU2V0KCk7XHJcblxyXG4gICAgZGF0YS5mb3JFYWNoKChpdGVtKSA9PiB7XHJcbiAgICAgIGlmIChpdGVtLnR5cGUgPT09IGBzZWNvbmRgKSB7XHJcbiAgICAgICAgTGlzdE9mVVJMSW1hZ2VzLmFkZChpdGVtLmltYWdlLnVybCk7XHJcbiAgICAgICAgcmV0dXJuO1xyXG4gICAgICB9XHJcblxyXG4gICAgICBpdGVtLmltYWdlcy5mb3JFYWNoKChpbWFnZSkgPT4ge1xyXG4gICAgICAgIExpc3RPZlVSTEltYWdlcy5hZGQoaW1hZ2UudXJsKTtcclxuICAgICAgfSk7XHJcbiAgICB9KTtcclxuXHJcbiAgICByZXR1cm4gUHJvbWlzZS5hbGwoWy4uLkxpc3RPZlVSTEltYWdlc10ubWFwKChpdGVtKSA9PiBsb2FkSW1hZ2UoaXRlbSkpKTtcclxuICB9XHJcbn1cclxuXHJcbmV4cG9ydCBkZWZhdWx0IExvYWRlcjtcclxuIiwiaW1wb3J0IEFic3RyYWN0VmlldyBmcm9tICcuLi92aWV3cy9hYnN0cmFjdC12aWV3JztcbmltcG9ydCBVdGlscyBmcm9tICcuLi9saWIvdXRpbHMnO1xuXG5jbGFzcyBFcnJvclNjcmVlbiBleHRlbmRzIEFic3RyYWN0VmlldyB7XG4gIGNvbnN0cnVjdG9yKG1lc3NhZ2UpIHtcbiAgICBzdXBlcigpO1xuXG4gICAgdGhpcy5tZXNzYWdlID0gbWVzc2FnZTtcbiAgfVxuXG4gIGdldCB0ZW1wbGF0ZSgpIHtcbiAgICByZXR1cm4gKFxuICAgICAgYDxkaXYgY2xhc3M9XCJlcnJvci1tZXNzYWdlXCI+JHt0aGlzLm1lc3NhZ2V9PC9kaXY+YFxuICAgICk7XG4gIH1cblxuICBzdGF0aWMgc2hvdyhtZXNzYWdlKSB7XG4gICAgY29uc3QgZXJyb3IgPSBuZXcgRXJyb3JTY3JlZW4obWVzc2FnZSk7XG4gICAgVXRpbHMuZGlzcGxheUVsZW1lbnQoZXJyb3IuZWxlbWVudCwgZG9jdW1lbnQuYm9keSwgdHJ1ZSk7XG4gIH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgRXJyb3JTY3JlZW47XG4iLCJpbXBvcnQgQWJzdHJhY3RWaWV3IGZyb20gJy4uL3ZpZXdzL2Fic3RyYWN0LXZpZXcnO1xuaW1wb3J0IFV0aWxzIGZyb20gJy4uL2xpYi91dGlscyc7XG5cbmNsYXNzIFNwbGFzaFNjcmVlbiBleHRlbmRzIEFic3RyYWN0VmlldyB7XG4gIGNvbnN0cnVjdG9yKCkge1xuICAgIHN1cGVyKCk7XG4gIH1cblxuICBnZXQgdGVtcGxhdGUoKSB7XG4gICAgcmV0dXJuIChcbiAgICAgIGA8c3ZnIHhtbG5zPVwiaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmdcIiBjbGFzcz1cInNwbGFzaFwiIHZpZXdCb3g9XCIwIDAgNzgwIDc4MFwiPlxuICAgICAgICAgIDxjaXJjbGVcbiAgICAgICAgICAgIGN4PVwiMzkwXCIgY3k9XCIzOTBcIiByPVwiNjBcIlxuICAgICAgICAgICAgY2xhc3M9XCJzcGxhc2gtbGluZVwiXG4gICAgICAgICAgICBzdHlsZT1cInRyYW5zZm9ybTogcm90YXRlKC05MGRlZyk7IHRyYW5zZm9ybS1vcmlnaW46IGNlbnRlclwiPjwvY2lyY2xlPlxuICAgICAgICA8L3N2Zz5gXG4gICAgKTtcbiAgfVxuXG4gIHN0YXJ0KCkge1xuICAgIFV0aWxzLmRpc3BsYXlTY3JlZW4odGhpcy5lbGVtZW50KTtcbiAgfVxufVxuXG5leHBvcnQgZGVmYXVsdCBuZXcgU3BsYXNoU2NyZWVuKCk7XG4iLCJpbXBvcnQgZ3JlZXRpbmdTY3JlZW4gZnJvbSAnLi9zY3JlZW5zL2dyZWV0aW5nLXNjcmVlbic7XHJcbmltcG9ydCBydWxlc1NjcmVlbiBmcm9tICcuL3NjcmVlbnMvcnVsZXMtc2NyZWVuJztcclxuaW1wb3J0IEdhbWVTY3JlZW4gZnJvbSAnLi9zY3JlZW5zL2dhbWUtc2NyZWVuJztcclxuaW1wb3J0IHJlc3VsdFNjcmVlbiBmcm9tICcuL3NjcmVlbnMvcmVzdWx0LXNjcmVlbic7XHJcbmltcG9ydCBMb2FkZXIgZnJvbSAnLi9sb2FkZXInO1xyXG5pbXBvcnQgZXJyb3IgZnJvbSAnLi9zY3JlZW5zL2Vycm9yLXNjcmVlbic7XHJcbmltcG9ydCBzcGxhc2ggZnJvbSAnLi9zY3JlZW5zL3NwbGFzaC1zY3JlZW4nO1xyXG5cclxuY29uc3QgQ29udHJhbGxlcklkID0ge1xyXG4gIEdSRUVUSU5HOiBgYCxcclxuICBSVUxFUzogYHJ1bGVzYCxcclxuICBHQU1FOiBgZ2FtZWAsXHJcbiAgU1RBVFM6IGBzdGF0c2BcclxufTtcclxuXHJcbmNsYXNzIEFwcGxpY2F0aW9uIHtcclxuICBzdGF0aWMgaW5pdChpbWFnZXMpIHtcclxuICAgIEFwcGxpY2F0aW9uLnJvdXRlcyA9IHtcclxuICAgICAgW0NvbnRyYWxsZXJJZC5HUkVFVElOR106IGdyZWV0aW5nU2NyZWVuLFxyXG4gICAgICBbQ29udHJhbGxlcklkLlJVTEVTXTogcnVsZXNTY3JlZW4sXHJcbiAgICAgIFtDb250cmFsbGVySWQuR0FNRV06IG5ldyBHYW1lU2NyZWVuKHF1ZXN0LCBpbWFnZXMpLFxyXG4gICAgICBbQ29udHJhbGxlcklkLlJFU1VMVF06IHJlc3VsdFNjcmVlblxyXG4gICAgfTtcclxuICAgIEFwcGxpY2F0aW9uLnNob3dHcmVldGluZ1NjcmVlbigpO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIHNob3dHcmVldGluZ1NjcmVlbigpIHtcclxuICAgIHRoaXMucm91dGVzW0NvbnRyYWxsZXJJZC5HUkVFVElOR10uaW5pdCgpO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIHNob3dSdWxlc1NjcmVlbigpIHtcclxuICAgIHRoaXMucm91dGVzW0NvbnRyYWxsZXJJZC5SVUxFU10uaW5pdCgpO1xyXG4gIH1cclxuXHJcbiAgc3RhdGljIHNob3dHYW1lU2NyZWVuKHN0YXRlKSB7XHJcbiAgICB0aGlzLnJvdXRlc1tDb250cmFsbGVySWQuR0FNRV0uaW5pdChzdGF0ZSk7XHJcbiAgfVxyXG5cclxuICBzdGF0aWMgc2hvd1N0YXRzU2NyZWVuKHN0YXRlKSB7XHJcbiAgICBzcGxhc2guc3RhcnQoKTtcclxuICAgIExvYWRlci5zYXZlUmVzdWx0KHN0YXRlLCBzdGF0ZS5uYW1lKS5cclxuICAgICAgICB0aGVuKCgpID0+IExvYWRlci5sb2FkUmVzdWx0KHN0YXRlLm5hbWUpKS5cclxuICAgICAgICB0aGVuKHRoaXMucm91dGVzW0NvbnRyYWxsZXJJZC5SRVNVTFRdLmluaXQpO1xyXG4gIH1cclxufVxyXG5cclxubGV0IHF1ZXN0ID0ge307XHJcblxyXG5jb25zdCBsb2FkRmlsZSA9IChkYXRhKSA9PiB7XHJcbiAgcXVlc3QgPSBkYXRhO1xyXG4gIHJldHVybiBMb2FkZXIubG9hZEZpbGUoZGF0YSk7XHJcbn07XHJcblxyXG5Mb2FkZXIubG9hZERhdGEoKVxyXG4gICAgLnRoZW4obG9hZEZpbGUpXHJcbiAgICAudGhlbihBcHBsaWNhdGlvbi5pbml0KVxyXG4gICAgLmNhdGNoKGVycm9yLnNob3cpO1xyXG5cclxuZXhwb3J0IGRlZmF1bHQgQXBwbGljYXRpb247XHJcbiJdLCJuYW1lcyI6WyJBcHAiLCJJTUFHRV9QQVJBTUVURVJTIiwiVHlwZU9mTGV2ZWxzIiwiZXJyb3IiXSwibWFwcGluZ3MiOiI7OztBQUFBLE1BQU0sWUFBWSxHQUFHO0VBQ25CLEtBQUssRUFBRSxDQUFDO0VBQ1IsSUFBSSxFQUFFLEVBQUU7RUFDUixLQUFLLEVBQUUsQ0FBQztDQUNULENBQUM7O0FBRUYsTUFBTSxjQUFjLEdBQUc7RUFDckIsZUFBZSxFQUFFLENBQUM7RUFDbEIsY0FBYyxFQUFFLENBQUM7RUFDakIsY0FBYyxFQUFFLEVBQUU7RUFDbEIsNkJBQTZCLEVBQUUsSUFBSTtDQUNwQyxDQUFDOztBQUVGLE1BQU0sWUFBWSxHQUFHO0VBQ25CLGNBQWMsRUFBRSxHQUFHO0VBQ25CLHFCQUFxQixFQUFFLEVBQUU7RUFDekIscUJBQXFCLEVBQUUsQ0FBQyxFQUFFO0VBQzFCLG9CQUFvQixFQUFFLEVBQUU7Q0FDekI7O0FDaEJELE1BQU0sSUFBSSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDOztBQUVoRCxNQUFNLEtBQUssQ0FBQztFQUNWLE9BQU8sc0JBQXNCLENBQUMsTUFBTSxFQUFFO0lBQ3BDLE1BQU0sUUFBUSxHQUFHLFFBQVEsQ0FBQyxhQUFhLENBQUMsQ0FBQyxRQUFRLENBQUMsQ0FBQyxDQUFDO0lBQ3BELFFBQVEsQ0FBQyxTQUFTLEdBQUcsTUFBTSxDQUFDO0lBQzVCLE9BQU8sUUFBUSxDQUFDLE9BQU8sQ0FBQztHQUN6Qjs7RUFFRCxPQUFPLFlBQVksQ0FBQyxNQUFNLEVBQUU7SUFDMUIsT0FBTyxNQUFNLENBQUMsVUFBVSxFQUFFO01BQ3hCLE1BQU0sQ0FBQyxXQUFXLENBQUMsTUFBTSxDQUFDLFVBQVUsQ0FBQyxDQUFDO0tBQ3ZDO0dBQ0Y7O0VBRUQsT0FBTyxjQUFjLENBQUMsVUFBVSxFQUFFLE1BQU0sRUFBRSxLQUFLLEdBQUcsS0FBSyxFQUFFO0lBQ3ZELElBQUksS0FBSyxFQUFFO01BQ1QsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUMzQjtJQUNELElBQUksTUFBTSxDQUFDLGlCQUFpQixFQUFFO01BQzVCLE1BQU0sQ0FBQyxZQUFZLENBQUMsVUFBVSxFQUFFLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQyxDQUFDO01BQzFELE9BQU87S0FDUjtJQUNELE1BQU0sQ0FBQyxXQUFXLENBQUMsVUFBVSxDQUFDLENBQUM7R0FDaEM7O0VBRUQsT0FBTyxhQUFhLENBQUMsVUFBVSxFQUFFO0lBQy9CLElBQUksQ0FBQyxjQUFjLENBQUMsVUFBVSxFQUFFLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztHQUM3Qzs7RUFFRCxPQUFPLFFBQVEsQ0FBQyxLQUFLLEVBQUUsSUFBSSxFQUFFO0lBQzNCLE9BQU8sSUFBSSxDQUFDLEtBQUssQ0FBQyxDQUFDO0dBQ3BCOztFQUVELE9BQU8sUUFBUSxDQUFDLFdBQVcsRUFBRTtJQUMzQixNQUFNLEtBQUssR0FBRyxDQUFDLENBQUMsa0JBQWtCLENBQUMsQ0FBQyxDQUFDO0lBQ3JDLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEtBQUs7TUFDNUIsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLHdDQUF3QyxFQUFFLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0tBQ3RFLENBQUMsQ0FBQzs7SUFFSCxNQUFNLG9CQUFvQixHQUFHLGNBQWMsQ0FBQyxjQUFjLEdBQUcsV0FBVyxDQUFDLE1BQU0sQ0FBQztJQUNoRixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsb0JBQW9CLEVBQUUsQ0FBQyxFQUFFLEVBQUU7TUFDN0MsS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLHNEQUFzRCxDQUFDLENBQUMsQ0FBQztLQUN0RTtJQUNELEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxDQUFDO0lBQ3BCLE9BQU8sS0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7R0FDeEI7O0VBRUQsT0FBTyxhQUFhLENBQUMsTUFBTSxFQUFFLE1BQU0sRUFBRTtJQUNuQyxPQUFPLE1BQU0sR0FBRyxNQUFNLENBQUM7R0FDeEI7O0VBRUQsT0FBTyxNQUFNLENBQUMsS0FBSyxFQUFFLGlCQUFpQixFQUFFO0lBQ3RDLE1BQU0sVUFBVSxHQUFHLEtBQUssQ0FBQyxLQUFLLEdBQUcsS0FBSyxDQUFDLE1BQU0sQ0FBQzs7SUFFOUMsSUFBSSxRQUFRLEdBQUcsaUJBQWlCLENBQUMsS0FBSyxDQUFDO0lBQ3ZDLElBQUksU0FBUyxHQUFHLFFBQVEsR0FBRyxVQUFVLENBQUM7SUFDdEMsSUFBSSxTQUFTLElBQUksaUJBQWlCLENBQUMsTUFBTSxFQUFFO01BQ3pDLE9BQU87UUFDTCxLQUFLLEVBQUUsUUFBUTtRQUNmLE1BQU0sRUFBRSxTQUFTO09BQ2xCLENBQUM7S0FDSDs7SUFFRCxTQUFTLEdBQUcsaUJBQWlCLENBQUMsTUFBTSxDQUFDO0lBQ3JDLFFBQVEsR0FBRyxTQUFTLEdBQUcsVUFBVSxDQUFDO0lBQ2xDLE9BQU87TUFDTCxLQUFLLEVBQUUsUUFBUTtNQUNmLE1BQU0sRUFBRSxTQUFTO0tBQ2xCLENBQUM7R0FDSDs7RUFFRCxPQUFPLGtCQUFrQixDQUFDLE1BQU0sRUFBRSxHQUFHLEVBQUU7SUFDckMsTUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssS0FBSyxLQUFLLENBQUMsR0FBRyxLQUFLLEdBQUcsQ0FBQyxDQUFDO0lBQzlELE9BQU87TUFDTCxLQUFLLEVBQUUsV0FBVyxDQUFDLEtBQUs7TUFDeEIsTUFBTSxFQUFFLFdBQVcsQ0FBQyxNQUFNO0tBQzNCLENBQUM7R0FDSDtDQUNGOztBQy9FRCxNQUFNLFlBQVksQ0FBQztFQUNqQixJQUFJLFFBQVEsR0FBRztJQUNiLE1BQU0sSUFBSSxLQUFLLENBQUMsQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDLENBQUM7R0FDMUQ7O0VBRUQsSUFBSSxPQUFPLEdBQUc7SUFDWixJQUFJLENBQUMsSUFBSSxDQUFDLFFBQVEsRUFBRTtNQUNsQixJQUFJLENBQUMsUUFBUSxHQUFHLElBQUksQ0FBQyxNQUFNLEVBQUUsQ0FBQztLQUMvQjtJQUNELE1BQU0sT0FBTyxHQUFHLElBQUksQ0FBQyxRQUFRLENBQUMsU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDO0lBQzlDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7SUFDbkIsT0FBTyxPQUFPLENBQUM7R0FDaEI7O0VBRUQsSUFBSSxHQUFHOztHQUVOOztFQUVELE1BQU0sR0FBRztJQUNQLE9BQU8sS0FBSyxDQUFDLHNCQUFzQixDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsQ0FBQztHQUNwRDs7Q0FFRjs7QUN0QkQsTUFBTSxZQUFZLFNBQVMsWUFBWSxDQUFDO0VBQ3RDLFdBQVcsR0FBRztJQUNaLEtBQUssRUFBRSxDQUFDO0dBQ1Q7O0VBRUQsSUFBSSxRQUFRLEdBQUc7SUFDYjtNQUNFLENBQUM7Ozs7Ozs7Ozs7OztZQVlLLENBQUM7TUFDUDtHQUNIOztFQUVELElBQUksQ0FBQyxPQUFPLEVBQUU7SUFDWixNQUFNLGNBQWMsR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDO0lBQ3BFLGNBQWMsQ0FBQyxPQUFPLEdBQUcsQ0FBQyxHQUFHLEtBQUssSUFBSSxDQUFDLGVBQWUsQ0FBQyxHQUFHLENBQUMsQ0FBQzs7SUFFNUQsTUFBTSxRQUFRLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLFNBQVMsQ0FBQyxDQUFDLENBQUM7SUFDcEQsTUFBTSxDQUFDLFVBQVUsQ0FBQyxNQUFNO01BQ3RCLFFBQVEsQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztLQUN6QyxFQUFFLEVBQUUsQ0FBQyxDQUFDO0dBQ1I7Q0FDRjs7QUM5QkQsTUFBTSxjQUFjLENBQUM7RUFDbkIsV0FBVyxHQUFHO0lBQ1osSUFBSSxDQUFDLElBQUksR0FBRyxJQUFJLFlBQVksRUFBRSxDQUFDO0dBQ2hDOztFQUVELElBQUksR0FBRztJQUNMLElBQUksQ0FBQyxJQUFJLENBQUMsZUFBZSxHQUFHLE1BQU07TUFDaENBLFdBQUcsQ0FBQyxlQUFlLEVBQUUsQ0FBQztLQUN2QixDQUFDOztJQUVGLEtBQUssQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztHQUN4QztDQUNGOztBQUVELHFCQUFlLElBQUksY0FBYyxFQUFFLENBQUM7O0FDZnBDLE1BQU0sZ0JBQWdCLEdBQUc7RUFDdkIsS0FBSyxFQUFFLEdBQUc7RUFDVixNQUFNLEVBQUUsR0FBRztDQUNaLENBQUM7O0FBRUYsTUFBTSxrQkFBa0IsU0FBUyxZQUFZLENBQUM7RUFDNUMsV0FBVyxDQUFDLFFBQVEsRUFBRTtJQUNwQixLQUFLLEVBQUUsQ0FBQzs7SUFFUixJQUFJLENBQUMsYUFBYSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFDO0lBQzNELElBQUksQ0FBQyxZQUFZLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUM7SUFDaEQsSUFBSSxDQUFDLFlBQVksR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztHQUNyRTs7RUFFRCxJQUFJLFFBQVEsR0FBRztJQUNiO01BQ0UsQ0FBQyxzQkFBc0IsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQzs7UUFFbEQsRUFBRSxJQUFJLENBQUMsbUJBQW1CLENBQUM7YUFDdEIsQ0FBQztNQUNSO0dBQ0g7O0VBRUQsY0FBYyxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUU7SUFDekIsTUFBTSxlQUFlLEdBQUcsS0FBSyxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDekUsTUFBTSxrQkFBa0IsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLGVBQWUsRUFBRSxnQkFBZ0IsQ0FBQyxDQUFDOztJQUUzRTtNQUNFLENBQUM7a0JBQ1csRUFBRSxHQUFHLENBQUMsY0FBYyxFQUFFLEtBQUssR0FBRyxDQUFDLENBQUMsU0FBUyxFQUFFLGtCQUFrQixDQUFDLEtBQUssQ0FBQyxVQUFVLEVBQUUsa0JBQWtCLENBQUMsTUFBTSxDQUFDOzsrQkFFN0YsRUFBRSxLQUFLLEdBQUcsQ0FBQyxDQUFDOzs7OytCQUlaLEVBQUUsS0FBSyxHQUFHLENBQUMsQ0FBQzs7O1lBRy9CLENBQUM7TUFDUDtHQUNIOztFQUVELElBQUksbUJBQW1CLEdBQUc7SUFDeEIsT0FBTyxJQUFJLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEVBQUUsS0FBSyxLQUFLO01BQ25ELE9BQU8sSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsR0FBRyxFQUFFLEtBQUssQ0FBQyxDQUFDO0tBQzdDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO0dBQ2Q7O0VBRUQsSUFBSSxDQUFDLE9BQU8sRUFBRTtJQUNaLE1BQU0sSUFBSSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDOztJQUVyRCxNQUFNLFlBQVksR0FBRyxJQUFJLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUM7SUFDbEUsQ0FBQyxHQUFHLFlBQVksQ0FBQyxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssS0FBSztNQUNuQyxLQUFLLENBQUMsUUFBUSxHQUFHLENBQUMsR0FBRyxLQUFLLElBQUksQ0FBQyxhQUFhLENBQUMsR0FBRyxFQUFFLElBQUksQ0FBQyxDQUFDO0tBQ3pELENBQUMsQ0FBQztHQUNKO0NBQ0Y7O0FDeERELE1BQU1DLGtCQUFnQixHQUFHO0VBQ3ZCLEtBQUssRUFBRSxHQUFHO0VBQ1YsTUFBTSxFQUFFLEdBQUc7Q0FDWixDQUFDOztBQUVGLE1BQU0sbUJBQW1CLFNBQVMsWUFBWSxDQUFDO0VBQzdDLFdBQVcsQ0FBQyxRQUFRLEVBQUU7SUFDcEIsS0FBSyxFQUFFLENBQUM7O0lBRVIsSUFBSSxDQUFDLGFBQWEsR0FBRyxRQUFRLENBQUMsZUFBZSxDQUFDLGFBQWEsQ0FBQztJQUM1RCxJQUFJLENBQUMsWUFBWSxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUMsWUFBWSxDQUFDO0lBQ2hELElBQUksQ0FBQyxZQUFZLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUMsUUFBUSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLENBQUM7R0FDckU7O0VBRUQsSUFBSSxRQUFRLEdBQUc7SUFDYixNQUFNLGVBQWUsR0FBRyxLQUFLLENBQUMsa0JBQWtCLENBQUMsSUFBSSxDQUFDLFlBQVk7UUFDOUQsSUFBSSxDQUFDLFlBQVksQ0FBQyxLQUFLLENBQUMsR0FBRyxDQUFDLENBQUM7SUFDakMsTUFBTSxrQkFBa0IsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLGVBQWUsRUFBRUEsa0JBQWdCLENBQUMsQ0FBQzs7SUFFM0U7TUFDRSxDQUFDOzs7b0JBR2EsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsd0JBQXdCLEVBQUUsa0JBQWtCLENBQUMsS0FBSyxDQUFDLFVBQVUsRUFBRSxrQkFBa0IsQ0FBQyxNQUFNLENBQUM7Ozs7Ozs7Ozs7YUFVOUgsQ0FBQztNQUNSO0dBQ0g7O0VBRUQsSUFBSSxDQUFDLE9BQU8sRUFBRTtJQUNaLE1BQU0sWUFBWSxHQUFHLE9BQU8sQ0FBQyxnQkFBZ0IsQ0FBQyxDQUFDLG1CQUFtQixDQUFDLENBQUMsQ0FBQztJQUNyRSxDQUFDLEdBQUcsWUFBWSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsS0FBSyxLQUFLO01BQ25DLEtBQUssQ0FBQyxPQUFPLEdBQUcsQ0FBQyxHQUFHLEtBQUssSUFBSSxDQUFDLGFBQWEsQ0FBQyxHQUFHLEVBQUUsQ0FBQyxHQUFHLFlBQVksQ0FBQyxDQUFDLENBQUM7S0FDckUsQ0FBQyxDQUFDO0dBQ0o7Q0FDRjs7QUMzQ0QsTUFBTUEsa0JBQWdCLEdBQUc7RUFDdkIsS0FBSyxFQUFFLEdBQUc7RUFDVixNQUFNLEVBQUUsR0FBRztDQUNaLENBQUM7O0FBRUYsTUFBTSxrQkFBa0IsU0FBUyxZQUFZLENBQUM7RUFDNUMsV0FBVyxDQUFDLFFBQVEsRUFBRTtJQUNwQixLQUFLLEVBQUUsQ0FBQzs7SUFFUixJQUFJLENBQUMsYUFBYSxHQUFHLFFBQVEsQ0FBQyxjQUFjLENBQUMsYUFBYSxDQUFDO0lBQzNELElBQUksQ0FBQyxZQUFZLEdBQUcsUUFBUSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUM7SUFDaEQsSUFBSSxDQUFDLFlBQVksR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQyxRQUFRLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsQ0FBQztHQUNyRTs7RUFFRCxJQUFJLFFBQVEsR0FBRztJQUNiO01BQ0UsQ0FBQyxzQkFBc0IsRUFBRSxJQUFJLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQzs7UUFFbEQsRUFBRSxJQUFJLENBQUMsbUJBQW1CLENBQUM7YUFDdEIsQ0FBQztNQUNSO0dBQ0g7O0VBRUQsY0FBYyxDQUFDLEdBQUcsRUFBRSxLQUFLLEVBQUU7SUFDekIsTUFBTSxlQUFlLEdBQUcsS0FBSyxDQUFDLGtCQUFrQixDQUFDLElBQUksQ0FBQyxZQUFZLEVBQUUsR0FBRyxDQUFDLENBQUM7SUFDekUsTUFBTSxrQkFBa0IsR0FBRyxLQUFLLENBQUMsTUFBTSxDQUFDLGVBQWUsRUFBRUEsa0JBQWdCLENBQUMsQ0FBQzs7SUFFM0U7TUFDRSxDQUFDO2tCQUNXLEVBQUUsR0FBRyxDQUFDLGNBQWMsRUFBRSxLQUFLLEdBQUcsQ0FBQyxDQUFDLFNBQVMsRUFBRSxrQkFBa0IsQ0FBQyxLQUFLLENBQUMsVUFBVSxFQUFFLGtCQUFrQixDQUFDLE1BQU0sQ0FBQztZQUNoSCxDQUFDO01BQ1A7R0FDSDs7RUFFRCxJQUFJLG1CQUFtQixHQUFHO0lBQ3hCLE9BQU8sSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxFQUFFLEtBQUssS0FBSztNQUNuRCxPQUFPLElBQUksQ0FBQyxjQUFjLENBQUMsSUFBSSxDQUFDLEdBQUcsRUFBRSxLQUFLLENBQUMsQ0FBQztLQUM3QyxDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQztHQUNkOztFQUVELElBQUksQ0FBQyxPQUFPLEVBQUU7SUFDWixNQUFNLE9BQU8sR0FBRyxPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO0lBQzFELENBQUMsR0FBRyxPQUFPLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxNQUFNLEtBQUs7TUFDL0IsTUFBTSxDQUFDLE9BQU8sR0FBRyxDQUFDLEdBQUcsS0FBSyxJQUFJLENBQUMsYUFBYSxDQUFDLEdBQUcsQ0FBQyxDQUFDO0tBQ25ELENBQUMsQ0FBQztHQUNKO0NBQ0Y7O0FDMUNELE1BQU0sWUFBWSxHQUFHO0VBQ25CLEtBQUssRUFBRSxDQUFDLEtBQUssQ0FBQztFQUNkLE1BQU0sRUFBRSxDQUFDLE1BQU0sQ0FBQztFQUNoQixLQUFLLEVBQUUsQ0FBQyxLQUFLLENBQUM7Q0FDZixDQUFDOztBQUVGLE1BQU0sV0FBVyxHQUFHO0VBQ2xCLENBQUMsWUFBWSxDQUFDLEtBQUssR0FBRyxrQkFBa0I7RUFDeEMsQ0FBQyxZQUFZLENBQUMsTUFBTSxHQUFHLG1CQUFtQjtFQUMxQyxDQUFDLFlBQVksQ0FBQyxLQUFLLEdBQUcsa0JBQWtCO0NBQ3pDLENBQUM7O0FBRUYsTUFBTSxRQUFRLFNBQVMsWUFBWSxDQUFDO0VBQ2xDLFdBQVcsQ0FBQyxLQUFLLEVBQUU7SUFDakIsS0FBSyxFQUFFLENBQUM7SUFDUixJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztHQUNwQjs7RUFFRCxJQUFJLFFBQVEsR0FBRztJQUNiO01BQ0UsQ0FBQzs7O1VBR0csRUFBRSxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxDQUFDOztZQUV6QyxDQUFDO01BQ1A7R0FDSDs7RUFFRCxJQUFJLENBQUMsT0FBTyxFQUFFO0lBQ1osSUFBSSxDQUFDLE1BQU0sR0FBRyxPQUFPLENBQUMsYUFBYSxDQUFDLENBQUMsT0FBTyxDQUFDLENBQUMsQ0FBQztJQUMvQyxhQUFhLENBQUMsSUFBSSxDQUFDLENBQUM7O0lBRXBCLElBQUksQ0FBQyxjQUFjLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDckQsSUFBSSxDQUFDLFdBQVcsRUFBRSxDQUFDO0dBQ3BCOztFQUVELFdBQVcsR0FBRztJQUNaLE1BQU0sZ0JBQWdCLEdBQUcsSUFBSSxDQUFDLEtBQUssQ0FBQyxZQUFZLENBQUMsSUFBSSxDQUFDO0lBQ3RELE1BQU0sS0FBSyxHQUFHLElBQUksV0FBVyxDQUFDLGdCQUFnQixDQUFDLENBQUMsSUFBSSxDQUFDLENBQUMsT0FBTyxDQUFDO0lBQzlELEtBQUssQ0FBQyxjQUFjLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxjQUFjLENBQUMsQ0FBQztHQUNsRDtDQUNGOztBQzdDRCxNQUFNLFVBQVUsU0FBUyxZQUFZLENBQUM7RUFDcEMsV0FBVyxDQUFDLElBQUksRUFBRTtJQUNoQixLQUFLLEVBQUUsQ0FBQzs7SUFFUixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUNqQixJQUFJLENBQUMsaUJBQWlCLEdBQUcsSUFBSSxDQUFDLE1BQU0sQ0FBQyxpQkFBaUIsQ0FBQztHQUN4RDs7RUFFRCxJQUFJLFFBQVEsR0FBRztJQUNiO01BQ0UsQ0FBQzs7Ozs7O01BTUQsRUFBRSxJQUFJLENBQUMsYUFBYSxDQUFDO01BQ3JCLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQyxDQUFDO01BQ3RCO0dBQ0g7O0VBRUQsSUFBSSxhQUFhLEdBQUc7SUFDbEIsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLFlBQVksUUFBUSxDQUFDLEVBQUU7TUFDcEMsT0FBTyxDQUFDLENBQUMsQ0FBQztLQUNYO0lBQ0QsT0FBTyxDQUFDLCtCQUErQixDQUFDLENBQUM7R0FDMUM7O0VBRUQsSUFBSSxhQUFhLEdBQUc7SUFDbEIsSUFBSSxFQUFFLElBQUksQ0FBQyxJQUFJLFlBQVksUUFBUSxDQUFDLEVBQUU7TUFDcEMsT0FBTyxDQUFDLENBQUMsQ0FBQztLQUNYOztJQUVELE1BQU0sS0FBSyxHQUFHLEVBQUUsQ0FBQztJQUNqQixLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsWUFBWSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLENBQUMsRUFBRSxFQUFFO01BQ3pFLEtBQUssQ0FBQyxJQUFJLENBQUMsQ0FBQyxzRkFBc0YsQ0FBQyxDQUFDLENBQUM7S0FDdEc7SUFDRCxLQUFLLElBQUksQ0FBQyxHQUFHLENBQUMsRUFBRSxDQUFDLEdBQUcsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEtBQUssRUFBRSxDQUFDLEVBQUUsRUFBRTtNQUNwRCxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMscUZBQXFGLENBQUMsQ0FBQyxDQUFDO0tBQ3JHOztJQUVELE9BQU8sQ0FBQyx5QkFBeUIsRUFBRSxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxNQUFNLENBQUMsQ0FBQztHQUM1RDs7RUFFRCxZQUFZLEdBQUc7SUFDYixJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsSUFBSSxJQUFJLENBQUMsRUFBRTtNQUN4QixJQUFJLENBQUMsS0FBSyxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsQ0FBQyx1QkFBdUIsQ0FBQyxDQUFDLENBQUM7S0FDckQ7SUFDRCxJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsR0FBRyxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksQ0FBQztHQUMxQzs7RUFFRCxJQUFJLEdBQUc7SUFDTCxJQUFJLENBQUMsWUFBWSxFQUFFLENBQUM7SUFDcEIsSUFBSSxDQUFDLEtBQUssQ0FBQyxPQUFPLEdBQUcsTUFBTSxDQUFDLFVBQVUsQ0FBQyxNQUFNO01BQzNDLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7O01BRWxCLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxJQUFJLEdBQUcsY0FBYyxDQUFDLGNBQWMsRUFBRTtRQUNuRCxJQUFJLENBQUMsSUFBSSxFQUFFLENBQUM7UUFDWixPQUFPO09BQ1I7TUFDRCxJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sQ0FBQyxJQUFJLEVBQUUsQ0FBQzs7S0FFekIsRUFBRSxjQUFjLENBQUMsNkJBQTZCLENBQUMsQ0FBQztHQUNsRDs7RUFFRCxJQUFJLENBQUMsT0FBTyxFQUFFO0lBQ1osTUFBTSxVQUFVLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLEtBQUssQ0FBQyxDQUFDLENBQUM7SUFDbEQsVUFBVSxDQUFDLE9BQU8sR0FBRyxDQUFDLEdBQUcsS0FBSyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLENBQUM7O0lBRTFELE1BQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxZQUFZLENBQUMsQ0FBQyxDQUFDO0lBQ3BELElBQUksS0FBSyxFQUFFO01BQ1QsSUFBSSxDQUFDLEtBQUssR0FBRyxLQUFLLENBQUM7TUFDbkIsSUFBSSxDQUFDLEtBQUssR0FBRyxJQUFJLENBQUMsSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUM7TUFDbkMsSUFBSSxDQUFDLElBQUksRUFBRSxDQUFDO0tBQ2I7R0FDRjtDQUNGOztBQzdFRCxNQUFNLGFBQWEsR0FBRyxDQUFDLElBQUksS0FBSztFQUM5QixNQUFNLE1BQU0sR0FBRyxJQUFJLFVBQVUsQ0FBQyxJQUFJLENBQUMsQ0FBQyxPQUFPLENBQUM7RUFDNUMsS0FBSyxDQUFDLGNBQWMsQ0FBQyxNQUFNLEVBQUUsSUFBSSxDQUFDLE1BQU0sQ0FBQyxDQUFDO0NBQzNDOztBQ0hELE1BQU0sU0FBUyxTQUFTLFlBQVksQ0FBQztFQUNuQyxXQUFXLEdBQUc7SUFDWixLQUFLLEVBQUUsQ0FBQztHQUNUOztFQUVELElBQUksUUFBUSxHQUFHO0lBQ2I7TUFDRSxDQUFDOzs7Ozs7Ozs7Ozs7Ozs7O1lBZ0JLLENBQUM7TUFDUDtHQUNIOztFQUVELElBQUksQ0FBQyxPQUFPLEVBQUU7SUFDWixJQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQy9DLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQzs7SUFFcEIsTUFBTSxJQUFJLEdBQUcsT0FBTyxDQUFDLGFBQWEsQ0FBQyxDQUFDLFlBQVksQ0FBQyxDQUFDLENBQUM7SUFDbkQsSUFBSSxDQUFDLFFBQVEsR0FBRyxDQUFDLEdBQUcsS0FBSyxJQUFJLENBQUMsaUJBQWlCLENBQUMsR0FBRyxDQUFDLENBQUM7O0lBRXJELE1BQU0sS0FBSyxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxhQUFhLENBQUMsQ0FBQyxDQUFDO0lBQ3JELEtBQUssQ0FBQyxPQUFPLEdBQUcsQ0FBQyxHQUFHLEtBQUssSUFBSSxDQUFDLFlBQVksQ0FBQyxHQUFHLENBQUMsQ0FBQztHQUNqRDtDQUNGOztBQ3JDRCxNQUFNLFlBQVksQ0FBQztFQUNqQixJQUFJLENBQUMsUUFBUSxFQUFFO0lBQ2IsSUFBSSxDQUFDLGlCQUFpQixHQUFHLENBQUMsR0FBRyxLQUFLO01BQ2hDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsQ0FBQztNQUNyQkQsV0FBRyxDQUFDLGtCQUFrQixFQUFFLENBQUM7TUFDekIsSUFBSSxRQUFRLEVBQUU7UUFDWixNQUFNLENBQUMsWUFBWSxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7T0FDOUM7S0FDRixDQUFDOztJQUVGLElBQUksQ0FBQyxRQUFRLEVBQUU7TUFDYixPQUFPLElBQUksQ0FBQztLQUNiOztJQUVELE1BQU0sU0FBUyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUM7O0lBRWpDLElBQUksQ0FBQyxJQUFJLEdBQUcsTUFBTTtNQUNoQixJQUFJLFNBQVMsQ0FBQyxLQUFLLENBQUMsSUFBSSxHQUFHLGNBQWMsQ0FBQyxjQUFjLEVBQUU7UUFDeEQsT0FBTztPQUNSO01BQ0QsRUFBRSxTQUFTLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQztNQUN4QixFQUFFLFNBQVMsQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDO01BQ3hCLFNBQVMsQ0FBQyxTQUFTLENBQUMsS0FBSyxDQUFDLENBQUM7O01BRTNCLElBQUksQ0FBQyxTQUFTLENBQUMsU0FBUyxFQUFFLEVBQUU7UUFDMUJBLFdBQUcsQ0FBQyxlQUFlLENBQUMsU0FBUyxDQUFDLEtBQUssQ0FBQyxDQUFDO1FBQ3JDLE9BQU87T0FDUjtNQUNEQSxXQUFHLENBQUMsY0FBYyxDQUFDLFNBQVMsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUNyQyxDQUFDOztJQUVGLE9BQU8sSUFBSSxDQUFDO0dBQ2I7Q0FDRjs7QUFFRCxhQUFlLElBQUksWUFBWSxFQUFFLENBQUM7O0FDaENsQyxNQUFNLGNBQWMsR0FBRyxDQUFDLENBQUM7O0FBRXpCLE1BQU0sV0FBVyxDQUFDO0VBQ2hCLFdBQVcsR0FBRztJQUNaLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxTQUFTLEVBQUUsQ0FBQztHQUM3Qjs7RUFFRCxJQUFJLEdBQUc7SUFDTCxJQUFJLENBQUMsSUFBSSxDQUFDLFlBQVksR0FBRyxDQUFDLEdBQUcsS0FBSztNQUNoQyxHQUFHLENBQUMsY0FBYyxFQUFFLENBQUM7TUFDckIsTUFBTSxLQUFLLEdBQUcsR0FBRyxDQUFDLGFBQWEsQ0FBQyxLQUFLLENBQUM7O01BRXRDLE1BQU0sSUFBSSxHQUFHLEdBQUcsQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDO01BQzdDLE1BQU0sV0FBVyxHQUFHLElBQUksQ0FBQyxhQUFhLENBQUMsQ0FBQyxjQUFjLENBQUMsQ0FBQyxDQUFDO01BQ3pELFdBQVcsQ0FBQyxRQUFRLEdBQUcsSUFBSSxDQUFDOztNQUU1QixJQUFJLENBQUMsSUFBSSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsRUFBRTtRQUMzQixPQUFPO09BQ1I7TUFDRCxJQUFJLENBQUMsS0FBSyxHQUFHLEtBQUssQ0FBQztNQUNuQixXQUFXLENBQUMsUUFBUSxHQUFHLEtBQUssQ0FBQztLQUM5QixDQUFDOztJQUVGLElBQUksQ0FBQyxJQUFJLENBQUMsaUJBQWlCLEdBQUcsQ0FBQyxHQUFHLEtBQUs7TUFDckMsR0FBRyxDQUFDLGNBQWMsRUFBRSxDQUFDOztNQUVyQixNQUFNLEtBQUssR0FBRyxNQUFNLENBQUMsTUFBTSxDQUFDLEVBQUUsRUFBRSxZQUFZLENBQUMsQ0FBQztNQUM5QyxLQUFLLENBQUMsT0FBTyxHQUFHLEVBQUUsQ0FBQztNQUNuQixLQUFLLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQyxLQUFLLENBQUM7O01BRXhCQSxXQUFHLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxDQUFDO0tBQzNCLENBQUM7O0lBRUYsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLEdBQUcsTUFBTSxDQUFDLElBQUksRUFBRSxDQUFDOztJQUVqQyxLQUFLLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsT0FBTyxDQUFDLENBQUM7R0FDeEM7O0VBRUQsVUFBVSxDQUFDLEtBQUssRUFBRTtJQUNoQixNQUFNLGNBQWMsR0FBRyw2QkFBNkIsQ0FBQztJQUNyRCxNQUFNLGtCQUFrQixHQUFHLENBQUMsY0FBYyxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQzs7SUFFdkQ7TUFDRSxLQUFLLENBQUMsTUFBTSxJQUFJLGNBQWM7TUFDOUIsa0JBQWtCO01BQ2xCO0dBQ0g7Q0FDRjs7QUFFRCxrQkFBZSxJQUFJLFdBQVcsRUFBRSxDQUFDOztBQ3BEakMsTUFBTSxXQUFXLEdBQUc7RUFDbEIsSUFBSSxFQUFFLEVBQUU7RUFDUixJQUFJLEVBQUUsRUFBRTtDQUNULENBQUM7O0FBRUYsTUFBTSxTQUFTLENBQUM7RUFDZCxXQUFXLENBQUMsSUFBSSxFQUFFLFlBQVksRUFBRTtJQUM5QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksQ0FBQztJQUNqQixJQUFJLENBQUMsWUFBWSxHQUFHLFlBQVksQ0FBQztHQUNsQzs7RUFFRCxXQUFXLENBQUMsUUFBUSxFQUFFO0lBQ3BCLElBQUksQ0FBQyxLQUFLLEdBQUcsUUFBUSxDQUFDO0lBQ3RCLElBQUksQ0FBQyxVQUFVLEVBQUUsQ0FBQztHQUNuQjs7RUFFRCxVQUFVLEdBQUc7SUFDWCxJQUFJLENBQUMsS0FBSyxDQUFDLElBQUksR0FBRyxZQUFZLENBQUMsSUFBSSxDQUFDO0dBQ3JDOztFQUVELFNBQVMsR0FBRztJQUNWO01BQ0UsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssR0FBRyxjQUFjLENBQUMsY0FBYztPQUNoRCxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxNQUFNLEdBQUcsY0FBYyxDQUFDLGNBQWMsQ0FBQztPQUMxRCxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssSUFBSSxjQUFjLENBQUMsZUFBZSxDQUFDO01BQ3BEO0dBQ0g7O0VBRUQsSUFBSSxZQUFZLEdBQUc7SUFDakIsT0FBTyxLQUFLLENBQUMsUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztHQUNwRDs7RUFFRCxPQUFPLGFBQWEsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFO0lBQ2pDLElBQUksQ0FBQyxNQUFNLEVBQUU7TUFDWCxPQUFPLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDaEI7SUFDRCxJQUFJLElBQUksR0FBRyxXQUFXLENBQUMsSUFBSSxFQUFFO01BQzNCLE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUNmO0lBQ0QsSUFBSSxJQUFJLElBQUksV0FBVyxDQUFDLElBQUksSUFBSSxJQUFJLEdBQUcsV0FBVyxDQUFDLElBQUksRUFBRTtNQUN2RCxPQUFPLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDbEI7SUFDRCxJQUFJLElBQUksSUFBSSxXQUFXLENBQUMsSUFBSSxJQUFJLElBQUksR0FBRyxZQUFZLENBQUMsSUFBSSxFQUFFO01BQ3hELE9BQU8sQ0FBQyxJQUFJLENBQUMsQ0FBQztLQUNmO0lBQ0QsT0FBTyxDQUFDLEtBQUssQ0FBQyxDQUFDO0dBQ2hCOztFQUVELFNBQVMsQ0FBQyxNQUFNLEVBQUUsSUFBSSxFQUFFO0lBQ3RCLElBQUksR0FBRyxDQUFDLElBQUksSUFBSSxFQUFFLEdBQUcsSUFBSSxJQUFJLGNBQWMsQ0FBQyw2QkFBNkIsQ0FBQztJQUMxRSxNQUFNLElBQUksR0FBRyxTQUFTLENBQUMsYUFBYSxDQUFDLE1BQU0sRUFBRSxJQUFJLENBQUMsQ0FBQztJQUNuRCxJQUFJLENBQUMsS0FBSyxDQUFDLE9BQU8sQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUM7R0FDL0I7Q0FDRjs7QUN4REQsTUFBTSxvQkFBb0IsQ0FBQztFQUN6QixJQUFJLENBQUMsUUFBUSxFQUFFO0lBQ2IsSUFBSSxDQUFDLFNBQVMsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDO0lBQ2hDLElBQUksQ0FBQyxZQUFZLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxZQUFZLENBQUM7O0lBRWhELElBQUksQ0FBQyxhQUFhLEdBQUcsQ0FBQyxHQUFHLEVBQUUsSUFBSSxLQUFLO01BQ2xDLEdBQUcsQ0FBQyxjQUFjLEVBQUUsQ0FBQzs7TUFFckIsTUFBTSxXQUFXLEdBQUcsSUFBSSxDQUFDLGdCQUFnQixDQUFDLENBQUMsYUFBYSxDQUFDLENBQUMsQ0FBQztNQUMzRCxJQUFJLENBQUMsb0JBQW9CLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxFQUFFO1FBQ2hELE9BQU87T0FDUjs7TUFFRCxNQUFNLE1BQU0sR0FBRyxJQUFJLENBQUMsU0FBUyxDQUFDLFdBQVcsQ0FBQyxDQUFDO01BQzNDLFFBQVEsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDakMsQ0FBQzs7SUFFRixPQUFPLElBQUksQ0FBQztHQUNiOztFQUVELE9BQU8sU0FBUyxDQUFDLFdBQVcsRUFBRTtJQUM1QixPQUFPLENBQUMsR0FBRyxXQUFXLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLEtBQUs7TUFDeEMsTUFBTSxXQUFXLEdBQUcsTUFBTSxDQUFDLGdCQUFnQixDQUFDLENBQUMsbUJBQW1CLENBQUMsQ0FBQyxDQUFDO01BQ25FLE9BQU8sQ0FBQyxHQUFHLFdBQVcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssS0FBSyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7S0FDeEQsQ0FBQyxDQUFDO0dBQ0o7O0VBRUQsU0FBUyxDQUFDLFdBQVcsRUFBRTtJQUNyQixPQUFPLENBQUMsR0FBRyxXQUFXLENBQUMsQ0FBQyxLQUFLLENBQUMsQ0FBQyxNQUFNLEVBQUUsS0FBSyxLQUFLO01BQy9DLE1BQU0sU0FBUyxHQUFHLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksQ0FBQztNQUN2RCxNQUFNLFdBQVcsR0FBRyxNQUFNLENBQUMsZ0JBQWdCLENBQUMsQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDLENBQUM7O01BRW5FLE9BQU8sQ0FBQyxHQUFHLFdBQVcsQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDLEtBQUssS0FBSztRQUN0QyxJQUFJLEtBQUssQ0FBQyxPQUFPLEVBQUU7VUFDakIsT0FBTyxLQUFLLENBQUMsS0FBSyxLQUFLLFNBQVMsQ0FBQztTQUNsQztRQUNELE9BQU8sS0FBSyxDQUFDO09BQ2QsQ0FBQyxDQUFDO0tBQ0osQ0FBQyxDQUFDO0dBQ0o7Q0FDRjs7QUFFRCxxQkFBZSxJQUFJLG9CQUFvQixFQUFFLENBQUM7O0FDMUMxQyxNQUFNLHFCQUFxQixDQUFDO0VBQzFCLElBQUksQ0FBQyxRQUFRLEVBQUU7SUFDYixNQUFNLFNBQVMsR0FBRyxRQUFRLENBQUMsS0FBSyxDQUFDO0lBQ2pDLElBQUksQ0FBQyxZQUFZLEdBQUcsU0FBUyxDQUFDLFlBQVksQ0FBQzs7SUFFM0MsSUFBSSxDQUFDLGFBQWEsR0FBRyxDQUFDLEdBQUcsS0FBSztNQUM1QixHQUFHLENBQUMsY0FBYyxFQUFFLENBQUM7O01BRXJCLE1BQU0sTUFBTSxHQUFHLElBQUksQ0FBQyxTQUFTLENBQUMsR0FBRyxDQUFDLGFBQWEsQ0FBQyxDQUFDO01BQ2pELFFBQVEsQ0FBQyxjQUFjLENBQUMsTUFBTSxDQUFDLENBQUM7S0FDakMsQ0FBQzs7SUFFRixPQUFPLElBQUksQ0FBQztHQUNiOztFQUVELFNBQVMsQ0FBQyxLQUFLLEVBQUU7SUFDZixNQUFNLFNBQVMsR0FBRyxJQUFJLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxJQUFJLENBQUM7SUFDL0MsT0FBTyxLQUFLLENBQUMsS0FBSyxLQUFLLFNBQVMsQ0FBQztHQUNsQztDQUNGOztBQUVELHNCQUFlLElBQUkscUJBQXFCLEVBQUUsQ0FBQzs7QUNyQjNDLE1BQU0sb0JBQW9CLENBQUM7RUFDekIsSUFBSSxDQUFDLFFBQVEsRUFBRTtJQUNiLE1BQU0sU0FBUyxHQUFHLFFBQVEsQ0FBQyxLQUFLLENBQUM7SUFDakMsSUFBSSxDQUFDLFlBQVksR0FBRyxTQUFTLENBQUMsWUFBWSxDQUFDOztJQUUzQyxJQUFJLENBQUMsYUFBYSxHQUFHLENBQUMsR0FBRyxLQUFLO01BQzVCLEdBQUcsQ0FBQyxjQUFjLEVBQUUsQ0FBQzs7TUFFckIsTUFBTSxNQUFNLEdBQUcsSUFBSSxDQUFDLFNBQVMsQ0FBQyxHQUFHLENBQUMsYUFBYSxDQUFDLENBQUM7TUFDakQsUUFBUSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUMsQ0FBQztLQUNqQyxDQUFDOztJQUVGLE9BQU8sSUFBSSxDQUFDO0dBQ2I7O0VBRUQsU0FBUyxDQUFDLE1BQU0sRUFBRTtJQUNoQixNQUFNLFFBQVEsR0FBRyxNQUFNLENBQUMsYUFBYSxDQUFDLENBQUMsR0FBRyxDQUFDLENBQUMsQ0FBQyxHQUFHLENBQUM7SUFDakQsTUFBTSxhQUFhLEdBQUcsSUFBSSxDQUFDLFlBQVksQ0FBQyxNQUFNLENBQUMsSUFBSSxDQUFDLENBQUMsS0FBSyxLQUFLO01BQzdELE9BQU8sS0FBSyxDQUFDLEdBQUcsS0FBSyxRQUFRLENBQUM7S0FDL0IsQ0FBQyxDQUFDO0lBQ0gsT0FBTyxhQUFhLENBQUMsSUFBSSxLQUFLLElBQUksQ0FBQyxZQUFZLENBQUMsTUFBTSxDQUFDO0dBQ3hEO0NBQ0Y7O0FBRUQscUJBQWUsSUFBSSxvQkFBb0IsRUFBRSxDQUFDOztBQ2YxQyxNQUFNLFVBQVUsQ0FBQztFQUNmLFdBQVcsQ0FBQyxRQUFRLEVBQUUsWUFBWSxFQUFFO0lBQ2xDLElBQUksQ0FBQyxLQUFLLEdBQUcsSUFBSSxTQUFTLENBQUMsUUFBUSxFQUFFLFlBQVksQ0FBQyxDQUFDO0dBQ3BEOztFQUVELElBQUksQ0FBQyxLQUFLLEVBQUU7SUFDVixJQUFJLENBQUMsS0FBSyxDQUFDLFdBQVcsQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUM5QixJQUFJLENBQUMsSUFBSSxHQUFHLElBQUksUUFBUSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztJQUNyQyxNQUFNLElBQUksR0FBRyxJQUFJLElBQUksRUFBRSxDQUFDOztJQUV4QixJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsR0FBRyxDQUFDLE1BQU0sS0FBSztNQUNyQyxNQUFNLENBQUMsWUFBWSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUssQ0FBQyxPQUFPLENBQUMsQ0FBQzs7TUFFbkQsSUFBSSxDQUFDLE1BQU0sRUFBRTtRQUNYLEVBQUUsS0FBSyxDQUFDLEtBQUssQ0FBQztPQUNmO01BQ0QsSUFBSSxDQUFDLEtBQUssQ0FBQyxTQUFTLENBQUMsTUFBTSxFQUFFLElBQUksQ0FBQyxDQUFDOztNQUVuQyxFQUFFLEtBQUssQ0FBQyxLQUFLLENBQUM7TUFDZCxJQUFJLElBQUksQ0FBQyxLQUFLLENBQUMsU0FBUyxFQUFFLEVBQUU7UUFDMUJBLFdBQUcsQ0FBQyxjQUFjLENBQUMsS0FBSyxDQUFDLENBQUM7UUFDMUIsT0FBTztPQUNSO01BQ0RBLFdBQUcsQ0FBQyxlQUFlLENBQUMsS0FBSyxDQUFDLENBQUM7S0FDNUIsQ0FBQzs7SUFFRixJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMxQyxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsR0FBRyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUMxRCxJQUFJLENBQUMsSUFBSSxDQUFDLGVBQWUsR0FBRyxlQUFlLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQztJQUM1RCxJQUFJLENBQUMsSUFBSSxDQUFDLGNBQWMsR0FBRyxjQUFjLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxJQUFJLENBQUMsQ0FBQzs7SUFFMUQsS0FBSyxDQUFDLGFBQWEsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0dBQ3hDO0NBQ0Y7O0FDdkNELE1BQU0sZ0JBQWdCLEdBQUcsQ0FBQyxLQUFLLEtBQUs7RUFDbEMsTUFBTSxhQUFhLEdBQUc7SUFDcEIsb0JBQW9CLEVBQUUsQ0FBQztJQUN2QixpQkFBaUIsRUFBRSxDQUFDO0lBQ3BCLGlCQUFpQixFQUFFLENBQUM7SUFDcEIsZUFBZSxFQUFFLEtBQUssQ0FBQyxLQUFLO0dBQzdCLENBQUM7O0VBRUYsTUFBTSxnQkFBZ0IsSUFBSSxDQUFDLEdBQUcsRUFBRSxJQUFJLEtBQUs7SUFDdkMsUUFBUSxJQUFJO01BQ1YsS0FBSyxDQUFDLE9BQU8sQ0FBQztRQUNaLEVBQUUsYUFBYSxDQUFDLG9CQUFvQixDQUFDO1FBQ3JDLEdBQUcsSUFBSSxHQUFHLENBQUM7UUFDWCxNQUFNO01BQ1IsS0FBSyxDQUFDLElBQUksQ0FBQztRQUNULEVBQUUsYUFBYSxDQUFDLG9CQUFvQixDQUFDO1FBQ3JDLEVBQUUsYUFBYSxDQUFDLGlCQUFpQixDQUFDO1FBQ2xDLEdBQUcsSUFBSSxHQUFHLENBQUM7UUFDWCxNQUFNO01BQ1IsS0FBSyxDQUFDLElBQUksQ0FBQztRQUNULEVBQUUsYUFBYSxDQUFDLG9CQUFvQixDQUFDO1FBQ3JDLEVBQUUsYUFBYSxDQUFDLGlCQUFpQixDQUFDO1FBQ2xDLEdBQUcsSUFBSSxFQUFFLENBQUM7UUFDVixNQUFNO0tBQ1Q7SUFDRCxPQUFPLEdBQUcsQ0FBQztHQUNaLENBQUMsQ0FBQzs7RUFFSCxJQUFJLFdBQVcsR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQyxnQkFBZ0IsRUFBRSxDQUFDLENBQUM7TUFDdkQsYUFBYSxDQUFDLGVBQWUsR0FBRyxFQUFFLENBQUM7O0VBRXZDLE9BQU87SUFDTCxXQUFXOztJQUVYLGNBQWMsRUFBRTtNQUNkLGFBQWEsRUFBRSxZQUFZLENBQUMsY0FBYztNQUMxQyxNQUFNLEVBQUUsYUFBYSxDQUFDLG9CQUFvQjtNQUMxQyxNQUFNLEVBQUUsS0FBSyxDQUFDLGFBQWEsQ0FBQyxhQUFhLENBQUMsb0JBQW9CLEVBQUUsWUFBWSxDQUFDLGNBQWMsQ0FBQztLQUM3Rjs7SUFFRCxtQkFBbUIsRUFBRTtNQUNuQjtRQUNFLEtBQUssRUFBRSxDQUFDLGlCQUFpQixDQUFDO1FBQzFCLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQztRQUNaLGFBQWEsRUFBRSxZQUFZLENBQUMscUJBQXFCO1FBQ2pELE1BQU0sRUFBRSxhQUFhLENBQUMsaUJBQWlCO1FBQ3ZDLE1BQU0sRUFBRSxLQUFLLENBQUMsYUFBYSxDQUFDLGFBQWEsQ0FBQyxpQkFBaUIsRUFBRSxZQUFZLENBQUMscUJBQXFCLENBQUM7T0FDakc7TUFDRDtRQUNFLEtBQUssRUFBRSxDQUFDLGNBQWMsQ0FBQztRQUN2QixJQUFJLEVBQUUsQ0FBQyxLQUFLLENBQUM7UUFDYixhQUFhLEVBQUUsWUFBWSxDQUFDLG9CQUFvQjtRQUNoRCxNQUFNLEVBQUUsYUFBYSxDQUFDLGVBQWU7UUFDckMsTUFBTSxFQUFFLEtBQUssQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLGVBQWUsRUFBRSxZQUFZLENBQUMsb0JBQW9CLENBQUM7T0FDOUY7TUFDRDtRQUNFLEtBQUssRUFBRSxDQUFDLHVCQUF1QixDQUFDO1FBQ2hDLElBQUksRUFBRSxDQUFDLElBQUksQ0FBQztRQUNaLGFBQWEsRUFBRSxDQUFDLFlBQVksQ0FBQyxxQkFBcUI7UUFDbEQsTUFBTSxFQUFFLGFBQWEsQ0FBQyxpQkFBaUI7UUFDdkMsTUFBTSxFQUFFLEtBQUssQ0FBQyxhQUFhLENBQUMsYUFBYSxDQUFDLGlCQUFpQixFQUFFLFlBQVksQ0FBQyxxQkFBcUIsQ0FBQztPQUNqRztLQUNGO0dBQ0YsQ0FBQztDQUNIOztBQzdERCxNQUFNLFVBQVUsU0FBUyxZQUFZLENBQUM7RUFDcEMsV0FBVyxDQUFDLElBQUksRUFBRTtJQUNoQixLQUFLLEVBQUUsQ0FBQztJQUNSLElBQUksQ0FBQyxJQUFJLEdBQUcsSUFBSSxDQUFDLE9BQU8sRUFBRSxDQUFDO0dBQzVCOztFQUVELElBQUksUUFBUSxHQUFHO0lBQ2I7TUFDRSxDQUFDOztRQUVDLEVBQUUsSUFBSSxDQUFDLGNBQWMsQ0FBQyxJQUFJLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7UUFDcEMsRUFBRSxJQUFJLENBQUMsSUFBSSxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksRUFBRSxLQUFLLEtBQUssSUFBSSxDQUFDLG1CQUFtQixDQUFDLElBQUksRUFBRSxLQUFLLEdBQUcsQ0FBQyxDQUFDLENBQUMsQ0FBQyxJQUFJLENBQUMsQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDO1lBQ2xGLENBQUM7TUFDUDtHQUNIOztFQUVELEtBQUssQ0FBQyxLQUFLLEVBQUU7SUFDWDtNQUNFLEtBQUssQ0FBQyxPQUFPLENBQUMsTUFBTSxLQUFLLGNBQWMsQ0FBQyxjQUFjO01BQ3RELEtBQUssQ0FBQyxLQUFLLElBQUksY0FBYyxDQUFDLGVBQWU7TUFDN0M7R0FDSDs7RUFFRCxjQUFjLENBQUMsS0FBSyxFQUFFO0lBQ3BCLElBQUksSUFBSSxDQUFDLEtBQUssQ0FBQyxLQUFLLENBQUMsRUFBRTtNQUNyQixPQUFPLENBQUMsZ0JBQWdCLENBQUMsQ0FBQztLQUMzQjtJQUNELE9BQU8sQ0FBQyxtQkFBbUIsQ0FBQyxDQUFDO0dBQzlCOztFQUVELG1CQUFtQixDQUFDLEtBQUssRUFBRSxLQUFLLEVBQUU7SUFDaEMsSUFBSSxDQUFDLElBQUksQ0FBQyxLQUFLLENBQUMsS0FBSyxDQUFDLEVBQUU7TUFDdEI7UUFDRSxDQUFDOzt1Q0FFOEIsRUFBRSxLQUFLLENBQUM7O2NBRWpDLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7Ozs7O2dCQUs5QixDQUFDO1FBQ1Q7S0FDSDs7SUFFRCxNQUFNLGFBQWEsR0FBRyxnQkFBZ0IsQ0FBQyxLQUFLLENBQUMsQ0FBQzs7SUFFOUMsTUFBTSxJQUFJLEdBQUcsYUFBYSxDQUFDLG1CQUFtQixDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksS0FBSyxJQUFJLENBQUMsb0JBQW9CLENBQUMsSUFBSSxDQUFDLENBQUMsQ0FBQzs7SUFFOUY7TUFDRSxDQUFDOztxQ0FFOEIsRUFBRSxLQUFLLENBQUM7O1lBRWpDLEVBQUUsS0FBSyxDQUFDLFFBQVEsQ0FBQyxLQUFLLENBQUMsT0FBTyxDQUFDLENBQUM7OzRDQUVBLEVBQUUsYUFBYSxDQUFDLGNBQWMsQ0FBQyxhQUFhLENBQUM7b0NBQ3JELEVBQUUsYUFBYSxDQUFDLGNBQWMsQ0FBQyxNQUFNLENBQUM7O1FBRWxFLEVBQUUsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQyxDQUFDLENBQUM7O3NFQUU2QyxFQUFFLGFBQWEsQ0FBQyxXQUFXLENBQUM7O2NBRXBGLENBQUM7TUFDVDtHQUNIOztFQUVELG9CQUFvQixDQUFDLElBQUksRUFBRTtJQUN6QixJQUFJLENBQUMsSUFBSSxDQUFDLE1BQU0sRUFBRTtNQUNoQixPQUFPLENBQUMsQ0FBQyxDQUFDO0tBQ1g7SUFDRDtNQUNFLENBQUM7O2tDQUUyQixFQUFFLElBQUksQ0FBQyxLQUFLLENBQUM7a0NBQ2IsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDLGdEQUFnRCxFQUFFLElBQUksQ0FBQyxJQUFJLENBQUM7MENBQ2xFLEVBQUUsSUFBSSxDQUFDLGFBQWEsQ0FBQztrQ0FDN0IsRUFBRSxJQUFJLENBQUMsTUFBTSxDQUFDO1dBQ3JDLENBQUM7TUFDTjtHQUNIOztFQUVELElBQUksQ0FBQyxPQUFPLEVBQUU7SUFDWixJQUFJLENBQUMsTUFBTSxHQUFHLE9BQU8sQ0FBQyxhQUFhLENBQUMsQ0FBQyxPQUFPLENBQUMsQ0FBQyxDQUFDO0lBQy9DLGFBQWEsQ0FBQyxJQUFJLENBQUMsQ0FBQztHQUNyQjtDQUNGOztBQ3pGRCxNQUFNLFlBQVksQ0FBQztFQUNqQixJQUFJLENBQUMsS0FBSyxFQUFFO0lBQ1YsTUFBTSxJQUFJLEdBQUcsSUFBSSxVQUFVLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDbkMsSUFBSSxDQUFDLE1BQU0sR0FBRyxNQUFNLENBQUMsSUFBSSxFQUFFLENBQUM7O0lBRTVCLEtBQUssQ0FBQyxhQUFhLENBQUMsSUFBSSxDQUFDLE9BQU8sQ0FBQyxDQUFDO0dBQ25DO0NBQ0Y7O0FBRUQsbUJBQWUsSUFBSSxZQUFZLEVBQUUsQ0FBQzs7QUNibEMsTUFBTUUsY0FBWSxHQUFHO0VBQ25CLEtBQUssRUFBRSxDQUFDLFVBQVUsQ0FBQztFQUNuQixNQUFNLEVBQUUsQ0FBQyxXQUFXLENBQUM7RUFDckIsS0FBSyxFQUFFLENBQUMsWUFBWSxDQUFDO0NBQ3RCLENBQUM7O0FBRUYsTUFBTSxxQkFBcUIsR0FBRyxDQUFDLEtBQUssS0FBSztFQUN2QyxPQUFPLEtBQUssQ0FBQyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxLQUFLO0lBQ2pDLElBQUksSUFBSSxDQUFDLElBQUksS0FBSyxDQUFDLFFBQVEsQ0FBQyxFQUFFO01BQzVCLElBQUksQ0FBQyxJQUFJLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztLQUNyQjtJQUNELE9BQU87TUFDTCxHQUFHLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHO01BQ25CLElBQUksRUFBRSxJQUFJLENBQUMsSUFBSTtLQUNoQixDQUFDO0dBQ0gsQ0FBQyxDQUFDO0NBQ0osQ0FBQzs7QUFFRixNQUFNLG1CQUFtQixHQUFHLENBQUMsS0FBSyxLQUFLO0VBQ3JDLE9BQU87SUFDTCxRQUFRLEVBQUUsS0FBSyxDQUFDLFFBQVE7SUFDeEIsSUFBSSxFQUFFLENBQUMsS0FBSyxDQUFDO0lBQ2IsTUFBTSxFQUFFLHFCQUFxQixDQUFDLEtBQUssRUFBRSxDQUFDLEtBQUssQ0FBQyxDQUFDO0dBQzlDLENBQUM7Q0FDSCxDQUFDOztBQUVGLE1BQU0sb0JBQW9CLEdBQUcsQ0FBQyxLQUFLLEtBQUs7RUFDdEMsT0FBTztJQUNMLFFBQVEsRUFBRSxLQUFLLENBQUMsUUFBUTtJQUN4QixJQUFJLEVBQUUsQ0FBQyxNQUFNLENBQUM7SUFDZCxLQUFLLEVBQUUscUJBQXFCLENBQUMsS0FBSyxDQUFDLENBQUMsQ0FBQyxDQUFDO0dBQ3ZDLENBQUM7Q0FDSCxDQUFDOztBQUVGLE1BQU0sbUJBQW1CLEdBQUcsQ0FBQyxLQUFLLEtBQUs7RUFDckMsSUFBSSxXQUFXLEdBQUcsQ0FBQyxDQUFDOztFQUVwQixNQUFNLE1BQU0sR0FBRyxLQUFLLENBQUMsT0FBTyxDQUFDLEdBQUcsQ0FBQyxDQUFDLElBQUksS0FBSztJQUN6QyxJQUFJLElBQUksQ0FBQyxJQUFJLEtBQUssQ0FBQyxRQUFRLENBQUMsRUFBRTtNQUM1QixJQUFJLENBQUMsSUFBSSxHQUFHLENBQUMsS0FBSyxDQUFDLENBQUM7TUFDcEIsRUFBRSxXQUFXLENBQUM7S0FDZjtJQUNELE9BQU87TUFDTCxHQUFHLEVBQUUsSUFBSSxDQUFDLEtBQUssQ0FBQyxHQUFHO01BQ25CLEtBQUssRUFBRSxJQUFJLENBQUMsS0FBSyxDQUFDLEtBQUs7TUFDdkIsTUFBTSxFQUFFLElBQUksQ0FBQyxLQUFLLENBQUMsTUFBTTtNQUN6QixJQUFJLEVBQUUsSUFBSSxDQUFDLElBQUk7S0FDaEIsQ0FBQztHQUNILENBQUMsQ0FBQzs7RUFFSCxJQUFJLE1BQU0sR0FBRyxDQUFDLEtBQUssQ0FBQyxDQUFDO0VBQ3JCLElBQUksV0FBVyxLQUFLLENBQUMsRUFBRTtJQUNyQixNQUFNLEdBQUcsQ0FBQyxLQUFLLENBQUMsQ0FBQztHQUNsQjtFQUNELE9BQU87SUFDTCxRQUFRLEVBQUUsS0FBSyxDQUFDLFFBQVE7SUFDeEIsTUFBTTtJQUNOLElBQUksRUFBRSxDQUFDLEtBQUssQ0FBQztJQUNiLE1BQU07R0FDUCxDQUFDO0NBQ0gsQ0FBQzs7QUFFRixNQUFNLGlCQUFpQixHQUFHO0VBQ3hCLENBQUNBLGNBQVksQ0FBQyxLQUFLLEdBQUcsbUJBQW1CO0VBQ3pDLENBQUNBLGNBQVksQ0FBQyxNQUFNLEdBQUcsb0JBQW9CO0VBQzNDLENBQUNBLGNBQVksQ0FBQyxLQUFLLEdBQUcsbUJBQW1CO0NBQzFDLENBQUM7O0FBRUYsTUFBTSxLQUFLLEdBQUcsQ0FBQyxJQUFJLEtBQUs7RUFDdEIsT0FBTyxJQUFJLENBQUMsR0FBRyxDQUFDLENBQUMsSUFBSSxLQUFLO0lBQ3hCLE9BQU8saUJBQWlCLENBQUMsSUFBSSxDQUFDLElBQUksQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0dBQzNDLENBQUMsQ0FBQztDQUNKOztBQ3hFRCxNQUFNLFNBQVMsR0FBRyxDQUFDLEdBQUcsS0FBSztFQUN6QixPQUFPLElBQUksT0FBTyxDQUFDLENBQUMsTUFBTSxFQUFFLE9BQU8sS0FBSztJQUN0QyxNQUFNLEtBQUssR0FBRyxJQUFJLEtBQUssRUFBRSxDQUFDO0lBQzFCLEtBQUssQ0FBQyxNQUFNLEdBQUcsTUFBTSxNQUFNLENBQUMsS0FBSyxDQUFDLENBQUM7SUFDbkMsS0FBSyxDQUFDLE9BQU8sR0FBRyxNQUFNLE9BQU8sQ0FBQztJQUM5QixLQUFLLENBQUMsR0FBRyxHQUFHLEdBQUcsQ0FBQztHQUNqQixDQUFDLENBQUM7Q0FDSjs7QUNKRCxNQUFNLFVBQVUsR0FBRyxDQUFDLG9DQUFvQyxDQUFDLENBQUM7QUFDMUQsTUFBTSxZQUFZLEdBQUcsQ0FBQyxNQUFNLENBQUMsQ0FBQzs7QUFFOUIsTUFBTSxNQUFNLENBQUM7RUFDWCxPQUFPLFFBQVEsR0FBRztJQUNoQixPQUFPLEtBQUssQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLFVBQVUsQ0FBQyxDQUFDO1FBQ25DLElBQUksQ0FBQyxDQUFDLFFBQVEsS0FBSztVQUNqQixJQUFJLFFBQVEsQ0FBQyxFQUFFLEVBQUU7WUFDZixPQUFPLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztXQUN4QjtVQUNELE1BQU0sSUFBSSxLQUFLLENBQUMsQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDLENBQUM7U0FDMUQsQ0FBQztTQUNELElBQUksQ0FBQyxLQUFLLENBQUMsQ0FBQztHQUNsQjs7RUFFRCxPQUFPLFVBQVUsQ0FBQyxJQUFJLEVBQUUsSUFBSSxHQUFHLFlBQVksRUFBRTtJQUMzQyxNQUFNLGVBQWUsR0FBRztNQUN0QixJQUFJLEVBQUUsSUFBSSxDQUFDLFNBQVMsQ0FBQyxJQUFJLENBQUM7TUFDMUIsT0FBTyxFQUFFO1FBQ1AsY0FBYyxFQUFFLENBQUMsZ0JBQWdCLENBQUM7T0FDbkM7TUFDRCxNQUFNLEVBQUUsQ0FBQyxJQUFJLENBQUM7S0FDZixDQUFDOztJQUVGLE9BQU8sS0FBSyxDQUFDLENBQUMsRUFBRSxVQUFVLENBQUMsT0FBTyxFQUFFLElBQUksQ0FBQyxDQUFDLEVBQUUsZUFBZSxDQUFDLENBQUM7R0FDOUQ7O0VBRUQsT0FBTyxVQUFVLENBQUMsSUFBSSxHQUFHLFlBQVksRUFBRTtJQUNyQyxPQUFPLEtBQUssQ0FBQyxDQUFDLEVBQUUsVUFBVSxDQUFDLE9BQU8sRUFBRSxJQUFJLENBQUMsQ0FBQyxDQUFDO1FBQ3ZDLElBQUksQ0FBQyxDQUFDLFFBQVEsS0FBSztVQUNqQixJQUFJLFFBQVEsQ0FBQyxFQUFFLEVBQUU7WUFDZixPQUFPLFFBQVEsQ0FBQyxJQUFJLEVBQUUsQ0FBQztXQUN4QjtVQUNELE1BQU0sSUFBSSxLQUFLLENBQUMsQ0FBQyxxQ0FBcUMsQ0FBQyxDQUFDLENBQUM7U0FDMUQsQ0FBQyxDQUFDO0dBQ1I7O0VBRUQsT0FBTyxRQUFRLENBQUMsSUFBSSxFQUFFO0lBQ3BCLE1BQU0sZUFBZSxHQUFHLElBQUksR0FBRyxFQUFFLENBQUM7O0lBRWxDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQyxJQUFJLEtBQUs7TUFDckIsSUFBSSxJQUFJLENBQUMsSUFBSSxLQUFLLENBQUMsTUFBTSxDQUFDLEVBQUU7UUFDMUIsZUFBZSxDQUFDLEdBQUcsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLEdBQUcsQ0FBQyxDQUFDO1FBQ3BDLE9BQU87T0FDUjs7TUFFRCxJQUFJLENBQUMsTUFBTSxDQUFDLE9BQU8sQ0FBQyxDQUFDLEtBQUssS0FBSztRQUM3QixlQUFlLENBQUMsR0FBRyxDQUFDLEtBQUssQ0FBQyxHQUFHLENBQUMsQ0FBQztPQUNoQyxDQUFDLENBQUM7S0FDSixDQUFDLENBQUM7O0lBRUgsT0FBTyxPQUFPLENBQUMsR0FBRyxDQUFDLENBQUMsR0FBRyxlQUFlLENBQUMsQ0FBQyxHQUFHLENBQUMsQ0FBQyxJQUFJLEtBQUssU0FBUyxDQUFDLElBQUksQ0FBQyxDQUFDLENBQUMsQ0FBQztHQUN6RTtDQUNGOztBQ3JERCxNQUFNLFdBQVcsU0FBUyxZQUFZLENBQUM7RUFDckMsV0FBVyxDQUFDLE9BQU8sRUFBRTtJQUNuQixLQUFLLEVBQUUsQ0FBQzs7SUFFUixJQUFJLENBQUMsT0FBTyxHQUFHLE9BQU8sQ0FBQztHQUN4Qjs7RUFFRCxJQUFJLFFBQVEsR0FBRztJQUNiO01BQ0UsQ0FBQywyQkFBMkIsRUFBRSxJQUFJLENBQUMsT0FBTyxDQUFDLE1BQU0sQ0FBQztNQUNsRDtHQUNIOztFQUVELE9BQU8sSUFBSSxDQUFDLE9BQU8sRUFBRTtJQUNuQixNQUFNLEtBQUssR0FBRyxJQUFJLFdBQVcsQ0FBQyxPQUFPLENBQUMsQ0FBQztJQUN2QyxLQUFLLENBQUMsY0FBYyxDQUFDLEtBQUssQ0FBQyxPQUFPLEVBQUUsUUFBUSxDQUFDLElBQUksRUFBRSxJQUFJLENBQUMsQ0FBQztHQUMxRDtDQUNGOztBQ2pCRCxNQUFNLFlBQVksU0FBUyxZQUFZLENBQUM7RUFDdEMsV0FBVyxHQUFHO0lBQ1osS0FBSyxFQUFFLENBQUM7R0FDVDs7RUFFRCxJQUFJLFFBQVEsR0FBRztJQUNiO01BQ0UsQ0FBQzs7Ozs7Y0FLTyxDQUFDO01BQ1Q7R0FDSDs7RUFFRCxLQUFLLEdBQUc7SUFDTixLQUFLLENBQUMsYUFBYSxDQUFDLElBQUksQ0FBQyxPQUFPLENBQUMsQ0FBQztHQUNuQztDQUNGOztBQUVELGFBQWUsSUFBSSxZQUFZLEVBQUUsQ0FBQzs7QUNoQmxDLE1BQU0sWUFBWSxHQUFHO0VBQ25CLFFBQVEsRUFBRSxDQUFDLENBQUM7RUFDWixLQUFLLEVBQUUsQ0FBQyxLQUFLLENBQUM7RUFDZCxJQUFJLEVBQUUsQ0FBQyxJQUFJLENBQUM7RUFDWixLQUFLLEVBQUUsQ0FBQyxLQUFLLENBQUM7Q0FDZixDQUFDOztBQUVGLE1BQU0sV0FBVyxDQUFDO0VBQ2hCLE9BQU8sSUFBSSxDQUFDLE1BQU0sRUFBRTtJQUNsQixXQUFXLENBQUMsTUFBTSxHQUFHO01BQ25CLENBQUMsWUFBWSxDQUFDLFFBQVEsR0FBRyxjQUFjO01BQ3ZDLENBQUMsWUFBWSxDQUFDLEtBQUssR0FBRyxXQUFXO01BQ2pDLENBQUMsWUFBWSxDQUFDLElBQUksR0FBRyxJQUFJLFVBQVUsQ0FBQyxLQUFLLEVBQUUsTUFBTSxDQUFDO01BQ2xELENBQUMsWUFBWSxDQUFDLE1BQU0sR0FBRyxZQUFZO0tBQ3BDLENBQUM7SUFDRixXQUFXLENBQUMsa0JBQWtCLEVBQUUsQ0FBQztHQUNsQzs7RUFFRCxPQUFPLGtCQUFrQixHQUFHO0lBQzFCLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLFFBQVEsQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0dBQzNDOztFQUVELE9BQU8sZUFBZSxHQUFHO0lBQ3ZCLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLEtBQUssQ0FBQyxDQUFDLElBQUksRUFBRSxDQUFDO0dBQ3hDOztFQUVELE9BQU8sY0FBYyxDQUFDLEtBQUssRUFBRTtJQUMzQixJQUFJLENBQUMsTUFBTSxDQUFDLFlBQVksQ0FBQyxJQUFJLENBQUMsQ0FBQyxJQUFJLENBQUMsS0FBSyxDQUFDLENBQUM7R0FDNUM7O0VBRUQsT0FBTyxlQUFlLENBQUMsS0FBSyxFQUFFO0lBQzVCLE1BQU0sQ0FBQyxLQUFLLEVBQUUsQ0FBQztJQUNmLE1BQU0sQ0FBQyxVQUFVLENBQUMsS0FBSyxFQUFFLEtBQUssQ0FBQyxJQUFJLENBQUM7UUFDaEMsSUFBSSxDQUFDLE1BQU0sTUFBTSxDQUFDLFVBQVUsQ0FBQyxLQUFLLENBQUMsSUFBSSxDQUFDLENBQUM7UUFDekMsSUFBSSxDQUFDLElBQUksQ0FBQyxNQUFNLENBQUMsWUFBWSxDQUFDLE1BQU0sQ0FBQyxDQUFDLElBQUksQ0FBQyxDQUFDO0dBQ2pEO0NBQ0Y7O0FBRUQsSUFBSSxLQUFLLEdBQUcsRUFBRSxDQUFDOztBQUVmLE1BQU0sUUFBUSxHQUFHLENBQUMsSUFBSSxLQUFLO0VBQ3pCLEtBQUssR0FBRyxJQUFJLENBQUM7RUFDYixPQUFPLE1BQU0sQ0FBQyxRQUFRLENBQUMsSUFBSSxDQUFDLENBQUM7Q0FDOUIsQ0FBQzs7QUFFRixNQUFNLENBQUMsUUFBUSxFQUFFO0tBQ1osSUFBSSxDQUFDLFFBQVEsQ0FBQztLQUNkLElBQUksQ0FBQyxXQUFXLENBQUMsSUFBSSxDQUFDO0tBQ3RCLEtBQUssQ0FBQ0MsV0FBSyxDQUFDLElBQUksQ0FBQyxDQUFDOzs7OyIsInNvdXJjZVJvb3QiOiIvc291cmNlLyJ9
