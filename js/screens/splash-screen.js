import AbstractView from '../views/abstract-view';
import Utils from '../lib/utils';

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

export default new SplashScreen();
