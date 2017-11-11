import greetingScreen from './screens/greeting-screen';
import rulesScreen from './screens/rules-screen';
import GameScreen from './screens/game-screen';
import statsScreen from './screens/stats-screen';
import {quest, initialState} from './data/data';

const ContrallerId = {
  GREETING: ``,
  RULES: `rules`,
  GAME: `game`,
  STATS: `stats`
};

const routes = {
  [ContrallerId.GREETING]: greetingScreen,
  [ContrallerId.RULES]: rulesScreen,
  [ContrallerId.GAME]: new GameScreen(quest),
  [ContrallerId.STATS]: statsScreen
};

class Application {
  static showGreetingScreen() {
    routes[ContrallerId.GREETING].init();
  }

  static showRulesScreen() {
    routes[ContrallerId.RULES].init();
  }

  static showGameScreen(state) {
    routes[ContrallerId.GAME].init(state);
  }

  static showStatsScreen() {
    routes[ContrallerId.STATS].init();
  }
}
Application.showGreetingScreen();

export default Application;
