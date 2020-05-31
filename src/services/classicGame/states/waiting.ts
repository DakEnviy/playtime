import ClassicGameState from './abstract';
import { ClassicGameBet, ClassicGameClientSnapshot } from '../classicGame';
import { User } from '../../../data/models/User';
import ClassicGameStateCountdown from './countdown';

class ClassicGameWaitingState extends ClassicGameState {
    public async enter() {
        this.game.timer = this.game.countdownTimer;
        this.game.maxTimer = this.game.countdownTimer;
    }

    public async placeBet(user: User, amount: number): Promise<ClassicGameBet> {
        const bet = await this.game.placeBet0(user, amount);

        if (this.game.players.length >= this.game.minPlayersToStartCountdown) {
            await this.game.switchTo(new ClassicGameStateCountdown(this.game));
        }

        return bet;
    }

    public async clientSnapshot(): Promise<ClassicGameClientSnapshot> {
        return {
            gameId: this.game.gameId,
            state: 'Waiting',
            hash: this.game.hash,
            fund: this.game.fund,
            timer: this.game.timer,
            maxTimer: this.game.maxTimer,
            bets: this.game.bets,
            players: this.game.players,
        };
    }
}

export default ClassicGameWaitingState;
