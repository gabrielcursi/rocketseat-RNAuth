import React, { createContext, useState, useEffect, useContext } from "react";
import AsyncStorage from '@react-native-async-storage/async-storage'
import * as auth from '../services/auth'
import api from '../services/api'

interface User {
  name: string;
  email: string;
}

interface AuthContextData {
  signed: boolean;
  user: User | null;
  loading: Boolean;
  signIn(): Promise<void>
  signOut(): void
}

const AuthContext = createContext<AuthContextData>({} as AuthContextData)

export const AuthProvider: React.FC = ({ children }) => {
  const [user, setUser] = useState<object | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStoragedData() {
      const storagedUser = await AsyncStorage.getItem('@RNAuth:user')
      const storagedToken = await AsyncStorage.getItem('@RNAuth:token')
      if (storagedUser && storagedToken) {
        setUser(JSON.parse(storagedUser))
        setLoading(false)
      }
    }
    loadStoragedData()
  }, [])


  async function signIn() {
    const response = await auth.signIn()
    console.log(response)
    setUser(response.user)

    api.defaults.headers.common['Authorization'] = `Bearer ${response.token}`

    // USAR O MULTGET do AsyncStorage
    AsyncStorage.setItem('@RNAuth:user', JSON.stringify(response.user))
    AsyncStorage.setItem('@RNAuth:token', response.token)
  }

  function signOut() {
    AsyncStorage.clear().then(() => {
      setUser(null)
    })
  }

  // if(loading) {
  //   return(
  //     <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
  //       <ActivityIndicator size="large" color="#666" />

  //     </View>
  //   )
  // }

  return (
    <AuthContext.Provider value={{ signed: !!user, signIn, loading, user, signOut }}>
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)

  return context
}