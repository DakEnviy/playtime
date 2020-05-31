import { chain, IRules } from 'graphql-shield';
import { ModuleContext } from '@graphql-modules/core';

import { ClassicGameContext } from './index';
import { Resolver, Resolvers, TypeResolvers } from '../../../interfaces/graphql';
import {
    ClassicGame,
    ClassicGameBet,
    ClassicGamePlayer,
    Mutation,
    MutationPlaceClassicGameBetArgs,
    Query,
    // Subscription,
} from '../../../__generated__/graphql';
import { services } from '../../../services';
import {
    ClassicGameBet as ClassicGameBetBackend,
    ClassicGameClientSnapshot,
    ClassicGamePlayer as ClassicGamePlayerBackend,
} from '../../../services/classicGame/classicGame';
import { isAuth } from '../rules';
import { checkPlaceClassicGameBetArgs } from './rules';

export type OriginClassicGameParent = ClassicGameClientSnapshot;
export type OriginClassicGameBetParent = ClassicGameBetBackend;
export type OriginClassicGamePlayerParent = ClassicGamePlayerBackend;

type QueryType = Pick<Query, 'currentClassicGame' | 'classicGamesHistory'>;
type MutationType = Pick<Mutation, 'placeClassicGameBet'>;
// type SubscriptionType = Pick<
//     Subscription,
//     | 'placedClassicGameBet'
//     | 'startedClassicGame'
//     | 'updatedClassicGameTimer'
//     | 'switchedToClassicGameStateCulmination'
//     | 'switchedToClassicGameStateEnded'
// >;
type ClassicGameType = Pick<
    ClassicGame,
    | 'id'
    | 'state'
    | 'randomNumber'
    | 'hash'
    | 'fund'
    | 'winnerId'
    | 'winnerTicket'
    | 'timer'
    | 'maxTimer'
    | 'bets'
    | 'players'
    | 'culminationDegree'
    | 'remainingCulminationDuration'
>;
type ClassicGameBetType = Pick<ClassicGameBet, 'id' | 'userId' | 'amount'>;
type ClassicGamePlayerType = Pick<
    ClassicGamePlayer,
    'id' | 'username' | 'avatar' | 'startDegree' | 'endDegree' | 'color'
>;

interface QueryMapping {
    currentClassicGame: Resolver<OriginClassicGameParent>;
}

interface MutationMapping {
    placeClassicGameBet: Resolver<OriginClassicGameBetParent, MutationPlaceClassicGameBetArgs>;
}

interface ClassicGameMapping {
    // Переопределил state, чтобы не делать лишнюю type-guard проверку
    state: Resolver<string>;
    bets: Resolver<OriginClassicGameBetParent[]>;
    players: Resolver<OriginClassicGamePlayerParent[]>;
}

type ClassicGameResolvers = Resolvers<
    {
        Query: TypeResolvers<QueryType, QueryMapping>;
        Mutation: TypeResolvers<MutationType, MutationMapping>;
        // Subscription: TypeResolvers<SubscriptionType>;
        ClassicGame: TypeResolvers<ClassicGameType, ClassicGameMapping, OriginClassicGameParent>;
        ClassicGameBet: TypeResolvers<ClassicGameBetType, {}, OriginClassicGameBetParent>;
        ClassicGamePlayer: TypeResolvers<ClassicGamePlayerType, {}, OriginClassicGamePlayerParent>;
    },
    ModuleContext<ClassicGameContext>
>;

export const rules: IRules = {
    Mutation: {
        placeClassicGameBet: chain(isAuth, checkPlaceClassicGameBetArgs),
    },
};

export const resolvers: ClassicGameResolvers = {
    Query: {
        currentClassicGame: () => {
            return services.classicGame.clientSnapshot();
        },
        classicGamesHistory: () => {
            return [];
        },
    },
    Mutation: {
        placeClassicGameBet: (_0, { input: { amount } }, { user }) => {
            return services.classicGame.placeBet(user!, amount);
        },
    },
    ClassicGame: {
        id: snapshot => {
            return snapshot.gameId;
        },
        state: snapshot => {
            return snapshot.state;
        },
        fund: snapshot => {
            return Number(snapshot.fund.toFixed(2));
        },
        bets: snapshot => {
            return snapshot.bets;
        },
        players: snapshot => {
            return snapshot.players;
        },
    },
    ClassicGameBet: {
        id: bet => {
            return bet.betId;
        },
    },
    ClassicGamePlayer: {
        id: player => {
            return player.userId;
        },
    },
};
