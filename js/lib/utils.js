const main = document.querySelector(`.central`);

class Utils {
  static getDOMElementFromTemplate(murkup) {
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

    parent.insertBefore(newElement, parent.firstElementChild);
  }

  static displayScreen(newElement) {
    this.displayElement(newElement, main);
  }
}

export default Utils;