import ClassicGameState from './abstract';
import { ClassicGameBet, ClassicGameClientSnapshot } from '../classicGame';
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
        this.game.maxTimer = this.game.endedTimer;
        this.timerTask = setInterval(() => {
            --this.game.timer;
            if (this.game.timer === 0) {
                this.game.resurrect();
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
    public async placeBet(): Promise<ClassicGameBet> {
        throw new UserError('CLASSIC_GAME_ENDED_ERROR');
    }

    public async clientSnapshot(): Promise<ClassicGameClientSnapshot> {
        return {
            gameId: this.game.gameId,
            state: 'Ended',
            randomNumber: this.game.randomNumber,
            hash: this.game.hash,
            fund: this.game.fund,
            winnerId: this.game.winnerId ?? undefined,
            winnerTicket: this.game.winnerTicket ?? undefined,
            timer: this.game.timer,
            maxTimer: this.game.maxTimer,
            bets: this.game.bets,
            players: this.game.players,
            culminationDegree: this.game.culminationDegree,
        };
    }
}

export default ClassicGameStateEnded;
