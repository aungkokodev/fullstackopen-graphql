import { useState } from 'react'
import Authors from './components/Authors'
import Books from './components/Books'
import Login from './components/Login'
import NewBook from './components/NewBook'
import Recommend from './components/Recommend'

const App = () => {
  const [page, setPage] = useState('authors')
  const [token, setToken] = useState(localStorage.getItem('auth-token'))

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
    </div>
  )
}

export default App
