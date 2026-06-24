const { v1: uuid } = require('uuid')
const { GraphQLError } = require('graphql/error')
const Author = require('./models/author')
const Book = require('./models/book')

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
    }
  },
  Mutation: {
    addBook: async (root, args) => {
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
              invalidArgs: [book.title, book.author],
              error
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

      return newBook
    },
    editAuthor: async (root, args) => {
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
    }
  }
}

module.exports = resolvers
