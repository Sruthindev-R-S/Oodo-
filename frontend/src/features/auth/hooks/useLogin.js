import { useState } from 'react'
import { login } from '../services/authApi'

function getErrorMessage(error) {
  return (
    error?.response?.data?.message ||
    error?.message ||
    'Unable to sign in. Please try again.'
  )
}

export function useLogin() {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState('')

  const loginUser = async (credentials) => {
    setIsLoading(true)
    setError('')

    try {
      const response = await login(credentials)
      return response.data
    } catch (err) {
      setError(getErrorMessage(err))
      return null
    } finally {
      setIsLoading(false)
    }
  }

  return {
    isLoading,
    error,
    setError,
    loginUser,
  }
}
