import ClassicGameState from './abstract';
import { repositories } from '../../../data/database';
import { ClassicGameState as ClassicGameStateEnum } from '../../../data/models/ClassicGame';
import { User } from '../../../data/models/User';
import ClassicGameStateBlocking from './blocking';

class ClassicGameStateCountdown extends ClassicGameState {
    private timerTask?: NodeJS.Timeout;

    public async enter() {
        this.game.timer = this.game.countdownTimer;
        this.timerTask = setInterval(() => {
            --this.game.timer;
            if (this.game.timer === 0) {
                this.game.switchTo(new ClassicGameStateBlocking(this.game));
            }
        }, 1000);

        await repositories.classicGames.updateState(this.game.gameId, ClassicGameStateEnum.Countdown);
    }

    public async exit() {
        if (this.timerTask) {
            clearInterval(this.timerTask);
        }
    }

    public async placeBet(user: User, amount: number) {
        return this.game.placeBet0(user, amount);
    }
}

export default ClassicGameStateCountdown;
