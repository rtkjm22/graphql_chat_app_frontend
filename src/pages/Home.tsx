import MainLayout from '../layouts/MainLayout'
import Sidebar from '../components/Sidebar'
import ProtectedRoutes from '../components/ProtectedRoutes'
import AuthOverlay from '../components/AuthOverlay'
import ProfileSettings from '../components/ProfileSettings'

function Home() {
  return (
    <>
      <MainLayout>
        <ProtectedRoutes>
          <AuthOverlay />
          <ProfileSettings />
          <Sidebar />
        </ProtectedRoutes>
      </MainLayout>
    </>
  )
}

export default Home
