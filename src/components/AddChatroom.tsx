import { useState } from 'react'
import { useGeneralStore } from '../stores/generalStore'
import {
  Button,
  Group,
  Modal,
  MultiSelect,
  Stepper,
  TextInput
} from '@mantine/core'
import { useMutation, useQuery } from '@apollo/client'
import {
  AddUsersToChatroomMutation,
  Chatroom,
  CreateChatroomMutation,
  SearchUsersQuery
} from '../gql/graphql'
import { CREATE_CHATROOM } from '../graphql/mutations/CreateChatroom'
import { useForm } from '@mantine/form'
import { SEARCH_USERS } from '../graphql/queries/SearchUsers'
import { ADD_USERS_TO_CHATROOM } from '../graphql/mutations/AddUsersToChatroom'

function AddChatroom() {
  const [active, setActive] = useState(1)
  const [highestStepVisited, setHighestStepVisited] = useState(active)
  const isCreateRoomModalOpen = useGeneralStore(
    (state) => state.isCreateRoomModalOpen
  )
  const toggleCreateRoomModal = useGeneralStore(
    (state) => state.toggleCreateRoomModal
  )
  const handleStepChange = (nextStep: number) => {
    const isOutOfBounds = nextStep > 2 || nextStep < 0
    if (isOutOfBounds) return
    setActive(nextStep)
    setHighestStepVisited((hSC) => Math.max(hSC, nextStep))
    console.log('うたれたよ')
  }

  const [createChatroom, { loading }] =
    useMutation<CreateChatroomMutation>(CREATE_CHATROOM)

  const form = useForm({
    initialValues: {
      name: ''
    },
    validate: {
      name: (value: string) =>
        value.trim().length >= 3 ? null : '名前は３文字以上で入力してください。'
    }
  })
  const [newlyCreatedChatroom, setNewlyCreatedChatroom] =
    useState<Chatroom | null>(null)

  const handleCreateChatroom = async () => {
    console.log('fuga')
    await createChatroom({
      variables: {
        name: form.values.name
      },
      onCompleted: (data) => {
        setNewlyCreatedChatroom(data.createChatroom)
        handleStepChange(active + 1)
      },
      onError: (error) => {
        console.log(error.graphQLErrors[0])
        form.setErrors({
          name: error.graphQLErrors[0].extensions?.name as string
        })
      },
      refetchQueries: ['GetChatroomsForUser']
    })
    console.log('hoge')
  }

  const [searchTerm, setSearchTerm] = useState('')
  const { data, refetch } = useQuery<SearchUsersQuery>(SEARCH_USERS, {
    variables: { fullname: searchTerm }
  })

  const [addUsersToChatroom, { loading: loadingAddUsers }] =
    useMutation<AddUsersToChatroomMutation>(ADD_USERS_TO_CHATROOM, {
      refetchQueries: ['GetChatroomsForUser']
    })

  const [selectedUsers, setSelectedUsers] = useState<string[]>([])
  const handleAddUsersToChatroom = async () => {
    await addUsersToChatroom({
      variables: {
        chatroomId:
          newlyCreatedChatroom?.id && parseInt(newlyCreatedChatroom?.id),
        userIds: selectedUsers.map((userId) => parseInt(userId))
      },
      onCompleted: () => {
        handleStepChange(1)
        toggleCreateRoomModal()
        setSelectedUsers([])
        setNewlyCreatedChatroom(null)
        form.reset()
      },
      onError: (error) => {
        form.setErrors({
          name: error.graphQLErrors[0].extensions?.name as string
        })
      }
    })
  }

  let debounceTimeout: NodeJS.Timeout

  const handleSearchChange = (term: string) => {
    setSearchTerm(term)
    clearTimeout(debounceTimeout)
    debounceTimeout = setTimeout(() => {
      refetch()
    }, 300)
  }

  type SelectItem = {
    label: string
    value: string
  }
  const selectItems: SelectItem[] =
    data?.searchUsers?.map((user) => ({
      label: user.fullname,
      value: String(user.id)
    })) || []

  return (
    <Modal opened={isCreateRoomModalOpen} onClose={toggleCreateRoomModal}>
      <Stepper active={active} onStepClick={setActive} orientation={'vertical'}>
        <Stepper.Step label="ステップ1" description="チャットルームの作成">
          <div>チャットルームの作成</div>
        </Stepper.Step>
        <Stepper.Step label="ステップ2" description="メンバーの追加">
          <form onSubmit={form.onSubmit(() => handleCreateChatroom())}>
            <TextInput
              placeholder="チャットルーム名を入力してください。"
              label="チャットルーム名"
              error={form.errors.name}
              {...form.getInputProps('name')}
            />
            <Button mt="md" type="submit">
              チャットルームを作成
            </Button>
          </form>
        </Stepper.Step>
        <Stepper.Completed>
          <MultiSelect
            onSearchChange={handleSearchChange}
            nothingFoundMessage="メンバーが見つかりませんでした。"
            searchable
            pb={'xl'}
            data={selectItems}
            label="チャットルームに追加したいメンバーを追加してください。"
            placeholder="参加が必要なメンバーをすべて追加してください。"
            onChange={(values) => setSelectedUsers(values)}
          />
        </Stepper.Completed>
      </Stepper>
      <Group mt="xl">
        <Button variant="default" onClick={() => handleStepChange(active - 1)}>
          Back
        </Button>
        <Button onClick={() => handleStepChange(active + 1)}>Next step</Button>

        {selectedUsers.length > 0 && (
          <Button
            onClick={() => handleAddUsersToChatroom()}
            color="blue"
            loading={loading}
          >
            Add Users
          </Button>
        )}
      </Group>
    </Modal>
  )
}

export default AddChatroom
