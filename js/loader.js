import adapt from './data/data-adapter';
import loadImage from './lib/load-image';

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

export default Loader;
