import ClassicGameState from './abstract';
import { ClassicGameBet, ClassicGameClientSnapshot } from '../classicGame';
import { UserError } from '../../../utils/errors';
import ClassicGameStateCulmination from './culmination';

class ClassicGameStateBlocking extends ClassicGameState {
    public async enter() {
        await this.game.betsLocker.waitAll();
        await this.game.switchTo(new ClassicGameStateCulmination(this.game));
    }

    // eslint-disable-next-line class-methods-use-this
    public async placeBet(): Promise<ClassicGameBet> {
        throw new UserError('CLASSIC_GAME_IN_PROGRESS_ERROR');
    }

    public async clientSnapshot(): Promise<ClassicGameClientSnapshot> {
        return {
            gameId: this.game.gameId,
            state: 'Countdown',
            hash: this.game.hash,
            fund: this.game.fund,
            timer: this.game.timer,
            maxTimer: this.game.maxTimer,
            bets: this.game.bets,
            players: this.game.players,
        };
    }
}

export default ClassicGameStateBlocking;
