import AbstractView from './abstract-view';

class LevelThirdTypeView extends AbstractView {
  constructor() {
    super();
  }

  get template() {
    return (
      `<p class="game__task">Найдите рисунок среди изображений</p>
      <form class="game__content  game__content--triple">
        <div class="game__option">
          <img src="http://placehold.it/304x455" alt="Option 1" width="304" height="455">
        </div>
        <div class="game__option  game__option--selected">
          <img src="http://placehold.it/304x455" alt="Option 1" width="304" height="455">
        </div>
        <div class="game__option">
          <img src="http://placehold.it/304x455" alt="Option 1" width="304" height="455">
        </div>
      </form>`
    );
  }

  bind(element) {
    const form = element.querySelector(`.game__content`);
    form.onsubmit = (evt) => this.formHandler(evt);

    const options = form.querySelectorAll(`img`);
    options.forEach((option) => {
      option.onclick = (evt) => this.answerHandler(evt, form);
    });

  }
}

export default LevelThirdTypeView;
