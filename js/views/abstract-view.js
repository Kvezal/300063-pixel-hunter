import Utils from '../lib/utils';

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

export default AbstractView;
