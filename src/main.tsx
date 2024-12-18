import React from 'react'
import ReactDOM from 'react-dom/client'
import './index.css'
import '@mantine/core/styles.css'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import { ApolloProvider } from '@apollo/client'
import { client } from './apolloClient'
import Home from './pages/Home.tsx'
import { MantineProvider } from '@mantine/core'

const router = createBrowserRouter(
  [
    {
      path: '/',
      element: <Home />,
      children: [
        {
          path: '/chatrooms/:id'
        }
      ]
    }
  ],
  {
    future: {
      v7_relativeSplatPath: true,
      v7_fetcherPersist: true,
      v7_normalizeFormMethod: true,
      v7_partialHydration: true
    }
  }
)

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ApolloProvider client={client}>
      <MantineProvider>
        <RouterProvider router={router} />
      </MantineProvider>
    </ApolloProvider>
  </React.StrictMode>
)
