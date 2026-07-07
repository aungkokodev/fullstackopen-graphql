import { useMutation, useQuery } from '@apollo/client/react'
import { useState } from 'react'
import { ALL_AUTHORS, UPDATE_AUTHOR } from '../queries'

const Authors = props => {
  const [name, setName] = useState('')
  const [born, setBorn] = useState('')
  const query = useQuery(ALL_AUTHORS)
  const [editAuthor] = useMutation(UPDATE_AUTHOR, {
    refetchQueries: [{ query: ALL_AUTHORS }]
  })

  if (!props.show) {
    return null
  }

  const authors = query.loading ? [] : query.data.allAuthors

  const handleSumbit = event => {
    event.preventDefault()

    editAuthor({ variables: { name, born: Number(born) } })

    setName('')
    setBorn('')
  }

  return (
    <div>
      <h2>authors</h2>
      <table>
        <tbody>
          <tr>
            <th></th>
            <th>born</th>
            <th>books</th>
          </tr>
          {authors.map(a => (
            <tr key={a.id}>
              <td>{a.name}</td>
              <td>{a.born}</td>
              <td>{a.bookCount}</td>
            </tr>
          ))}
        </tbody>
      </table>
      {props.authorize && (
        <>
          <h2>Set birthyear</h2>
          <form onSubmit={handleSumbit}>
            <div>
              <label>
                name
                <select
                  value={name}
                  name='name'
                  onChange={({ target }) => setName(target.value)}
                >
                  {authors.map(a => (
                    <option key={a.id} value={a.name}>
                      {a.name}
                    </option>
                  ))}
                </select>
              </label>
            </div>
            <div>
              <label>
                born
                <input
                  type='number'
                  value={born}
                  onChange={({ target }) => setBorn(target.value)}
                />
              </label>
            </div>
            <button type='submit'>update author</button>
          </form>
        </>
      )}
    </div>
  )
}

export default Authors
