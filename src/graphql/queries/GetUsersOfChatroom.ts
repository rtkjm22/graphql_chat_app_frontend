import { gql } from '@apollo/client'

export const GET_USERS_OF_CHATROOM = gql`
  query GET_USERS_OF_CHATROOM($chatroomId: Float!) {
    getUsersOfChatroom(chatroomId: $chatroomId) {
      id
      fullname
      email
      avatarUrl
    }
  }
`
