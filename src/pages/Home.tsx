import MainLayout from '../layouts/MainLayout'
import Sidebar from '../components/Sidebar'
import { List, Text } from '@mantine/core'

function Home() {
  return (
    <>
      <MainLayout>
        <>
          <Sidebar />
          <Text c='blue'>home page</Text>
        </>
      </MainLayout>
    </>
  )
}

export default Home
