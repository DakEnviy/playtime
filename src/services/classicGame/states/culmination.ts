import ClassicGameState from './abstract';
import { UserError } from '../../../utils/errors';
import { repositories } from '../../../data/database';
import { ClassicGameState as ClassicGameStateEnum } from '../../../data/models/ClassicGame';
import ClassicGameStateEnded from './ended';

class ClassicGameStateCulmination extends ClassicGameState {
    private timerTask?: NodeJS.Timeout;

    public async enter() {
        // Определение победителя
        const winnerTicket = Math.floor(this.game.currentLastTicket * this.game.randomNumber) + 1;
        this.game.bets.some(bet => {
            if (bet.firstTicket <= winnerTicket && winnerTicket <= bet.lastTicket) {
                this.game.winnerId = bet.userId;
                return true;
            }
            return false;
        });

        if (this.game.winnerId === null) {
            throw new Error(`Winner is not defined in game #${this.game.gameId} on culmination state`);
        }

        const player = this.game.players.get(this.game.winnerId);
        if (!player) {
            throw new Error(`Winner is not exists in players map in game #${this.game.gameId}`);
        }

        this.game.winnerTicket = winnerTicket;
        this.game.winnerBetsPrice = player.betsPrice;
        this.game.winnerChance = player.chance;

        this.game.timer = this.game.culminationTimer + this.game.endedTimer;
        this.timerTask = setInterval(() => {
            --this.game.timer;
            if (this.game.timer === this.game.endedTimer) {
                this.game.switchTo(new ClassicGameStateEnded(this.game));
            }
        }, 1000);

        await repositories.classicGames.updateState(this.game.gameId, ClassicGameStateEnum.Culmination);
    }

    public async exit() {
        if (this.timerTask) {
            clearInterval(this.timerTask);
        }
    }

    // eslint-disable-next-line class-methods-use-this
    public async placeBet() {
        throw new UserError('CLASSIC_GAME_IN_PROGRESS_ERROR');
    }
}

export default ClassicGameStateCulmination;
