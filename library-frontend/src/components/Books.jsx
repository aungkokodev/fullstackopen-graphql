import { useQuery } from '@apollo/client/react'
import { useState } from 'react'
import { ALL_BOOKS, ALL_GENRES } from '../queries'

const Books = props => {
  const [filter, setFilter] = useState('')
  const genreQuery = useQuery(ALL_GENRES, { skip: !props.show })
  const bookQuery = useQuery(ALL_BOOKS, {
    skip: !props.show,
    variables: {
      genre: filter
    }
  })

  if (!props.show) {
    return null
  }

  if (genreQuery.loading || bookQuery.loading) {
    return null
  }

  const books = bookQuery?.data?.allBooks || []
  const genres = genreQuery?.data?.allGenres || []
  const uniqueGenres = [...new Set(genres.flatMap(b => b.genres))]

  return (
    <div>
      <h2>books</h2>
      {filter && (
        <p>
          in genre <b>{filter}</b>
        </p>
      )}
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
      {uniqueGenres.map(genre => (
        <button key={genre} onClick={() => setFilter(genre)}>
          {genre}
        </button>
      ))}
      <button onClick={() => setFilter('')}>all genres</button>
    </div>
  )
}

export default Books
