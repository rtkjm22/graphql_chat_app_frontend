import { Flex } from '@mantine/core'

const MainLayout = ({ children }: { children: React.ReactElement }) => {
  return (
    <Flex justify={'center'} align={'center'} h={'100vh'}>
      <Flex justify={'center'} align={'center'}>
        {children}
      </Flex>
    </Flex>
  )
}

export default MainLayout
