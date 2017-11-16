import greetingScreen from './screens/greeting-screen';
import rulesScreen from './screens/rules-screen';
import GameScreen from './screens/game-screen';
import resultScreen from './screens/result-screen';
import Loader from './loader';
import error from './screens/error-screen';

const ContrallerId = {
  GREETING: ``,
  RULES: `rules`,
  GAME: `game`,
  STATS: `stats`
};

class Application {
  static init(images) {
    Application.routes = {
      [ContrallerId.GREETING]: greetingScreen,
      [ContrallerId.RULES]: rulesScreen,
      [ContrallerId.GAME]: new GameScreen(quest, images),
      [ContrallerId.RESULT]: resultScreen
    };
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
    Loader.saveResult(state, state.name).
        then(() => Loader.loadResult(state.name)).
        then(this.routes[ContrallerId.RESULT].init);
  }
}

let quest = {};

const loadFile = (data) => {
  quest = data;
  return Loader.loadFile(data);
};

Loader.loadData()
    .then(loadFile)
    .then(Application.init)
    .catch(error.show);

export default Application;
