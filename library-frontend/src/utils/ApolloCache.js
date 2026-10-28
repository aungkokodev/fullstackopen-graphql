import { ALL_BOOKS } from '../queries'

export const addBookToCache = (cache, bookToAdd) => {
  cache.updateQuery(
    {
      query: ALL_BOOKS,
      variables: { genre: '' }
    },
    ({ allBooks }) => {
      const bookExists = allBooks.some(book => book.id === bookToAdd)

      if (bookExists) {
        return { allBooks }
      }

      return {
        allBooks: allBooks.concat(bookToAdd)
      }
    }
  )
}
