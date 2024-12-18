import React, { useEffect } from 'react'
import { useParams } from 'react-router-dom'
import Chatwindow from './Chatwindow'
import { Flex, Text } from '@mantine/core'

function JoinRoomOrChatwindow() {
  const { id } = useParams<{ id: string }>()

  const [content, setContent] = React.useState<string | React.ReactNode>('')

  useEffect(() => {
    if (!id) setContent('チャットルームを選んでください。')
    else setContent(<Chatwindow />)
  }, [setContent, id])

  return (
    <Flex w={'100%'} h="100vh" align={'center'} justify={'center'}>
      <Text size={!id ? 'xl' : undefined}>{content}</Text>
    </Flex>
  )
}

export default JoinRoomOrChatwindow
