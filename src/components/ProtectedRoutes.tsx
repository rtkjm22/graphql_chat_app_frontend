import React, { useEffect } from 'react'
import { useUserStore } from '../stores/userStore'
import { useGeneralStore } from '../stores/generalStore'

const ProtectedRoutes = ({ children }: { children: React.ReactNode }) => {
  const userId = useUserStore((state) => state.id)
  const toggleLoginModal = useGeneralStore((state) => state.toggleLoginModal)

  useEffect(() => {
    if (!userId) {
      toggleLoginModal()
    }
  }, [toggleLoginModal, userId])

  // TODO: userストアが正しくlocalstorageに登録されていないため要確認
  // if (userId) {
  return children
  // }
  // return <>Protected</>
}

export default ProtectedRoutes
