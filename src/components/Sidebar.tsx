import { useState } from 'react'
import { useGeneralStore } from '../stores/generalStore'
import { useUserStore } from '../stores/userStore'
import { Center, Tooltip, Stack, NavLink, Box } from '@mantine/core'
import {
  IconUser,
  IconLogout,
  IconBrandMessenger,
  IconLogin
} from '@tabler/icons-react'
import { useMutation } from '@apollo/client'
import { LOGOUT_USER } from '../graphql/mutations/Logout'

const mockdata = [{ icon: IconBrandMessenger, label: 'messenger' }]

function Sidebar() {
  const toggleProfileSettingsModal = useGeneralStore(
    (state) => state.toggleProfileSettingsModal
  )
  const [active, setActive] = useState(0)
  const links = mockdata.map((link, index) => (
    <NavLink
      {...link}
      key={link.label}
      active={index === active}
      onClick={() => setActive(index)}
    />
  ))

  const userId = useUserStore((state) => state.id)
  const user = useUserStore((state) => state)
  const setUser = useUserStore((state) => state.setUser)
  const toggleLoginModal = useGeneralStore((state) => state.toggleLoginModal)
  const [logoutUser, { loading, error }] = useMutation(LOGOUT_USER, {
    onCompleted: () => {
      toggleLoginModal()
    }
  })

  const handleLogout = async () => {
    await logoutUser()
    setUser({
      id: undefined,
      fullname: '',
      email: '',
      avatarUrl: null
    })
  }

  return (
    <Box
      style={(theme) => ({
        position: 'fixed',
        zIndex: 100,
        borderRight: `1px solid ${theme.colors.gray[6]}`,
        height: '100vh'
      })}
      p="md"
    >
      <Stack align="flex-start" h={'100%'} justify="space-around">
        <Stack gap={0}>
          <NavLink
            label={
              <Center>
                <IconBrandMessenger size={30} />
              </Center>
            }
          />
          {userId && links}
        </Stack>
        <Stack gap={'xl'}>
          {userId && (
            <NavLink
              onClick={toggleProfileSettingsModal}
              label={
                <Center>
                  <IconUser size={24} stroke={1.5} />
                </Center>
              }
            />
          )}

          {userId ? (
            <Tooltip label="Logout">
              <NavLink
                onClick={handleLogout}
                label={
                  <Center>
                    <IconLogout size={24} stroke={1.5} />
                  </Center>
                }
              />
            </Tooltip>
          ) : (
            <Tooltip label="Login">
              <NavLink
                onClick={toggleLoginModal}
                label={
                  <Center>
                    <IconLogin size={24} stroke={1.5} />
                  </Center>
                }
              />
            </Tooltip>
          )}
        </Stack>
      </Stack>
    </Box>
  )
}

export default Sidebar
