const GameParameters = {
  NUMBER_QUESTIONS: 3
};

const initialState = {
  level: 0
};

const quest = [
  {
    question: `Угадайте для каждого изображения фото или рисунок?`,
    type: `first`,
    images: [
      {
        url: `https://k42.kn3.net/CF42609C8.jpg`,
        type: `paint`
      },
      {
        url: `http://i.imgur.com/1KegWPz.jpg`,
        type: `photo`
      }
    ]
  },
  {
    question: `Угадай, фото или рисунок?`,
    type: `second`,
    image: {
      url: `https://i.imgur.com/DiHM5Zb.jpg`,
      type: `photo`
    }
  },
  {
    question: `Найдите рисунок среди изображений`,
    type: `third`,
    images: [
      {
        url: `https://k32.kn3.net/5C7060EC5.jpg`,
        type: `paint`
      },
      {
        url: `http://i.imgur.com/DKR1HtB.jpg`,
        type: `photo`
      },
      {
        url: `https://i.imgur.com/DiHM5Zb.jpg`,
        type: `photo`
      }
    ]
  }
];

export {quest, GameParameters, initialState};

/*const images = {
  paintings: [
    // People
    `https://k42.kn3.net/CF42609C8.jpg`,

    // Animals
    `https://k42.kn3.net/D2F0370D6.jpg`,

    // Nature
    `https://k32.kn3.net/5C7060EC5.jpg`
  ],
  photos: [
    // People
    `http://i.imgur.com/1KegWPz.jpg`,

    // Animals
    `https://i.imgur.com/DiHM5Zb.jpg`,

    // Nature
    `http://i.imgur.com/DKR1HtB.jpg`
  ]
};*/
