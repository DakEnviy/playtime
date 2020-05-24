import BaseRepository from './base';
import { ClassicGame, ClassicGameState } from '../models/ClassicGame';
import { UserError } from '../../utils/errors';

class ClassicGamesRepository extends BaseRepository {
    async getGameById(gameId: string): Promise<ClassicGame | null> {
        return this.db.ClassicGame.findByPk(gameId);
    }

    async getGameByIdStrict(gameId: string): Promise<ClassicGame> {
        const game = await this.getGameById(gameId);

        if (!game) {
            throw new UserError('NO_GAME');
        }

        return game;
    }

    async createGame(randomNumber: string, hash: string): Promise<ClassicGame> {
        return this.db.ClassicGame.create({ randomNumber, hash });
    }

    async updateState(gameId: string, state: ClassicGameState): Promise<ClassicGame> {
        const game = await this.getGameByIdStrict(gameId);

        return game.update({ state });
    }

    async updateFund(gameId: string, fund: number): Promise<ClassicGame> {
        const game = await this.getGameByIdStrict(gameId);

        return game.update({ fund });
    }

    async endGame(
        gameId: string,
        winnerId: string,
        winnerTicket: number,
        winnerBetsPrice: number,
        winnerChance: number,
        finishedAt: Date,
    ): Promise<ClassicGame> {
        const game = await this.getGameByIdStrict(gameId);

        return game.update({
            winnerId,
            winnerTicket,
            winnerBetsPrice,
            winnerChance,
            finishedAt,
        });
    }
}

export default ClassicGamesRepository;
