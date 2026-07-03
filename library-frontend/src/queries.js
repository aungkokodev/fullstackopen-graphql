import { gql } from '@apollo/client'

export const ALL_AUTHORS = gql`
  query {
    allAuthors {
      id
      name
      born
      # bookCount
    }
  }
`

export const ALL_BOOKS = gql`
  query {
    allBooks {
      id
      title
      published
      author {
        id
        name
        born
        # bookCount
      }
    }
  }
`

export const ADD_BOOK = gql`
  mutation addBook(
    $title: String!
    $author: String!
    $published: Int!
    $genres: [String!]!
  ) {
    addBook(
      title: $title
      author: $author
      published: $published
      genres: $genres
    ) {
      id
      title
      published
      author {
        id
        name
        born
        # bookCount
      }
    }
  }
`

export const UPDATE_AUTHOR = gql`
  mutation updateAuthor($name: String!, $born: Int!) {
    editAuthor(name: $name, setBornTo: $born) {
      name
    }
  }
`

export const LOGIN = gql`
  mutation login($username: String!, $password: String!) {
    login(username: $username, password: $password) {
      value
    }
  }
`
