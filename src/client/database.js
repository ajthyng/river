const { join } = require('path')
const { MongoClient } = require('mongodb')

const uri = 'mongodb://db:27017'

const applyFixtures = async (path, client) => {
  const fakeUsers = require(join(__dirname, path)).map(user => ({
    updateOne: {
      filter: { _id: user._id },
      update: { $set: { ...user } },
      upsert: true
    }
  }))

  const river = client.db('river')
  return await river.collection('users').bulkWrite(fakeUsers)
}

const dbClient = new MongoClient(uri, {
  useUnifiedTopology: true
})

module.exports = {
  async initUsers () {
    await dbClient.connect()
    await applyFixtures('fixtures.json', dbClient)
  },
  async getUsers () {
    const db = dbClient.db('river')
    return db.collection('users').find().sort({ id: 1 }).batchSize(5)
  }
}
