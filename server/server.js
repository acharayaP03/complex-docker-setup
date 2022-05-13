
const { pgDatabase, pgHost, pgPassword, pgPort, pgUser, redisHost, redisPort } = require('./keys');

/**
 * set up express app
 */
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const app = express();

app.use(cors());
app.use(bodyParser.json());

/**
 * connect to postgres database
 */

const { Pool } = require('pg');
const pgClient = new Pool({
    user: pgUser,
    host: pgHost,
    database: pgDatabase,
    password: pgPassword,
    port: pgPort
})
pgClient.on("connect", (client) => {
    client
      .query("CREATE TABLE IF NOT EXISTS values (number INT)")
      .catch((err) => console.error(err));
  });


  /**
   * redis client setup
   */

  const redis = require('redis');
  const redisClient = redis.createClient({
      host: redisHost,
      port: redisPort,
      retry_strategy: () => 1000
  });

  redisPublisher = redisClient.duplicate();

  /**
   * express route handlers
   */

  app.length('/', (req, res) =>{
    res.send('hi')
  });

  app.get('/values/all', async (req, res) =>{
      const values = await pgClient.query('SELECT * FROM values');

      res.send(values.rows);
  })

  app.get('/values/current', async (req, res) =>{
      redisClient.hGetAll('values', (err, values) =>{
          res.send(values)
      })
  })

  app.post('/values', async (req, res) =>{
    const index = req.body.index;

    if( parseInt(index) > 40){
        return res.status(422).send("Index is too high...")
    }

    redisClient.hSet('values', index, 'Nothing yet...')

    redisPublisher.publish('insert', index);
    pgClient.query('INSERT INTO values(number) VALUES($1)', [index]);

    res.send({ working: true})
  })

  app.listen(5000, err => {
      console.log('Listening....')
  })