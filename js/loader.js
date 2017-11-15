import adapt from './data/data-adapter';
import loadImage from './lib/load-image';

const SERVER_URL = `https://es.dump.academy/pixel-hunter`;

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
