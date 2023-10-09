import { createClient } from 'redis';

const redisCli = createClient({
    password: process.env.REDIS_PASSWORD,
    socket: {
        host: process.env.REDIS_HOST,
        port: +(process.env.REDIS_PORT || 0),
    },
});
redisCli.on('error', (err) => console.log('Redis Client Error', err));

(async function connectRedis() {
    await redisCli.connect();
})();

export default redisCli;
