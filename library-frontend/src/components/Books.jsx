import { useQuery } from '@apollo/client/react'
import { ALL_BOOKS } from '../queries'
import { useState } from 'react'

const Books = props => {
  const [filter, setFilter] = useState('')
  const query = useQuery(ALL_BOOKS)

  if (!props.show) {
    return null
  }

  const books = query.loading ? [] : query.data.allBooks
  const genres = [...new Set(books.flatMap(b => b.genres))]
  const filteredBooks =
    filter ? books.filter(b => b.genres.includes(filter)) : books

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
          {filteredBooks.map(a => (
            <tr key={a.id}>
              <td>{a.title}</td>
              <td>{a.author.name}</td>
              <td>{a.published}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {genres.map(genre => (
        <button key={genre} onClick={() => setFilter(genre)}>
          {genre}
        </button>
      ))}
      <button onClick={() => setFilter('')}>all genres</button>
    </div>
  )
}

export default Books
