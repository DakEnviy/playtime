import { Request } from 'express';
import { rule } from 'graphql-shield';
import Redis, { RedisOptions } from 'ioredis';

import { User } from '../../data/models/User';
import config from '../../config';
import { UserError } from './errors';

const redisOptions: RedisOptions = {
    host: config.redis.host,
    port: config.redis.port,
    retryStrategy: times => Math.min(times * 50, 2000),
};

const redis = new Redis(redisOptions);

const incrTtlLuaScript = `redis.call('set', KEYS[1], 0, 'EX', ARGV[2], 'NX') \
local consumed = redis.call('incrby', KEYS[1], ARGV[1]) \
local ttl = redis.call('pttl', KEYS[1]) \
if ttl == -1 then \
  redis.call('expire', KEYS[1], ARGV[2]) \
  ttl = 1000 * ARGV[2] \
end \
return {consumed, ttl} \
`;

redis.defineCommand('gqlslIncr', {
    numberOfKeys: 1,
    lua: incrTtlLuaScript,
});

const limit = (
    secDuration: number,
    points: number = 1,
    error: (key: string, ttl: number) => Error = () => new UserError('FREQUENT_REQUESTS'),
    keyPrefix: string = 'gqlsl',
) => {
    return rule({ cache: 'no_cache' })(async (_0, _1, ctx: { req: Request; user?: User }) => {
        const key = ctx.user ? ctx.user.id : ctx.req.ip;
        const [currentPoints, ttl] = await redis.gqlslIncr(`${keyPrefix}:${key}`, 1, secDuration);

        if (currentPoints > points) {
            return error(key, ttl);
        }

        return true;
    });
};

export default limit;
