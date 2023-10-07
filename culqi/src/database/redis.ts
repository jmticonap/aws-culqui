import { createClient } from 'redis';

const redisCli = createClient({
    password: 'nlDiYyKx4Pm7oHscaCpH9Ur51mAih74F',
    socket: {
        host: 'redis-18616.c8.us-east-1-4.ec2.cloud.redislabs.com',
        port: 18616,
    },
});
redisCli.on('error', (err) => console.log('Redis Client Error', err));

(async function connectRedis() {
    await redisCli.connect();
})();

export default redisCli;
