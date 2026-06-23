const { v1: uuid } = require('uuid')
const { GraphQLError } = require('graphql/error')
const Author = require('./models/author')
const Book = require('./models/book')

const resolvers = {
  Query: {
    bookCount: async () => Book.collection.countDocuments(),
    authorCount: async () => Author.collection.countDocuments(),
    allBooks: async (root, args) => {
      // if (args.author && args.genre) {
      //   return books.filter(
      //     b => b.author === args.author && b.genres.includes(args.genre)
      //   )
      // } else if (args.author) {
      //   return books.filter(b => b.author === args.author)
      // } else if (args.genre) {
      //   return books.filter(b => b.genres.includes(args.genre))
      // }
      return Book.find({}).populate('author')
    },
    allAuthors: async () => Author.find({})
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
        await author.save()
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

      return (await newBook.save()).populate('author')
    },
    editAuthor: (root, args) => {
      // const author = authors.find(a => a.name === args.name)
      // if (!author) {
      //   return null
      // }
      // const updatedAuthor = { ...author, born: args.setBornTo }
      // authors = authors.map(a => (a.name === author.name ? updatedAuthor : a))
      // return updatedAuthor
    }
  }
}

module.exports = resolvers
