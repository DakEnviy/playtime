import Big from 'big.js';

import { sha256Hash } from '../../utils/crypto';
import { UserError } from '../../utils/errors';
import Locker from '../../utils/locker';
import { repositories } from '../../data/database';
import { User } from '../../data/models/User';
import ClassicGameState from './states/abstract';
import ClassicGameWaitingState from './states/waiting';

export interface ClassicGamePlayer {
    userId: string;
    username: string;
    avatar: string;
    betsPrice: Big;
    chance: number;
    startDegree: number;
    endDegree: number;
    color: string;
}

export interface ClassicGameBet {
    betId: string;
    userId: string;
    amount: number;
    firstTicket: number;
    lastTicket: number;
}

export interface ClassicGameClientSnapshot {
    gameId: string;
    state: string;
    randomNumber?: number;
    hash: string;
    fund: Big;
    winnerId?: string;
    winnerTicket?: number;
    timer: number;
    maxTimer: number;
    bets: ClassicGameBet[];
    players: ClassicGamePlayer[];
    culminationDegree?: number;
    remainingCulminationDuration?: number;
}

export class ClassicGameService {
    // Настройки игры
    public countdownTimer: number = 10;
    public culminationTimer: number = 10;
    public endedTimer: number = 5;
    public minBetAmount: number = 0;
    public minPlayersToStartCountdown: number = 1;
    public commissionPercent: number = 1;

    // Текущее состояние игры
    public state: ClassicGameState | null = null;
    public isUndead: boolean = true;

    // Рантайм поля, напрямую связянные с БД
    public gameId: string = '0';
    public randomNumber: number = 0.5;
    public hash: string = 'DEFAULT_HASH';
    public fund: Big = new Big(0);
    public winnerId: string | null = null;
    public winnerTicket: number | null = null;
    public winnerBetsPrice: Big | null = null;
    public winnerChance: number | null = null;
    public finishedAt: Date | null = null;

    // Рантайм поля, не связянные с БД
    public timer: number = 30;
    public maxTimer: number = 30;
    public currentLastTicket: number = 0;
    public bets: ClassicGameBet[] = [];
    public players: ClassicGamePlayer[] = [];
    public culminationDegree?: number;

    public betsLocker: Locker = new Locker();

    public async placeBet(user: User, amount: number): Promise<ClassicGameBet> {
        return this.getStateStrict().placeBet(user, amount);
    }

    public async clientSnapshot(): Promise<ClassicGameClientSnapshot> {
        return this.getStateStrict().clientSnapshot();
    }

    public async createNewGame(): Promise<void> {
        await this.updateSettings();

        const randomNumber = Math.random().toFixed(18);
        this.randomNumber = Number(randomNumber);
        this.hash = sha256Hash(randomNumber);

        const game = await repositories.classicGames.createGame(randomNumber, this.hash);
        this.gameId = game.id;

        this.fund = new Big(0);
        this.winnerId = null;
        this.winnerTicket = null;
        this.winnerBetsPrice = null;
        this.winnerChance = null;
        this.finishedAt = null;

        this.timer = this.countdownTimer;
        this.maxTimer = this.countdownTimer;
        this.currentLastTicket = 0;
        this.bets = [];
        this.players = [];
        this.culminationDegree = undefined;
    }

    public async placeBet0(user: User, amount: number): Promise<ClassicGameBet> {
        if (amount < this.minBetAmount) {
            throw new UserError('CLASSIC_GAME_MIN_BET_PRICE_ERROR');
        }

        await this.betsLocker.lock();

        await repositories.users.withdrawMoney(user.id, amount);

        const newLastTicket = Math.round(this.currentLastTicket + amount * 100);
        const { id: betId, firstTicket, lastTicket } = await repositories.classicGameBets.createBet(
            this.gameId,
            user.id,
            amount,
            this.currentLastTicket + 1,
            newLastTicket,
        );

        this.fund = this.fund.plus(amount);
        this.currentLastTicket = newLastTicket;

        const bet: ClassicGameBet = {
            betId,
            userId: user.id,
            amount,
            firstTicket,
            lastTicket,
        };
        this.bets.push(bet);

        const currentPlayerIdx = this.players.findIndex(player => player.userId === user.id);
        const currentPlayer = currentPlayerIdx !== -1 ? this.players[currentPlayerIdx] : undefined;
        const currentBetsPrice = currentPlayer ? currentPlayer.betsPrice : new Big(0);
        const newBetsPrice = currentBetsPrice.plus(amount);

        this.players.splice(currentPlayerIdx, 1, {
            userId: user.id,
            username: user.avatar,
            avatar: user.avatar,
            betsPrice: newBetsPrice,
            chance: Number(
                newBetsPrice
                    .div(this.fund)
                    .times(100)
                    .toFixed(1),
            ),
            startDegree: 0,
            endDegree: 0,
            color: '#ff0000',
        });

        await repositories.classicGames.updateFund(this.gameId, Number(this.fund.toFixed(2)));

        this.betsLocker.end();

        return bet;
    }

    public async updateSettings(): Promise<void> {
        this.countdownTimer = await repositories.settings.getSettingAsNumber('classic::countdownTimer');
        this.culminationTimer = await repositories.settings.getSettingAsNumber('classic::culminationTimer');
        this.endedTimer = await repositories.settings.getSettingAsNumber('classic::endedTimer');
        this.minBetAmount = await repositories.settings.getSettingAsNumber('classic::minBetAmount');
        this.minPlayersToStartCountdown = await repositories.settings.getSettingAsNumber(
            'classic::minPlayersToStartCountdown',
        );
        this.commissionPercent = await repositories.settings.getSettingAsNumber('classic::commissionPercent');
    }

    public async initStart(): Promise<void> {
        this.setUndead(true);
        await this.spawn();
    }

    public async spawn(): Promise<void> {
        await this.newCycle();
    }

    public async kill(): Promise<void> {
        await this.stop();
    }

    public async resurrect(): Promise<void> {
        if (!this.isUndead) return;

        await this.newCycle();
    }

    public async newCycle(): Promise<void> {
        await this.createNewGame();
        await this.start();
    }

    public async start(): Promise<void> {
        await this.switchTo(new ClassicGameWaitingState(this));
    }

    public async stop(): Promise<void> {
        await this.state?.exit();
    }

    public async switchTo(state: ClassicGameState): Promise<void> {
        if (this.state) {
            await this.state.exit();
        }
        await state.enter();
        this.state = state;
    }

    public getStateStrict(): ClassicGameState {
        if (!this.state) {
            throw new Error('State is not defined');
        }
        return this.state;
    }

    public setUndead(isUndead: boolean) {
        this.isUndead = isUndead;
    }
}
