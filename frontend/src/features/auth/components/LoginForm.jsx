import { useMemo, useState } from 'react'
import { BusFront, Loader2, Mail } from 'lucide-react'
import { Link } from 'react-router-dom'
import PasswordInput from './PasswordInput'
import { useLogin } from '../hooks/useLogin'
import { validateLogin } from '../validation/loginSchema'

const INITIAL_FORM_STATE = {
  email: '',
  password: '',
  rememberMe: false,
}

export default function LoginForm() {
  const [formState, setFormState] = useState(INITIAL_FORM_STATE)
  const [showPassword, setShowPassword] = useState(false)
  const [fieldErrors, setFieldErrors] = useState({})
  const { isLoading, error, setError, loginUser } = useLogin()

  const isDisabled = useMemo(() => isLoading, [isLoading])

  const handleChange = (event) => {
    const { name, type, value, checked } = event.target

    setFormState((prev) => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value,
    }))

    if (fieldErrors[name]) {
      setFieldErrors((prev) => ({ ...prev, [name]: '' }))
    }

    if (error) {
      setError('')
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()

    const validation = validateLogin(formState)
    if (!validation.isValid) {
      setFieldErrors(validation.errors)
      return
    }

    setFieldErrors({})

    const payload = {
      email: formState.email.trim(),
      password: formState.password,
      rememberMe: formState.rememberMe,
    }

    await loginUser(payload)
  }

  return (
    <div className="mx-auto w-full max-w-md">
      <div className="rounded-3xl border border-slate-200/80 bg-white p-6 shadow-xl shadow-slate-200/60 sm:p-8">
        <div className="mb-8 space-y-3 text-center">
          <div className="mx-auto inline-flex size-12 items-center justify-center rounded-2xl bg-blue-600 text-white shadow-lg shadow-blue-200">
            <BusFront className="size-6" aria-hidden="true" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900">TransitOps</h1>
          <p className="text-sm text-slate-500">Smart Transport Operations Platform</p>
        </div>

        <form className="space-y-4" onSubmit={handleSubmit} noValidate>
          <div className="space-y-2">
            <label htmlFor="email" className="block text-sm font-medium text-slate-700">
              Email Address
            </label>

            <div className="relative">
              <Mail
                className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-slate-400"
                aria-hidden="true"
              />

              <input
                id="email"
                name="email"
                type="email"
                value={formState.email}
                onChange={handleChange}
                autoComplete="email"
                disabled={isDisabled}
                className="w-full rounded-xl border border-slate-200 bg-white py-2.5 pl-10 pr-3 text-slate-900 shadow-sm outline-none transition duration-200 placeholder:text-slate-400 focus:border-blue-600 focus:ring-4 focus:ring-blue-100 disabled:cursor-not-allowed disabled:opacity-70"
                aria-invalid={Boolean(fieldErrors.email)}
                aria-describedby={fieldErrors.email ? 'email-error' : undefined}
                placeholder="you@company.com"
              />
            </div>

            <p id="email-error" className="min-h-5 text-sm text-rose-600">
              {fieldErrors.email || ' '}
            </p>
          </div>

          <PasswordInput
            id="password"
            name="password"
            label="Password"
            value={formState.password}
            onChange={handleChange}
            error={fieldErrors.password}
            showPassword={showPassword}
            onToggle={() => setShowPassword((prev) => !prev)}
            disabled={isDisabled}
          />

          <div className="flex items-center justify-between gap-3">
            <label className="inline-flex items-center gap-2 text-sm text-slate-600">
              <input
                type="checkbox"
                name="rememberMe"
                checked={formState.rememberMe}
                onChange={handleChange}
                disabled={isDisabled}
                className="size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500"
              />
              Remember me
            </label>

            <a
              href="#"
              className="text-sm font-medium text-blue-600 transition hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              Forgot Password?
            </a>
          </div>

          <div className="min-h-6 text-sm" role="status" aria-live="polite">
            {error ? <p className="text-rose-600">{error}</p> : <p className="text-transparent">placeholder</p>}
          </div>

          <button
            type="submit"
            disabled={isDisabled}
            className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-blue-600 px-4 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-200 transition hover:bg-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:bg-blue-400"
          >
            {isLoading ? (
              <>
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                Signing in...
              </>
            ) : (
              'Sign In'
            )}
          </button>
          
            /** To create account for new users */
          <p className="text-center text-sm text-slate-600">
            Don&apos;t have an account?{' '}
            /** Goes to Register page */
            <Link
              to="/register"
              className="font-semibold text-blue-600 transition hover:text-blue-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-500"
            >
              Create account
            </Link>
          </p>
        </form>
      </div>
    </div>
  )
}
