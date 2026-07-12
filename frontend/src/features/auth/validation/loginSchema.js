const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function validateLogin(values) {
  const errors = {}

  if (!values.email?.trim()) {
    errors.email = 'Email is required.'
  } else if (!EMAIL_REGEX.test(values.email.trim())) {
    errors.email = 'Please enter a valid email address.'
  }

  if (!values.password) {
    errors.password = 'Password is required.'
  } else if (values.password.length < 8) {
    errors.password = 'Password must be at least 8 characters.'
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  }
}
