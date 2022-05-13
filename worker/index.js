const keys = require('./keys');
const redis = require('redis');

const redisClient = redis.createClient({
    host: keys.redisHost,
    port: keys.redisPort,
    retry_strategy: () => 1000
});

const sub = redisClient.duplicate();

/**
 * 
 * @param {*} index 
 * @returns 
 */
function fib(index){
    if( index < 2 ) return 1;
    return fib(index -1) + fib(index -2 );
}

/**
 * @returns new value every time redis sees 'message' 
 */

sub.on('message', (channel, message)=>{
    redisClient.hSet('values', message, fib(parseInt(message)))
})

sub.subscribe('insert')