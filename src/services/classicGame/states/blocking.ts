import ClassicGameState from './abstract';
import { UserError } from '../../../utils/errors';
import ClassicGameStateCulmination from './culmination';

class ClassicGameStateBlocking extends ClassicGameState {
    public async enter() {
        await this.game.betsLocker.waitAll();
        await this.game.switchTo(new ClassicGameStateCulmination(this.game));
    }

    // eslint-disable-next-line class-methods-use-this
    public async placeBet() {
        throw new UserError('CLASSIC_GAME_IN_PROGRESS_ERROR');
    }
}

export default ClassicGameStateBlocking;
