import ClassicGameState from './abstract';
import { User } from '../../../data/models/User';
import ClassicGameStateCountdown from './countdown';

class ClassicGameWaitingState extends ClassicGameState {
    public async enter() {
        this.game.timer = this.game.countdownTimer;
    }

    public async placeBet(user: User, amount: number) {
        await this.game.placeBet0(user, amount);

        if (this.game.players.size >= this.game.minPlayersToStartCountdown) {
            await this.game.switchTo(new ClassicGameStateCountdown(this.game));
        }
    }
}

export default ClassicGameWaitingState;
