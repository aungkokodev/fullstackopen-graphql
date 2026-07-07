import { useMutation } from '@apollo/client/react'
import { useState } from 'react'
import { LOGIN } from '../queries'

const Login = ({ show, onSuccess }) => {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [login] = useMutation(LOGIN, {
    onCompleted: data => {
      const token = data.login.value
      setUsername('')
      setPassword('')
      setError('')
      onSuccess(token)
    },
    onError: () => {
      setError('login failed')
    }
  })

  const handleSubmit = e => {
    e.preventDefault()
    login({ variables: { username, password } })
  }

  if (!show) {
    return null
  }

  return (
    <div>
      <h2>Login</h2>
      {error && <p>{error}</p>}
      <form onSubmit={handleSubmit}>
        <div>
          <label>
            username
            <input
              type='text'
              value={username}
              onChange={({ target }) => setUsername(target.value)}
            />
          </label>
        </div>
        <div>
          <label>
            password
            <input
              type='password'
              value={password}
              onChange={({ target }) => setPassword(target.value)}
            />
          </label>
        </div>
        <button type='submit'>login</button>
      </form>
    </div>
  )
}

export default Login
