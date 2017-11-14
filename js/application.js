import greetingScreen from './screens/greeting-screen';
import rulesScreen from './screens/rules-screen';
import GameScreen from './screens/game-screen';
import resultScreen from './screens/result-screen';
import {quest} from './data/data';

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
  [ContrallerId.RESULT]: resultScreen
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

  static showStatsScreen(state) {
    routes[ContrallerId.RESULT].init(state);
  }
}
Application.showGreetingScreen();

export default Application;
