import AbstractView from './abstract-view';
import displayHeader from '../lib/display-header';

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

export default RulesView;
