import React from 'react'
import { View, Button } from 'react-native'

import { useAuth } from '../../contexts/auth'

const SignIn: React.FC = () => {
  const { signIn } = useAuth()

  const handleSignIn = () => {
    signIn()
  }
  return (
    <View style={{ flex: 1, justifyContent: 'center' }}>
      <Button title='SignIn' onPress={handleSignIn} />
    </View>
  )
}

export default SignIn