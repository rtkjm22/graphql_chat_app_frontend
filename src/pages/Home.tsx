import MainLayout from '../layouts/MainLayout'
import Sidebar from '../components/Sidebar'
import ProtectedRoutes from '../components/ProtectedRoutes'
import { Text } from '@mantine/core'
import AuthOverlay from '../components/AuthOverlay'

function Home() {
  return (
    <>
      <MainLayout>
        <ProtectedRoutes>
          <AuthOverlay />
          <Sidebar />
          <Text bg={'blue'}>hogehoge</Text>
        </ProtectedRoutes>
      </MainLayout>
    </>
  )
}

export default Home
