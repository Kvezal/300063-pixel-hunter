const TypeOfLevels = {
  FIRST: `two-of-two`,
  SECOND: `tinder-like`,
  THIRD: `one-of-three`
};

const getParametersOfImages = (level) => {
  return level.answers.map((item) => {
    if (item.type === `painting`) {
      item.type = `paint`;
    }

    return {
      url: item.image.url,
      width: item.image.width,
      height: item.image.height,
      type: item.type
    };
  });
};

const adaptFirstLevelType = (level) => {

  return {
    question: level.question,
    type: `first`,
    images: getParametersOfImages(level, `third`)
  };
};

const adaptSecondLevelType = (level) => {
  return {
    question: level.question,
    type: `second`,
    image: getParametersOfImages(level)[0]
  };
};

const adaptThirdLevelType = (level) => {
  let amountPaint = 0;

  const images = level.answers.map((item) => {
    if (item.type === `painting`) {
      item.type = `paint`;
      ++amountPaint;
    }
    return {
      url: item.image.url,
      width: item.image.width,
      height: item.image.height,
      type: item.type
    };
  });

  let answer = `paint`;
  if (amountPaint === 2) {
    answer = `photo`;
  }

  return {
    question: level.question,
    answer,
    type: `third`,
    images
  };
};

const AdaptTypeOfLevels = {
  [TypeOfLevels.FIRST]: adaptFirstLevelType,
  [TypeOfLevels.SECOND]: adaptSecondLevelType,
  [TypeOfLevels.THIRD]: adaptThirdLevelType
};

const adapt = (data) => {
  return data.map((item) => {
    return AdaptTypeOfLevels[item.type](item);
  });
};

export default adapt;
