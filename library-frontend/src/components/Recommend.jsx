import { useQuery } from '@apollo/client/react'
import { ALL_BOOKS, ME } from '../queries'

const Recommend = props => {
  const bookQuery = useQuery(ALL_BOOKS, { skip: !props.show })
  const meQuery = useQuery(ME, { skip: !props.show })

  if (!props.show) {
    return null
  }

  if (bookQuery.loading || meQuery.loading) {
    return <p>loading...</p>
  }

  const books = bookQuery?.data?.allBooks || []
  const favoriteGenre = meQuery?.data?.me?.favoriteGenre
  const recommendedBooks = books.filter(b => b.genres.includes(favoriteGenre))

  return (
    <div>
      <h2>recommendations</h2>
      <p>
        books in your favorite genre <b>{meQuery.data?.me?.favoriteGenre}</b>
      </p>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>author</th>
            <th>published</th>
          </tr>
          {recommendedBooks.map(a => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Recommend
