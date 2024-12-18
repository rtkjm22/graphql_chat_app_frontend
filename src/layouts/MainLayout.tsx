import { Flex } from '@mantine/core'

const MainLayout = ({ children }: { children: React.ReactElement }) => {
  return (
    <Flex h={'100vh'}>
      <Flex w={'100%'}>{children}</Flex>
    </Flex>
  )
}

export default MainLayout
