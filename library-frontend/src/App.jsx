import { useApolloClient, useSubscription } from '@apollo/client/react'
import { useState } from 'react'
import { Toaster, toast } from 'react-hot-toast'
import Authors from './components/Authors'
import Books from './components/Books'
import Login from './components/Login'
import NewBook from './components/NewBook'
import Recommend from './components/Recommend'
import { BOOK_ADDED } from './queries'
import { addBookToCache } from './utils/ApolloCache'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(localStorage.getItem('auth-token'))

  const client = useApolloClient()

  const handleLogin = token => {
    setToken(token)
    localStorage.setItem('auth-token', token)
    setPage('authors')
  }

  const handleLogout = () => {
    setToken(null)
    localStorage.removeItem('auth-token')
    setPage('authors')
  }

  useSubscription(BOOK_ADDED, {
    onData: ({ data }) => {
      const newBook = data?.data?.bookAdded
      if (newBook) {
        addBookToCache(client.cache, newBook)
        toast.success(
          `NEW BOOK ${newBook.title} by ${newBook.author.name} ADDED`,
          {
            duration: 5000
          }
        )
      }
    }
  })

  return (
    <div>
      <div>
        <button onClick={() => setPage('authors')}>authors</button>
        <button onClick={() => setPage('books')}>books</button>
        {token ?
          <>
            <button onClick={() => setPage('add')}>add book</button>
            <button onClick={() => setPage('recommend')}>recommend</button>
            <button onClick={handleLogout}>logout</button>
          </>
        : <button onClick={() => setPage('login')}>login</button>}
      </div>

      <Authors show={page === 'authors'} authorize={Boolean(token)} />
      <Books show={page === 'books'} />
      <Recommend show={page === 'recommend'} />
      <NewBook show={page === 'add'} />
      <Login show={page === 'login'} onSuccess={handleLogin} />
      <Toaster position='top-right' />
    </div>
  )
}

export default App
