const initialState = {
  lives: 3,
  time: 30,
  level: 0
};

const GameParameters = {
  MIN_COUNT_LIVES: 0,
  MIN_COUNT_TIME: 0,
  NUMBER_ANSWERS: 10,
  AMOUNT_MILISECONDS_IN_SECONDS: 1000
};

const amountPoints = {
  CORRECT_ANSWER: 100,
  BONUS_FOR_FAST_ANSWER: 50,
  BONUS_FOR_SLOW_ANSWER: -50,
  BONUS_FOR_LIVES_LEFT: 50
};

export {GameParameters, initialState, amountPoints};
