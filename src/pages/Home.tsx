import MainLayout from '../layouts/MainLayout'
import Sidebar from '../components/Sidebar'
import ProtectedRoutes from '../components/ProtectedRoutes'
import AuthOverlay from '../components/AuthOverlay'
import ProfileSettings from '../components/ProfileSettings'
import RoomList from '../components/RoomList'
import AddChatroom from '../components/AddChatroom'
import { Flex } from '@mantine/core'
import JoinRoomOrChatwindow from '../components/JoinRoomOrChatwindow'

function Home() {
  return (
    <>
      <MainLayout>
        <>
          <AuthOverlay />
          <ProfileSettings />
          <Sidebar />
          <ProtectedRoutes>
            <AddChatroom />
            <Flex w={"100%"} direction={{ base: 'column', sm: 'row' }}>
              <RoomList />
              <JoinRoomOrChatwindow />
            </Flex>
          </ProtectedRoutes>
        </>
      </MainLayout>
    </>
  )
}

export default Home
