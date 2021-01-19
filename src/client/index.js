const { initUsers, getUsers } = require('./database')
const { River } = require('./River')
const { request } = require('gaxios')

async function main () {
  await initUsers()
  const users = await getUsers()

  const stream$ = new River()

  const users$ = stream$.flow({
    cursor: users,
    concurrency: 25,
    handler: async (user) => {
      const result = await request({
        url: 'http://server:3000/api/v1/users',
        method: 'POST',
        data: { user }
      })

      console.log(result.data.user.id)
    }
  })

  users$.subscribe()
}

main()
