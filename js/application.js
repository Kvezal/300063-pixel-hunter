import greetingScreen from './screens/greeting-screen';
import rulesScreen from './screens/rules-screen';
import GameScreen from './screens/game-screen';
import resultScreen from './screens/result-screen';
import Loader from './loader';

const ContrallerId = {
  GREETING: ``,
  RULES: `rules`,
  GAME: `game`,
  STATS: `stats`
};

class Application {
  static init() {
    Application.routes = {
      [ContrallerId.GREETING]: greetingScreen,
      [ContrallerId.RULES]: rulesScreen,
      [ContrallerId.GAME]: new GameScreen(quest),
      [ContrallerId.RESULT]: resultScreen
    };
    console.log(quest)
    Application.showGreetingScreen();
  }

  static showGreetingScreen() {
    this.routes[ContrallerId.GREETING].init();
  }

  static showRulesScreen() {
    this.routes[ContrallerId.RULES].init();
  }

  static showGameScreen(state) {
    this.routes[ContrallerId.GAME].init(state);
  }

  static showStatsScreen(state) {
    this.routes[ContrallerId.RESULT].init(state);
  }
}

let quest = {};

const loadFile = (data) => {
  quest = data;
  return Loader.loadFile(data);
};

Loader.loadData()
    .then(loadFile)
    .then(Application.init);

export default Application;
