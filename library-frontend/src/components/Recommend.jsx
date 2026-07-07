import { useQuery } from '@apollo/client/react'
import { ALL_BOOKS, ME } from '../queries'

const Recommend = props => {
  const meQuery = useQuery(ME, { skip: !props.show })

  const favoriteGenre = meQuery?.data?.me?.favoriteGenre || null

  const bookQuery = useQuery(ALL_BOOKS, {
    skip: !props.show,
    variables: {
      genre: favoriteGenre
    }
  })

  if (!props.show) {
    return null
  }

  if (bookQuery.loading || meQuery.loading) {
    return <p>loading...</p>
  }

  const books = bookQuery?.data?.allBooks || []

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
          {books.map(a => (
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
