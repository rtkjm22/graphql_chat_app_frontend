import './App.css'
import '@mantine/core/styles.css'
import { MantineProvider } from '@mantine/core'
import { Card, Text } from '@mantine/core'

function App() {
  return (
    <>
      <MantineProvider>
        <Card shadow='lg'>
          <Text fs="italic">hogehgoe</Text>
        </Card>
      </MantineProvider>
    </>
  )
}

export default App
