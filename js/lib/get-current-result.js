import {amountPoints} from '../data/data';
import Utils from './utils';

const getCurrentResult = (state) => {
  const currentResult = {
    amountCorrectAnswers: 0,
    amountFastAnswers: 0,
    amountSlowAnswers: 0,
    amountLivesLeft: state.lives
  };

  const countTotalPoints = ((sum, item) => {
    switch (item) {
      case `correct`:
        ++currentResult.amountCorrectAnswers;
        sum += 100;
        break;
      case `fast`:
        ++currentResult.amountCorrectAnswers;
        ++currentResult.amountFastAnswers;
        sum += 150;
        break;
      case `slow`:
        ++currentResult.amountCorrectAnswers;
        ++currentResult.amountSlowAnswers;
        sum += 50;
        break;
    }
    return sum;
  });

  let totalPoints = state.answers.reduce(countTotalPoints, 0) +
      currentResult.amountLivesLeft * 50;

  return {
    totalPoints,

    correctAnswers: {
      pointsPerUnit: amountPoints.CORRECT_ANSWER,
      amount: currentResult.amountCorrectAnswers,
      points: Utils.countOfPoints(currentResult.amountCorrectAnswers, amountPoints.CORRECT_ANSWER)
    },

    bonusesAndPenalties: [
      {
        title: `Бонус за скорость`,
        type: `fast`,
        pointsPerUnit: amountPoints.BONUS_FOR_FAST_ANSWER,
        amount: currentResult.amountFastAnswers,
        points: Utils.countOfPoints(currentResult.amountFastAnswers, amountPoints.BONUS_FOR_FAST_ANSWER)
      },
      {
        title: `Бонус за жизни`,
        type: `alive`,
        pointsPerUnit: amountPoints.BONUS_FOR_LIVES_LEFT,
        amount: currentResult.amountLivesLeft,
        points: Utils.countOfPoints(currentResult.amountLivesLeft, amountPoints.BONUS_FOR_LIVES_LEFT)
      },
      {
        title: `Штраф за медлительность`,
        type: `slow`,
        pointsPerUnit: -amountPoints.BONUS_FOR_SLOW_ANSWER,
        amount: currentResult.amountSlowAnswers,
        points: Utils.countOfPoints(currentResult.amountSlowAnswers, amountPoints.BONUS_FOR_SLOW_ANSWER)
      }
    ]
  };
};

export default getCurrentResult;
