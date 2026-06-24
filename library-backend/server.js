const { ApolloServer } = require('@apollo/server')
const { startStandaloneServer } = require('@apollo/server/standalone')
const jwt = require('jsonwebtoken')

const typeDefs = require('./schema')
const resolvers = require('./resolvers')
const User = require('./models/user')
const { GraphQLError } = require('graphql/error')

const startServer = port => {
  const server = new ApolloServer({
    typeDefs,
    resolvers
  })

  startStandaloneServer(server, {
    listen: { port },
    context: async ({ req }) => {
      const auth = req.headers.authorization

      if (!auth || !auth.toLowerCase().startsWith('bearer ')) {
        return null
      }

      const decodedToken = jwt.decode(auth.substring(7), process.env.JWT_SECRET)

      const currentUser = await User.findById(decodedToken?.id)

      return { currentUser }
    }
  })
}

module.exports = startServer
