const jwt = require('jsonwebtoken')
const { GraphQLError } = require('graphql/error')
const { PubSub } = require('graphql-subscriptions')
const Author = require('./models/author')
const Book = require('./models/book')
const User = require('./models/user')
const { subscribe } = require('graphql')

const pubsub = new PubSub()

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allAuthors: async () => Author.find({}),
    allBooks: async (root, args) => {
      let book, author

      if (args.author) {
        author = await Author.findOne({ name: args.author })
      }

      if (args.author && args.genre) {
        book = Book.find({
          author: author._id,
          genres: args.genre
        })
      } else if (args.author) {
        book = Book.find({
          author: author._id
        })
      } else if (args.genre) {
        book = Book.find({
          genres: args.genre
        })
      } else {
        book = Book.find({})
      }

      return book.populate('author')
    },
    me: async (root, args, context) => context.currentUser
  },
  Mutation: {
    addBook: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED'
          }
        })
      }

      let author = await Author.findOne({
        name: args.author
      })

      if (!author) {
        author = new Author({
          name: args.author,
          born: null
        })

        try {
          await author.save()
        } catch (error) {
          throw new GraphQLError(`Saving author failed: ${error.message}`, {
            extensions: {
              code: 'BAD_USER_INPUT',
              error
            }
          })
        }
      }

      const book = await Book.findOne({
        title: args.title,
        author: author._id
      })

      if (book) {
        throw new GraphQLError(
          `${book.title} by ${book.author} already exists`,
          {
            extensions: {
              code: 'BAD_USER_INPUT',
              invalidArgs: [book.title, book.author]
            }
          }
        )
      }

      const newBook = new Book({
        ...args,
        author: author._id
      })

      try {
        await newBook.save()
        await newBook.populate('author')
      } catch (error) {
        throw new GraphQLError(`Saving book failed: ${error.message}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            error
          }
        })
      }

      pubsub.publish('BOOK_ADDED', { bookAdded: newBook })

      return newBook
    },

    editAuthor: async (root, args, context) => {
      if (!context.currentUser) {
        throw new GraphQLError('Not authenticated', {
          extensions: {
            code: 'UNAUTHENTICATED'
          }
        })
      }

      const author = await Author.findOne({ name: args.name })

      if (!author) {
        return null
      }

      author.born = args.setBornTo

      try {
        await author.save()
      } catch (error) {
        throw new GraphQLError(`Updating author failed: ${error.message}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            invalidArgs: args.setBornTo,
            error
          }
        })
      }

      return author
    },

    createUser: async (root, args) => {
      if (!args.username || !args.favoriteGenre) {
        throw new GraphQLError(
          `Both username and favorite genre must not be empty`,
          {
            extensions: {
              code: 'BAD_USER_INPUT'
            }
          }
        )
      }

      const username = args.username.toLowerCase()
      const favoriteGenre = args.favoriteGenre.toLowerCase()

      const userExists = await User.exists({ username: username })
      if (userExists) {
        throw new GraphQLError(`username already exists: ${username}`, {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      const newUser = new User({
        username,
        favoriteGenre
      })

      return await newUser.save().catch(error => {
        throw new GraphQLError(`Saving user failed: ${error.message}`, {
          extensions: {
            code: 'BAD_USER_INPUT',
            error
          }
        })
      })
    },

    login: async (root, args) => {
      if (!args.username || !args.password) {
        throw new GraphQLError('Both username and password are required', {
          extensions: {
            code: 'BAD_USER_INPUT'
          }
        })
      }

      const username = args.username.toLowerCase()

      const user = await User.findOne({ username: args.username })

      if (!user || args.password !== 'secret') {
        throw new GraphQLError('wrong username or password', {
          extensions: {
            code: 'UNAUTHENTICATED'
          }
        })
      }

      const userForToken = {
        id: user._id,
        username: user.username
      }

      const token = jwt.sign(userForToken, process.env.JWT_SECRET)

      return { value: token }
    },

    _resetDatabase: async () => {
      if (process.env.NODE_ENV !== 'test') {
        throw new GraphQLError('_resetDatabase is only available in test mode')
      }
      await Author.deleteMany({})
      await Book.deleteMany({})
      await User.deleteMany({})
      return true
    }
  },
  Subscription: {
    bookAdded: {
      subscribe: () => pubsub.asyncIterableIterator('BOOK_ADDED')
    }
  }
}

module.exports = resolvers
