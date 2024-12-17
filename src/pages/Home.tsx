import MainLayout from '../layouts/MainLayout'
import Sidebar from '../components/Sidebar'
import ProtectedRoutes from '../components/ProtectedRoutes'
import AuthOverlay from '../components/AuthOverlay'
import ProfileSettings from '../components/ProfileSettings'
import RoomList from '../components/RoomList'
import AddChatroom from '../components/AddChatroom'

function Home() {
  return (
    <>
      <MainLayout>
        <ProtectedRoutes>
          <AuthOverlay />
          <ProfileSettings />
          <Sidebar />
          <AddChatroom />
          <RoomList />
        </ProtectedRoutes>
      </MainLayout>
    </>
  )
}

export default Home
