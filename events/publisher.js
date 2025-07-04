const redis = require('redis')
const publisher = redis.createClient({
  url: `redis://${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
})
publisher.connect()

async function publicarEvento(canal, data) {
  await publisher.publish(canal, JSON.stringify(data))
}

module.exports = { publicarEvento }
