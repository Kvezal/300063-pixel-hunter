import AbstractView from './abstract-view';

class LevelThirdTypeView extends AbstractView {
  constructor(gameView) {
    super();

    this.answerHandler = gameView.thirdLevelType.answerHandler;
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
    const options = element.querySelectorAll(`.game__option`);
    [...options].forEach((option) => {
      option.onclick = (evt) => this.answerHandler(evt);
    });
  }
}

export default LevelThirdTypeView;
