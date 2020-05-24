import ClassicGameState from './abstract';
import { UserError } from '../../../utils/errors';
import { repositories } from '../../../data/database';

class ClassicGameStateEnded extends ClassicGameState {
    private timerTask?: NodeJS.Timeout;

    public async enter() {
        const { winnerId, winnerTicket, winnerBetsPrice, winnerChance } = this.game;

        if (winnerId === null || winnerTicket === null || winnerBetsPrice === null || winnerChance === null) {
            throw new Error(`Winner is not defined in game #${this.game.gameId} on ended state`);
        }

        this.game.finishedAt = new Date();

        this.game.timer = this.game.endedTimer;
        this.timerTask = setInterval(() => {
            --this.game.timer;
            if (this.game.timer === 0) {
                this.game.createNewGame();
            }
        }, 1000);

        const wonFund = this.game.fund.minus(this.game.fund.times(this.game.commissionPercent).div(100));
        await repositories.users.giveMoney(winnerId, Number(wonFund.toFixed(2)));

        await repositories.classicGames.endGame(
            this.game.gameId,
            winnerId,
            winnerTicket,
            Number(winnerBetsPrice.toFixed(2)),
            winnerChance,
            this.game.finishedAt,
        );
    }

    public async exit() {
        if (this.timerTask) {
            clearInterval(this.timerTask);
        }
    }

    // eslint-disable-next-line class-methods-use-this
    public async placeBet() {
        throw new UserError('CLASSIC_GAME_ENDED_ERROR');
    }
}

export default ClassicGameStateEnded;
