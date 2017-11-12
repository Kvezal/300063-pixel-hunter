import PlayerView from '../views/player-view';
import Utils from './utils';

const displayHeader = (view) => {
  const player = new PlayerView(view).element;
  Utils.displayElement(player, view.header);
};

export default displayHeader;
