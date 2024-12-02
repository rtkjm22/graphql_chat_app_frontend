import {
  Button,
  Grid,
  Group,
  Modal,
  Paper,
  Text,
  TextInput
} from '@mantine/core'
import { useGeneralStore } from '../stores/generalStore'
import { Form, useForm } from '@mantine/form'
import { useUserStore } from '../stores/userStore'
import { GraphQLErrorExtensions } from 'graphql'
import React, { useState } from 'react'
import { useMutation } from '@apollo/client'
import { REGISTER_USER } from '../graphql/mutations/Register.ts'
import { RegisterUserMutation } from '../gql/graphql.ts'

function AuthOverlay() {
  const isLoginModalOpen = useGeneralStore((state) => state.isLoginModalOpen)
  const toggleLoginModal = useGeneralStore((state) => state.toggleLoginModal)

  return (
    <Modal centered opened={isLoginModalOpen} onClose={toggleLoginModal}>
      <Register />
    </Modal>
  )
}

const Register = () => {
  const form = useForm({
    initialValues: {
      fullname: '',
      email: '',
      password: '',
      confirmPassword: ''
    },
    validate: {
      fullname: (value: string) =>
        value.trim().length >= 3
          ? null
          : '名前は３文字以上で入力してください。',
      email: (value: string) =>
        value.includes('@') ? null : '不正なメールアドレスです。',
      password: (value: string) =>
        value.trim().length >= 3
          ? null
          : 'パスワードは３文字以上で入力してください。',
      confirmPassword: (value: string, values) =>
        value.trim().length >= 3 && value === values.password
          ? null
          : 'パスワードが一致しません。'
    }
  })

  const setUser = useUserStore((state) => state.setUser)
  const setIsLoginOpen = useGeneralStore((state) => state.toggleLoginModal)

  const [errors, setErrors] = React.useState<GraphQLErrorExtensions>({})
  const [registerUser, { loading, data }] =
    useMutation<RegisterUserMutation>(REGISTER_USER)

  const handleRegister = async () => {
    setErrors({})
    await registerUser({
      variables: {
        email: form.values.email,
        password: form.values.password,
        fullname: form.values.fullname,
        confirmPassword: form.values.confirmPassword
      },
      onCompleted: (data) => {
        setErrors({})
        if (data?.register.user)
          setUser({
            id: data?.register.user.id,
            email: data?.register.user.email,
            fullname: data?.register.user.fullname
          })
        setIsLoginOpen()
      }
    }).catch((err) => {
      console.log(err.GraphQLErrorExtensions, 'ERROR')
      setErrors(err.GraphQLErrorExtensions[0])
      useGeneralStore.setState({ isLoginModalOpen: true })
    })
  }

  const [isRegister, setIsRegister] = useState(false)
  const toggleForm = () => {
    setIsRegister(!isRegister)
  }

  return (
    <Paper>
      <Text ta="center" size="xl">
        Register
      </Text>

      <form
        onSubmit={form.onSubmit(() => {
          handleRegister()
        })}
      >
        <Grid>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              label="氏名"
              placeholder="田中 太郎"
              {...form.getInputProps('fullname')}
              error={form.errors.fullname || (errors?.fullname as string)}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              autoComplete="off"
              label="メールアドレス"
              placeholder="メールアドレス"
              {...form.getInputProps('email')}
              error={form.errors.email || (errors?.email as string)}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              autoComplete="off"
              label="パスワード"
              placeholder="パスワード"
              type="password"
              {...form.getInputProps('password')}
              error={form.errors.password || (errors?.password as string)}
            />
          </Grid.Col>
          <Grid.Col span={{ base: 12, md: 6 }}>
            <TextInput
              autoComplete="off"
              label="パスワード(確認用)"
              placeholder="パスワード（確認用）"
              type="password"
              {...form.getInputProps('confirmPassword')}
              error={
                form.errors.confirmPassword ||
                (errors?.confirmPassword as string)
              }
            />
          </Grid.Col>
          <Grid.Col span={12}>
            <Button
              variant="white"
              color="black"
              fw={'normal'}
              onClick={toggleForm}
              pl={0}
            >
              すでに登録されている方はこちらからログインしてください。
            </Button>
          </Grid.Col>
        </Grid>
        <Group justify="left" mt={20}>
          <Button
            variant="outline"
            color="blue"
            type="submit"
            disabled={loading}
          >
            登録する
          </Button>
          <Button variant="outline" color="red">
            キャンセル
          </Button>
        </Group>
      </form>
    </Paper>
  )
}

export default AuthOverlay
