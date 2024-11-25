import { gql } from '@apollo/client'

export const REGISTER_USER = gql`
  mutation RegisterUser(
    $fullname: String!
    $email: String!
    $email: String!
    $password: String!
    $confirmPassword: String!
  ) {
    register(
      RegisterInput: {
        fullname: $fullname
        email: $email
        password: $password
        confirmPassword: $confirmPassword
      }
    ) {
      user {
        id
        fullname
        email
      }
    }
  }
`
