import AbstractView from '../views/abstract-view';
import Utils from '../lib/utils';

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

export default ErrorScreen;
