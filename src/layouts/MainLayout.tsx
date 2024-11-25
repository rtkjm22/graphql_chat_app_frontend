import { Flex } from '@mantine/core'

const MainLayout = ({ children }: { children: React.ReactElement }) => {
  return (
    <Flex align={'center'} justify={'center'} h={'100vh'}>
      <Flex bg="gray" align={'center'} justify="center">
        {children}
      </Flex>
    </Flex>
  )
}

export default MainLayout
