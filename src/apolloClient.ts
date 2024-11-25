import {
  ApolloClient,
  InMemoryCache,
  NormalizedCacheObject,
  gql,
  Observable,
  ApolloLink,
  split
} from '@apollo/client'
import { WebSocketLink } from '@apollo/client/link/ws'
import createUploadLink from 'apollo-upload-client/createUploadLink.mjs'
import { getMainDefinition } from '@apollo/client/utilities'
import { onError } from '@apollo/client/link/error'
import { loadErrorMessages, loadDevMessages } from '@apollo/client/dev'
import { useUserStore } from './stores/userStore'

loadErrorMessages()
loadDevMessages()

async function refreshToken(client: ApolloClient<NormalizedCacheObject>) {
  try {
    const { data } = await client.mutate({
      mutation: gql`
        mutation RefreshToken {
          refreshToken
        }
      `
    })

    const newAccessToken = data?.refreshToken
    if (!newAccessToken) {
      throw new Error('新しいアクセストークンの取得に失敗しました。')
    }
    return `Bearer ${newAccessToken}`
  } catch (error) {
    throw new Error('新しいアクセストークンの取得時にエラーが発生しました。')
  }
}
let retryCount = 0
const maxRetry = 3

const wsLink = new WebSocketLink({
  uri: `ws://localhost:3000/graphql`,
  options: {
    reconnect: true,
    connectionParams: {
      Authorization: `Bearer ${localStorage.getItem('accessToken')}`
    }
  }
})

const errorLink = onError(({ GraphQLErrors, operation, forward }) => {
  for (const err of GraphQLErrors) {
    if (err.extensions.code === 'UNAUTHENTICATED' && retryCount < maxRetry) {
      retryCount++
      return new Observable((observer) => {
        refreshToken(client)
          .then((token) => {
            console.log('token', token)
            operation.setContext((previousContext: any) => ({
              headers: {
                ...previousContext.headers,
                authorization: token
              }
            }))
            const forward$ = forward(operation)
            forward$.subscribe(observer)
          })
          .catch((error) => observer.error(error))
      })
    }
    if (err.massage === 'Refresh token not found') {
      console.log('リフレッシュトークンが見つかりません。')
      useUserStore.setState({
        id: undefined,
        fullname: '',
        email: ''
      })
    }
  }
})

const uploadLink = createUploadLink({
  uri: 'http://localhost:3000/graphql',
  credentials: 'include',
  headers: {
    'apollo-require-preflight': 'true'
  }
})

const link = split(
  ({ query }) => {
    const definition = getMainDefinition(query)
    return (
      definition.kind === 'OperationDefinition' &&
      definition.operation === 'subscription'
    )
  },
  wsLink,
  ApolloLink.from([errorLink, uploadLink])
)

export const client = new ApolloClient({
  uri: 'http://localhost:3000/graphql',
  cache: new InMemoryCache({}),
  credentials: 'include',
  headers: {
    'Content-Type': 'application/json'
  },
  link: link
})
